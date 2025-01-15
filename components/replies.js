import { GoTrash, GoComment, GoEye } from "react-icons/go";
import { formatDate } from "@/components/lib/dates";
import classes from "@/components/replies.module.css";

const Replies = ({ comment, replies }) => {
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
      {replies.map((reply) => (
        <div key={reply._id} className={classes.reply_body}>
          <div className={classes.reply_header}>
            <span>{reply.name}</span>
            <span>{formatDate(reply.createdAt)}</span>
          </div>
          <div className={classes.reply_text}>
          <p>{reply.commentText}</p>
          </div>
          <div className={classes.reply_footer}>
            <div className={classes.reply_footer_group}>
              <GoComment size={18} color="white" className={classes.comment_icon} />
              <span className={classes.comment_count}>Reply</span>
              </div>
              <div className={classes.reply_footer_group}>
              <GoEye size={18} color="white" className={classes.comment_icon} />
              <span className={classes.comment_count}>Replies ({reply.replies ? reply.replies.length : 0})</span>
              </div>

          </div>
        </div>
      ))}
     </div>
        <form className={classes.reply_form}>
          <div className={classes.reply_form_group}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className={classes.reply_form_input}
            />
          </div>
          <div className={classes.reply_form_group}>
            <textarea
              name="commentText"
              placeholder="Reply"
              className={classes.reply_form_textarea}
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
