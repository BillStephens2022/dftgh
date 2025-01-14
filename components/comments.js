import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GoVerified } from "react-icons/go";
import { GoTrash, GoComment, GoEye } from "react-icons/go";
import { formatDate } from "@/components/lib/dates";
import DeleteConfirmation from "@/components/deleteConfirmation";
import IconButton from "@/components/buttons/iconButton";
import Button from "@/components/buttons/button";
import classes from "@/components/comments.module.css";
import ModalForm from "@/components/forms/modalForm";
import AddCommentForm from "@/components/forms/addCommentForm";

const Comments = ({
  episodeId,
  comments,
  handleAddComment,
  handleDeleteComment,
  confirmDeleteComment,
  cancelDeleteComment,
  showConfirmation,
  setShowConfirmation,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Comment");
  const [parentComment, setParentComment] = useState(null);

  useEffect(() => {
    if (onSuccess) {
      setModalOpen(false); // Close the modal when onSuccess becomes true
    }
  }, [onSuccess]);

  const openModal = (isReply = false, parent = null) => {
    setModalTitle(isReply ? "Post Reply" : "Post Comment");
    setParentComment(parent); // Set the parent comment if it's a reply
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setParentComment(null);
  };

  console.log("COMMENTS from Comments Page: ", comments);

  return (
    <Fragment>
      <div className={classes.comments_div}>
        <div className={classes.header_div}>
          <h3 className={classes.comments_h3}>Comments</h3>
          <Button onClick={openModal} text="Add" margin="0 0 0 0.25rem" />
        </div>
        {modalOpen && (
          <ModalForm
            onClose={closeModal}
            modalTitle={modalTitle}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            form={
              <AddCommentForm
                handleAddComment={handleAddComment}
                closeModal={closeModal}
                parentComment={parentComment} 
              />
            }
          />
        )}
        {comments.map((comment) => {
          return (
            <div className={classes.comment_div} key={comment._id}>
              <p className={classes.comment_text}>{comment.commentText}</p>
              <div className={classes.confirmation}>
                {showConfirmation &&
                  showConfirmation[0] === episodeId &&
                  showConfirmation[1] === comment._id && (
                    <DeleteConfirmation
                      itemToBeDeleted={"comment"}
                      onClick1={confirmDeleteComment}
                      onClick2={cancelDeleteComment}
                      id={[episodeId, comment._id]}
                    />
                  )}
              </div>
              <div className={classes.comment_footer}>
                <p className={classes.comment_author}>
                  Posted by:{" "}
                  {comment.name == "Roadkill"
                    ? "Ed "
                    : comment.name == "Flounder"
                    ? "Ob "
                    : comment.name}{" "}
                  {(comment.name == "Roadkill" ||
                    comment.name == "Flounder") && (
                    <span className={classes.podcaster_comment}>
                      <GoVerified />, Verified Podcaster
                    </span>
                  )}{" "}
                  on {formatDate(comment.createdAt)}
                </p>
                <div  onClick={() => openModal(true, comment)}>
                <GoComment
                  size={18}
                  color="white"
                  className={classes.comment_icon}
                />
               
                <span className={classes.comment_count}>
                  Post Reply
                </span>
                </div>
                <div>
                <GoEye size={18} color="white" className={classes.comment_icon} />
                <span className={classes.comment_count}>
                  View Replies ({comment.replies ? comment.replies.length : 0})
                </span>
                </div>
              </div>
              {session && (
                <div>
                  <IconButton
                    icon={<GoTrash />}
                    style={{ position: "absolute", bottom: 7, right: 7 }}
                    onClick={() => handleDeleteComment(episodeId, comment._id)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default Comments;
