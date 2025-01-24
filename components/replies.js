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

  const handleSubmit = async (event, parentReply) => {
    event.preventDefault();
    event.stopPropagation();

    const optimisticReply = {
      _id: `temp-${Date.now()}`, // Temporary ID to identify the optimistic reply
      name: commentFormData.name,
      commentText: commentFormData.commentText,
      createdAt: new Date().toISOString(), // Fake creation time
      parentId: parentReply, // Initialize parentId
      replies: [], // Initialize replies
    };

    onReplyAdded(optimisticReply, parentReply._id);
    
    // Add the reply optimistically
    setReplies((prevReplies) => [...prevReplies, optimisticReply]);

    // Clear the form immediately
    setCommentFormData((prevData) => ({
      ...prevData,
      commentText: "",
    }));

    try {
      const payload = {
        ...commentFormData,
        parentId: parentReply,
      };

      const newReply = await handleAddComment(payload);

      // Notify the parent to update the optimistic reply with server data
      onReplyAdded(newReply, optimisticReply._id);
      console.log("replies before adding new reply", replies);
     
      console.log("Optimistic reply id", optimisticReply._id);
      
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply._id === optimisticReply._id ? newReply : reply
        )
      );
      console.log("replies after adding new reply, removing optimistic reply", replies);
    } catch (error) {
      // Notify the parent to remove or revert the optimistic reply
      onReplyAdded(null, optimisticReply._id);
      console.error("Failed to add comment:", error);

      // Roll back the optimistic update on error
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply._id !== optimisticReply._id)
      );
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
        console.log("replies before deleting from replies state", replies, replyId);

        // remove replies recursively
        setReplies((prevReplies) => removeReplyRecursively(prevReplies, replyId));

        // remove first level reply
        // setReplies((prevReplies) =>
        //   prevReplies.filter((reply) => reply._id !== replyId)
        // );

        // remove nested replies
        // setReplies((prevReplies) =>
        //   prevReplies.map((reply) => ({
        //     ...reply,
        //     replies: reply.replies.filter((r) => r._id !== replyId),
        //   }))
        // );
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
        onSubmit={(event) => handleSubmit(event, comment._id)}
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
