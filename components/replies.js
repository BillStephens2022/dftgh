import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GoTrash, GoComment, GoEye } from "react-icons/go";
import IconButton from "./buttons/iconButton";
import DeleteConfirmation from "./deleteConfirmation";
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
  // confirmDeleteComment,
  // cancelDeleteComment,
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
    // Set the parentComment when the form initializes
    setCommentFormData((prevData) => ({
      ...prevData,
      parentComment: comment || null,
    }));
  }, [comment]);

  useEffect(() => {
    if (session && commentFormData.name === "") {
      setCommentFormData((prevData) => ({
        ...prevData,
        name: session.user.username,
      }));
    }
  }, [session, commentFormData]);

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
    console.log("delete reply clicked: episodeId, replyId", episodeId, replyId);
    setShowConfirmation([episodeId, replyId]);
    console.log(showConfirmation);
  };

  const handleSubmit = async (event, parentCommentId) => {
    event.preventDefault();
    event.stopPropagation();
    if (session) {
      setCommentFormData((prevData) => ({
        ...prevData,
        name: session.user.username,
      }));
    }
    const optimisticReply = {
      _id: `temp-${Date.now()}`, // Temporary ID to identify the optimistic reply
      name: session?.user?.username || commentFormData.name,
      commentText: commentFormData.commentText,
      createdAt: new Date().toISOString(), // Fake creation time
      parentId: parentCommentId, // Initialize parentId
      replies: [], // Initialize replies
    };
    
    setReplies((prevReplies) => [...prevReplies, optimisticReply]);
    
    // Clear the form immediately
    setCommentFormData((prevData) => ({
      ...prevData,
      commentText: "",
    }));
    
    try {
      const payload = {
        ...commentFormData,
        parentId: parentCommentId,
      };
      const newReply = await handleAddComment(payload);

      // Update parent state via callback
      onReplyAdded(newReply, comment._id);
      
      // Update the replies state with the actual reply
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply._id === optimisticReply._id ? newReply : reply
        )
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
      
      // Roll back the optimistic update on error
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply._id !== optimisticReply._id)
      );
    }
  };

  const confirmDeleteReply = async ([episodeId, replyId]) => {
    try {
      const success = await deleteComment(episodeId, replyId);
      if (success) {
        console.log("Reply deleted successfully");
        // Update the episode state to remove the deleted comment
        setEpisode((prevEpisode) => ({
          ...prevEpisode,
          comments: prevEpisode.comments.map((comment) => ({
            ...comment,
            replies: comment.replies.filter((reply) => reply._id !== replyId),
          })),
        }));
        setReplies((prevReplies) =>
          prevReplies.filter((reply) => reply._id !== replyId)
        );
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
            <div key={reply.createdAt} className={classes.reply_body}>
              <div className={classes.reply_header}>
                <span>{reply.name || "Anonymous"}</span>
                <span>
                  {reply.createdAt ? formatDate(reply.createdAt) : "Today"}
                </span>
              </div>
              <div className={classes.reply_text}>
                <p>{reply.commentText || "No Comment"}</p>
              </div>
              <div className={classes.confirmation}>
                {showConfirmation &&
                  showConfirmation[0] === episodeId &&
                  showConfirmation[1] === reply._id && (
                    <DeleteConfirmation
                      itemToBeDeleted={"comment"}
                      onClick1={confirmDeleteReply}
                      onClick2={cancelDeleteReply}
                      id={[episodeId, reply._id]}
                    />
                  )}
              </div>
              <div className={classes.reply_footer}>
                <div className={classes.reply_footer_group}>
                  <GoComment
                    size={18}
                    color="white"
                    className={classes.comment_icon}
                  />
                  <span className={classes.comment_count}>Reply</span>
                </div>
                <div className={classes.reply_footer_group}>
                  <GoEye
                    size={18}
                    color="white"
                    className={classes.comment_icon}
                  />
                  <span className={classes.comment_count}>
                    Replies ({reply.replies ? reply.replies.length : 0})
                  </span>
                </div>
                {session && (
                  <div className={classes.footer_group}>
                    <IconButton
                      icon={<GoTrash />}
                      style={{
                        padding: 0,
                        paddingTop: "0.33rem",
                      }}
                      onClick={(event) =>
                        handleDeleteReply(event, episodeId, reply._id)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
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
