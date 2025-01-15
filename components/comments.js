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
import BasicModal from "@/components/basicModal";

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
  const [selectedComment, setSelectedComment] = useState(null);
  const [modalType, setModalType] = useState(null); // null | "BasicModal" | "ModalForm"

  useEffect(() => {
    if (onSuccess) {
      setModalOpen(false); // Close the modal when onSuccess becomes true
    }
  }, [onSuccess]);

  const openReplyModal = (comment) => {
    setModalTitle(`Replies to ${comment.name}'s Comment`);
    setSelectedComment(comment);
    setModalType("BasicModal");
    setModalOpen(true);
  };

  const openAddCommentModal = (isReply = false, parent = null) => {
    setModalTitle(isReply ? `Reply to ${parent.name}` : "Post Comment");
    setParentComment(parent); // Set the parent comment if it's a reply
    setModalType("ModalForm");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setParentComment(null);
    setSelectedComment(null);
  };

  console.log("COMMENTS from Comments Page: ", comments);

  return (
    <Fragment>
      <div className={classes.comments_div}>
        <div className={classes.header_div}>
          <h3 className={classes.comments_h3}>Comments</h3>
          <Button
            onClick={openAddCommentModal}
            text="Add"
            margin="0 0 0 0.25rem"
          />
        </div>
        {modalOpen && modalType === "BasicModal" && selectedComment ? (
          <BasicModal
            onClose={closeModal}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            modalTitle={modalTitle}
          >
            <div>
              <h4>{selectedComment.commentText}</h4>
              <ul>
                {selectedComment.replies?.map((reply, index) => (
                  <li key={index}>
                    <strong>{reply.name}:</strong> {reply.commentText}
                  </li>
                ))}
              </ul>
            </div>
          </BasicModal>
        ) : modalOpen && modalType === "ModalForm" ? (
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
        ) : null}
        {comments.map((comment) => {
          return (
            <div className={classes.comment_div} key={comment._id}>
              <div className={classes.comment_header}>
                <span className={classes.comment_author}>
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
                </span>
                <span className={classes.comment_date}>
                  {formatDate(comment.createdAt)}
                </span>
              </div>
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
                <div
                  className={classes.footer_group}
                  onClick={() => openAddCommentModal(true, comment)}
                >
                  <GoComment
                    size={18}
                    color="white"
                    className={classes.comment_icon}
                  />
                  <span className={classes.comment_count}>Reply</span>
                </div>
                <div
                  className={`${classes.footer_group} ${
                    session ? classes.additional_margin : ""
                  }`}
                  onClick={() => openReplyModal(comment)}
                >
                  <GoEye
                    size={18}
                    color="white"
                    className={classes.comment_icon}
                  />
                  <span className={classes.comment_count}>
                    Replies ({comment.replies ? comment.replies.length : 0})
                  </span>
                </div>
              </div>
              {session && (
                <div>
                  <IconButton
                    icon={<GoTrash />}
                    style={{
                      position: "absolute",
                      bottom: 6,
                      right: 6,
                      padding: 0,
                      paddingTop: "0.33rem",
                    }}
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
