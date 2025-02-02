import { useState, useEffect } from "react";
import Image from "next/image";
import { GoTrash, GoComment } from "react-icons/go";
import IconButton from "./buttons/iconButton";
import DeleteConfirmation from "./deleteConfirmation";
import { formatDate, getUsername } from "@/components/lib/utils";
import { GoVerified } from "react-icons/go";
import edProfile from "@/public/images/ed-profile.jpg";
import obProfile from "@/public/images/ob-profile.jpg";
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
  const [showNestedReplies, setShowNestedReplies] = useState(true);

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

  const handleShowRepliesClick = () => {
    setShowNestedReplies(!showNestedReplies);
  };

  return (
    <div
      key={reply._id || reply.createdAt}
      style={{ marginLeft: `${depth * 1.25}rem` }}
      className={classes.reply_body}
    >
      <div className={classes.reply_header}>
        
       
        <div className={classes.reply_name}>
        {(reply.name == "Roadkill" || reply.name == "Flounder") && (
          <Image
            width={25}
            height={25}
            src={
              reply.name == "Roadkill"
                ? edProfile
                : reply.name == "Flounder"
                ? obProfile
                : ""
            }
            className={classes.comment_profile}
            alt="profile"
          />
        )}
          {getUsername(reply.name)}
          {(reply.name == "Roadkill" || reply.name == "Flounder") && (
            <span className={classes.podcaster_comment}>
              <GoVerified />
            </span>
          )}{" "}
        </div>
        {session && (
          <span>
            <IconButton
              icon={<GoTrash />}
              style={{ padding: 0, paddingTop: "0.33rem" }}
              onClick={(event) =>
                handleDeleteReply(event, episodeId, reply._id)
              }
            />
          </span>
        )}
      </div>
      <div
        className={classes.reply_text_container}
        style={{
          backgroundColor: `hsl(${200 + depth * 50}, ${80 - depth * 8}%, ${
            95 - depth * 8
          }%)`,
        }}
      >
        <p className={classes.reply_text}>{reply.commentText}</p>
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
      </div>
      <div className={classes.reply_footer}>
        <div className={classes.reply_footer_group}>
          <div
            className={classes.reply_footer_subgroup}
            onClick={handleShowRepliesClick}
          >
            <GoComment color="white" className={classes.comment_icon} />
            <span className={classes.comment_count}>
              {reply.replies ? reply.replies.length : 0}{" "}
              {`${reply.replies.length === 1 ? "Reply" : "Replies"}`}
            </span>
          </div>
          <div className={classes.reply_footer_subgroup}>
            <button
              className={classes.reply_footer_button}
              onClick={() => setIsReplying(!isReplying)}
              style={{ backgroundColor: isReplying ? "#333" : "lightseagreen" }}
            >
              {isReplying ? "Hide" : "Reply"}
            </button>
          </div>
          <div className={classes.reply_footer_subgroup}>
            <span className={classes.posted_date}>
              {formatDate(reply.createdAt)}
            </span>
          </div>
        </div>
        {/* Reply form */}
        {isReplying && (
          <form
            onSubmit={(event) => handleSubmitReply(event, reply)}
            className={classes.reply_form}
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={replyFormData.name}
              onChange={handleInputChange}
              className={classes.reply_form_input}
            />
            <textarea
              name="commentText"
              placeholder="Write a reply..."
              value={replyFormData.commentText}
              onChange={handleInputChange}
              className={classes.reply_form_textarea}
            />
            <div className={classes.reply_form_button_group}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={classes.reply_form_button}
              >
                Post
              </button>
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className={`${classes.reply_form_button} ${classes.cancel}`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      {/* Recursive rendering of nested replies */}
      {showNestedReplies &&
        reply.replies &&
        reply.replies.length > 0 &&
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
