import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import { GoTrash, GoComment } from "react-icons/go";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { formatDate, getUsername } from "@/components/lib/utils";
import { toggleLike } from "./lib/api";
import DeleteConfirmation from "@/components/deleteConfirmation";
import IconButton from "@/components/buttons/iconButton";
import Button from "@/components/buttons/button";
import ModalForm from "@/components/forms/modalForm";
import AddCommentForm from "@/components/forms/addCommentForm";
import BasicModal from "@/components/basicModal";
import Replies from "@/components/replies";
import edProfile from "@/public/images/ed-profile.jpg";
import obProfile from "@/public/images/ob-profile.jpg";
import classes from "@/components/comments.module.css";

const Comments = ({
  episodeId,
  comments,
  handleAddComment,
  handleDeleteComment,
  confirmDeleteComment,
  cancelDeleteComment,
  showConfirmation,
  setEpisode,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Comment");
  const [parentComment, setParentComment] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [likedComments, setLikedComments] = useState({});

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedComments")) || {};
    setLikedComments(storedLikes);
  }, []);

  useEffect(() => {
    if (onSuccess) {
      setFormModalOpen(false); // Close the modal when onSuccess becomes true
    }
  }, [onSuccess]);

  const openReplyModal = (comment) => {
    setModalTitle(
      `Replies to ${
        comment.name == "Roadkill"
          ? "Ed"
          : comment.name == "Flounder"
          ? "OB"
          : comment.name
      }'s Comment`
    );
    setSelectedComment(comment);
    setReplyModalOpen(true);
  };

  const openAddCommentModal = (isReply = false, parent = null) => {
    setModalTitle(isReply ? `Reply to ${parent.name}` : "Post Comment");
    setParentComment(parent); // Set the parent comment if it's a reply
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setParentComment(null);
    setSelectedComment(null);
  };

  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setParentComment(null);
    setSelectedComment(null);
  };

  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null
  );

  const updateNestedReplies = (comments, parentId, newReply) => {
    return comments.map((comment) => {
      if (comment._id === parentId) {
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply._id === newReply._id ? newReply : reply
            ),
          };
        } else {
          return {
            ...comment,
            replies: [newReply],
          };
        }
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateNestedReplies(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const onReplyAdded = (newReply, parentCommentId) => {
    if (newReply === null) {
      // Roll back the optimistic update on error
      setEpisode((prevEpisode) => ({
        ...prevEpisode,
        comments: prevEpisode.comments.map((comment) =>
          comment._id === parentCommentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply._id !== parentCommentId
                ),
              }
            : comment
        ),
      }));
    } else {
      // Update the state with the new reply
      setEpisode((prevEpisode) => ({
        ...prevEpisode,
        comments: updateNestedReplies(
          prevEpisode.comments,
          parentCommentId,
          newReply
        ),
      }));
    }
  };

  const handleLike = async (commentId) => {
    try {
      const updatedComment = await toggleLike(commentId);

      if (updatedComment) {
        setEpisode((prevEpisode) => {
          const updateComments = (comments) =>
            comments.map((comment) => {
              if (comment._id === commentId) {
                return { ...comment, likes: updatedComment.likes };
              }
              if (comment.replies) {
                return {
                  ...comment,
                  replies: updateComments(comment.replies),
                };
              }
              return comment;
            });

          return {
            ...prevEpisode,
            comments: updateComments(prevEpisode.comments),
          };
        });

        if (selectedComment && selectedComment._id === commentId) {
          setSelectedComment((prev) => ({
            ...prev,
            likes: updatedComment.likes,
          }));
        }

        setLikedComments((prev) => {
          const updatedLikes = { ...prev, [commentId]: !prev[commentId] };
          localStorage.setItem("likedComments", JSON.stringify(updatedLikes));
          return updatedLikes;
        });
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

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
        {replyModalOpen && selectedComment ? (
          <BasicModal
            onClose={closeReplyModal}
            modalOpen={replyModalOpen}
            setModalOpen={setReplyModalOpen}
            modalTitle={modalTitle}
          >
            <Replies
              key={selectedComment._id}
              comment={selectedComment}
              episodeId={episodeId}
              setEpisode={setEpisode}
              initialReplies={selectedComment.replies}
              handleAddComment={handleAddComment}
              confirmDeleteComment={confirmDeleteComment}
              cancelDeleteComment={cancelDeleteComment}
              onReplyAdded={onReplyAdded}
              likedComments={likedComments}
              onLike={handleLike}
            />
          </BasicModal>
        ) : formModalOpen ? (
          <ModalForm
            onClose={closeFormModal}
            modalTitle={modalTitle}
            modalOpen={formModalOpen}
            setModalOpen={setFormModalOpen}
            form={
              <AddCommentForm
                handleAddComment={handleAddComment}
                closeModal={closeFormModal}
                parentComment={parentComment}
              />
            }
          />
        ) : null}
        {topLevelComments.map((comment) => {
          return (
            <div className={classes.comment_div} key={comment._id}>
              <div className={classes.comment_header}>
                <div className={classes.comment_author}>
                  {(comment.name == "Roadkill" ||
                    comment.name == "Flounder") && (
                    <Image
                      width={30}
                      height={30}
                      src={
                        comment.name == "Roadkill"
                          ? edProfile
                          : comment.name == "Flounder"
                          ? obProfile
                          : ""
                      }
                      className={classes.comment_profile}
                      alt="profile"
                    />
                  )}
                  {getUsername(comment.name)}
                  {(comment.name == "Roadkill" ||
                    comment.name == "Flounder") && (
                    <span className={classes.podcaster_comment}>
                      <GoVerified />
                    </span>
                  )}{" "}
                </div>
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
                  onClick={() => openReplyModal(comment)}
                >
                  <GoComment
                    size={18}
                    color="white"
                    className={classes.comment_icon}
                  />
                  <span className={classes.comment_count}>
                    {comment.replies ? comment.replies.length : 0}
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
                      onClick={() =>
                        handleDeleteComment(episodeId, comment._id)
                      }
                    />
                  </div>
                )}
                <div className={classes.footer_group}>
                  {likedComments[comment._id] ? (
                    <FaHeart
                      color="red"
                      onClick={() => handleLike(comment._id)}
                    />
                  ) : (
                    <FaRegHeart
                      color="white"
                      onClick={() => handleLike(comment._id)}
                    />
                  )}
                  <span className={classes.likes_count}>
                    {comment.likes ? comment.likes : 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default Comments;
