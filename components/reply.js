import { useState, useEffect } from "react";
import { GoTrash, GoComment } from "react-icons/go";
import IconButton from "./buttons/iconButton";
import DeleteConfirmation from "./deleteConfirmation";
import { formatDate } from "@/components/lib/utils";
import classes from "@/components/replies.module.css";

const Reply = ({
  reply,
  depth,
  episodeId,
  onSubmit,
  handleDeleteReply,
  showConfirmation,
  confirmDeleteReply,
  cancelDeleteReply,
  session,
  isSubmitting,
}) => {
  const [isReplying, setIsReplying] = useState(false);

  const [replyFormData, setReplyFormData] = useState({
    name: session?.user?.username || "",
    commentText: "",
    parentComment: null,
  });

  useEffect(() => {
    // Set the parent comment in the form data
    setReplyFormData((prevData) => ({
      ...prevData,
      parentComment: reply || null,
      name: session?.user?.username || prevData.name || "",
    }));
  }, [reply, session]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReplyFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitReply = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    onSubmit(event, { ...replyFormData }, reply);

    // Reset form data immediately
    setReplyFormData({ name: session?.user?.username || "", commentText: "" });
    setIsReplying(false);
  };
  
  return (
    <div
      key={reply._id || reply.createdAt}
      style={{ marginLeft: `${depth * 2.5}rem` }}
      className={classes.reply_body}
    >
      <div className={classes.reply_header}>
        <span>{reply.name}</span>
        <span>{formatDate(reply.createdAt)}</span>
      </div>
      <div
        className={classes.reply_text}
        style={{
          backgroundColor: `hsl(${200 + depth * 50}, ${80 - depth * 8}%, ${95 - depth * 8}%)`, // Adjust hue and lightness
        }}
      >
        <p>{reply.commentText}</p>
      </div>
      <div className={classes.confirmation}>
        {showConfirmation?.[0] === episodeId &&
          showConfirmation?.[1] === reply._id && (
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
          <div className={classes.reply_footer_subgroup}>
        <GoComment
          size={18}
          color="white"
          className={classes.comment_icon}
          onClick={() => setIsReplying(!isReplying)}
        />
        <span className={classes.comment_count}>
          {reply.replies ? reply.replies.length : 0} {`${reply.replies.length === 1 ? 'Reply' : 'Replies'}`}
        </span>
        </div>
        {session && (
          <IconButton
            icon={<GoTrash />}
            style={{ padding: 0, paddingTop: "0.33rem" }}
            onClick={(event) => handleDeleteReply(event, episodeId, reply._id)}
          />
        )}
        </div>
        {/* Reply form */}
        {isReplying && (
          <form onSubmit={(event) => handleSubmitReply(event, reply)}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={replyFormData.name}
              onChange={handleInputChange}
            />
            <textarea
              name="commentText"
              placeholder="Write a reply..."
              value={replyFormData.commentText}
              onChange={handleInputChange}
            />
            <button type="submit" disabled={isSubmitting}>
              Post Reply
            </button>
            <button type="button" onClick={() => setIsReplying(false)}>
              Cancel
            </button>
          </form>
        )}
      </div>
      {/* Recursive rendering of nested replies */}
      {reply.replies &&
        reply.replies.map((nestedReply) => (
          <Reply
            key={nestedReply._id || nestedReply.createdAt}
            reply={nestedReply}
            depth={depth + 1}
            episodeId={episodeId}
            onSubmit={onSubmit}
            handleDeleteReply={handleDeleteReply}
            showConfirmation={showConfirmation}
            confirmDeleteReply={confirmDeleteReply}
            cancelDeleteReply={cancelDeleteReply}
            session={session}
            classes={classes}
          />
        ))}
    </div>
  );
};

export default Reply;
