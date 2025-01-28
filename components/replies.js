import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GoComment } from "react-icons/go";
import Reply from "./reply";
import { deleteComment } from "./lib/api";
import { addReplyRecursively, replaceReplyRecursively, removeReplyRecursively, formatDate } from "@/components/lib/utils";
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
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replies, setReplies] = useState(initialReplies);
  const [showConfirmation, setShowConfirmation] = useState(null);

  useEffect(() => {
    if (comment.replies) {
      setReplies(comment.replies);
    }
  }, [comment.replies]);

  useEffect(() => {
    setReplies(initialReplies); // Update the local state when initialReplies changes
  }, [initialReplies]);

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

  const handleSubmit = async (event, formData, parentReply) => {
    event.preventDefault();
    event.stopPropagation();

    if (isSubmitting) return;
  
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
    setIsSubmitting(true);
    try {
      // Send the reply to the server
      const newReply = await handleAddComment({
        ...formData,
        parentId: parentReply?._id,
      });

      // Notify the parent to update the optimistic reply with server data
      onReplyAdded(newReply, optimisticReply._id);

      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply._id === optimisticReply._id
            ? newReply
            : {
                ...reply,
                replies: replaceReplyRecursively(
                  reply.replies,
                  optimisticReply._id,
                  newReply
                ),
              }
        )
      );

    } catch (error) {
      // Notify the parent to remove or revert the optimistic reply
      onReplyAdded(null, optimisticReply._id);
      console.error("Failed to add comment:", error);

      // Remove the optimistic reply on error
      setReplies((prevReplies) =>
        prevReplies
          .map((reply) =>
            reply._id === parentReply?._id
              ? {
                  ...reply,
                  replies: reply.replies.filter(
                    (r) => r._id !== optimisticReply._id
                  ),
                }
              : reply
          )
          .filter((reply) => reply._id !== optimisticReply._id)
      );
    } finally {
      setIsSubmitting(false);
      setIsReplying(false);
    }
  };

  const confirmDeleteReply = async ([episodeId, replyId]) => {
    try {
      const success = await deleteComment(episodeId, replyId);
      if (success) {
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
        <div className={classes.reply_footer}>
          <div className={classes.reply_footer_group}>
          <div className={classes.reply_footer_subgroup}>
        <GoComment
          size={18}
          color="white"
          className={classes.comment_icon}
          onClick={() => setIsReplying(!isReplying)}
        />
        <span className={classes.comment_count}>
          {replies ? replies.length : 0} {`${replies.length === 1 ? 'Reply' : 'Replies'}`}
        </span>
        </div>
        </div>
        {/* Reply form */}
        {isReplying && (
          <form className={classes.reply_form} onSubmit={(event) => handleSubmit(event, commentFormData, comment)}>
            <input
              type="text"
              name="name"
              className={classes.reply_form_input}
              placeholder="Your name"
              value={commentFormData.name}
              onChange={handleInputChange}
            />
            <textarea
              name="commentText"
              placeholder="Write a reply..."
              className={classes.reply_form_textarea}
              value={commentFormData.commentText}
              onChange={handleInputChange}
              rows={3}
            />
            <button type="submit" className={classes.reply_form_button} disabled={isSubmitting}>Post Reply</button>
            <button type="button" className={classes.reply_form_button} onClick={() => setIsReplying(false)}>
              Cancel
            </button>
          </form>
        )}
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
              isSubmitting={isSubmitting}
            />
          ))
        ) : (
          <div>No replies yet</div>
        )}
      </div>
      {/* <form
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
          <button
            type="submit"
            className={classes.reply_submit_button}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </form> */}
    </div>
  );
};

export default Replies;
