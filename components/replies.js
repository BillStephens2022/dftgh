import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Reply from "./reply";
import { deleteComment } from "./lib/api";
import { formatDate } from "@/components/lib/dates";
import classes from "@/components/replies.module.css";

const Replies = ({
  comment,
  episodeId,
  initialReplies,
  handleAddComment,
  setEpisode,
  onReplyAdded,
}) => {
  const { data: session } = useSession();
  const [commentFormData, setCommentFormData] = useState({
    name: "",
    commentText: "",
    parentComment: null,
  });
  const [replies, setReplies] = useState(initialReplies);
  const [showConfirmation, setShowConfirmation] = useState(null);

  useEffect(() => {
    if (comment.replies) {
      setReplies(comment.replies);
    }
  }, [comment.replies]);

  useEffect(() => {
    // Set the parent comment in the form data
    setCommentFormData((prevData) => ({
      ...prevData,
      parentComment: comment || null,
      name: session?.user?.username || prevData.name || "",
    }));
  }, [comment, session]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCommentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteReply = async (event, episodeId, replyId) => {
    event.preventDefault();
    event.stopPropagation();
    setShowConfirmation([episodeId, replyId]);
  };

  const addReplyRecursively = (replies, parentId, newReply) => {
    return replies.map((reply) => {
      if (reply._id === parentId) {
        // Add the new reply to the correct parent
        return {
          ...reply,
          replies: [...reply.replies, newReply],
        };
      }
      return {
        ...reply,
        replies: addReplyRecursively(reply.replies, parentId, newReply),
      };
    });
  };

  const handleSubmit = async (event, formData, parentReply) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("parent reply", parentReply);
    const optimisticReply = {
      _id: `temp-${Date.now()}`, // Temporary ID to identify the optimistic reply
      name: formData.name,
      commentText: formData.commentText,
      createdAt: new Date().toISOString(), // Fake creation time
      parentId: parentReply ? parentReply._id : null, // Initialize parentId
      replies: [], // Initialize replies
    };

    onReplyAdded(optimisticReply, parentReply._id);

    // Add the reply optimistically
    setReplies((prevReplies) =>
      parentReply._id === comment._id
        ? [...prevReplies, optimisticReply]
        : addReplyRecursively(prevReplies, parentReply._id, optimisticReply)
    );

    // Clear the form immediately
    setCommentFormData({
      name: session?.user?.username || "",
      commentText: "",
      parentComment: null,
    });

    try {
      // Send the reply to the server
      const newReply = await handleAddComment({
        ...formData,
        parentId: parentReply?._id,
      });

      // Notify the parent to update the optimistic reply with server data
      onReplyAdded(newReply, optimisticReply._id);
      console.log("replies before adding new reply", replies);

      console.log("Optimistic reply id", optimisticReply._id);

      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply._id === optimisticReply._id
            ? newReply
            : reply._id === parentReply?._id
            ? {
                ...reply,
                replies: reply.replies.map((r) =>
                  r._id === optimisticReply._id ? newReply : r
                ),
              }
            : reply
        )
      );

      console.log(
        "replies after adding new reply, removing optimistic reply",
        replies
      );
    } catch (error) {
      // Notify the parent to remove or revert the optimistic reply
      onReplyAdded(null, optimisticReply._id);
      console.error("Failed to add comment:", error);

      // Roll back the optimistic update on error
      setReplies((prevReplies) => {
        if (parentReply?._id) {
          // Remove from the parent reply's children
          return prevReplies.map((reply) =>
            reply._id === parentReply._id
              ? {
                  ...reply,
                  replies: reply.replies.filter(
                    (r) => r._id !== optimisticReply._id
                  ),
                }
              : reply
          );
        }
        // Remove from top-level replies
        return prevReplies.filter((reply) => reply._id !== optimisticReply._id);
      });
    }
  };

  const removeReplyRecursively = (replies, replyId) => {
    return replies
      .filter((reply) => reply._id !== replyId)
      .map((reply) => ({
        ...reply,
        replies: removeReplyRecursively(reply.replies, replyId),
      }));
  };

  const confirmDeleteReply = async ([episodeId, replyId]) => {
    console.log("deleting reply", replyId);
    try {
      const success = await deleteComment(episodeId, replyId);
      if (success) {
        console.log("Reply deleted successfully");
        console.log(
          "replies before deleting from replies state",
          replies,
          replyId
        );

        // remove replies recursively
        setReplies((prevReplies) =>
          removeReplyRecursively(prevReplies, replyId)
        );

        // Update the episode state to remove the deleted comment
        setEpisode((prevEpisode) => ({
          ...prevEpisode,
          comments: prevEpisode.comments.map((comment) => ({
            ...comment,
            replies: comment.replies.filter((reply) => reply._id !== replyId),
          })),
        }));
      } else {
        console.error("Error deleting reply");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const cancelDeleteReply = () => {
    setShowConfirmation(null); // Reset confirmation without deleting
  };

  return (
    <div className={classes.replies_container}>
      <div className={classes.original_comment_body}>
        <div className={classes.comment_header}>
          <span>{comment.name}</span>
          <span>{formatDate(comment.createdAt)}</span>
        </div>
        <div className={classes.comment_text}>
          <p>{comment.commentText}</p>
        </div>
      </div>
      <div className={classes.replies_body}>
        {replies?.length > 0 ? (
          replies.map((reply) => (
            <Reply
              key={reply._id}
              reply={reply}
              depth={0}
              episodeId={episodeId}
              onSubmit={handleSubmit}
              handleAddComment={handleAddComment}
              handleDeleteReply={handleDeleteReply}
              showConfirmation={showConfirmation}
              confirmDeleteReply={confirmDeleteReply}
              cancelDeleteReply={cancelDeleteReply}
              session={session}
              onReplyAdded={onReplyAdded}
              classes={classes}
            />
          ))
        ) : (
          <div>No replies yet</div>
        )}
      </div>
      <form
        className={classes.reply_form}
        onSubmit={(event) => handleSubmit(event, commentFormData, comment)}
      >
        <div className={classes.reply_form_group}>
          <input
            className={classes.reply_form_input}
            type="text"
            name="name"
            id="name"
            value={commentFormData.name}
            placeholder={session ? session.user.username : "Your Name"}
            onChange={handleInputChange}
            disabled={session}
          />
        </div>
        <div className={classes.reply_form_group}>
          <textarea
            className={classes.reply_form_textarea}
            name="commentText"
            id="comment"
            placeholder="Reply"
            value={commentFormData.commentText}
            onChange={handleInputChange}
            rows="3"
          />
        </div>
        <div className={classes.reply_form_group}>
          <button type="submit" className={classes.reply_submit_button}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Replies;
