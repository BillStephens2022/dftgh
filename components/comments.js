import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GoVerified } from "react-icons/go";
import { GoTrash } from "react-icons/go";
import { formatDate } from "@/components/lib/dates";
import DeleteConfirmation from "@/components/deleteConfirmation";
import IconButton from "@/components/buttons/iconButton";
import Button from "@/components/buttons/button";
import classes from "@/components/comments.module.css";
import ModalForm from "@/components/forms/modalForm";
import AddCommentForm from "@/components/forms/addCommentForm";

const Comments = ({ episodeId, comments, handleAddComment, handleDeleteComment, confirmDeleteComment, cancelDeleteComment, showConfirmation, setShowConfirmation, onSuccess }) => {
    const { data: session } = useSession();
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (onSuccess) {
            setModalOpen(false); // Close the modal when onSuccess becomes true
        }
    }, [onSuccess]);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    }

    return (
        <Fragment>
            <div className={classes.comments_div}>
                <div className={classes.header_div}><h3 className={classes.comments_h3}>Comments</h3><Button onClick={openModal} text="Add" margin="0 0 0 0.25rem" /></div>
                {modalOpen && (
                    <ModalForm
                        onClose={closeModal}
                        modalTitle="Add Comment"
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        form={<AddCommentForm handleAddComment={handleAddComment} closeModal={closeModal} />}
                    />
                )}
                {comments.map((comment) => {
                    return (
                        <div className={classes.comment_div} key={comment._id}>
                            <p className={classes.comment_text}>{comment.commentText}</p>
                            <div className={classes.confirmation}>{(showConfirmation && showConfirmation[0] === episodeId && showConfirmation[1] === comment._id) && (
                                <DeleteConfirmation itemToBeDeleted={"comment"} onClick1={confirmDeleteComment} onClick2={cancelDeleteComment} id={[episodeId, comment._id]} />
                            )}</div>
                            <p className={classes.comment_author}>
                                Posted by: {(comment.name == "Roadkill") ? "Ed " : (comment.name == "Flounder") ? "Ob " : comment.name} {(comment.name == "Roadkill" || comment.name == "Flounder") && (<span className={classes.podcaster_comment}><GoVerified />, Verified Podcaster</span>)} on {formatDate(comment.createdAt)}
                            </p>
                            {session && (
                                <div>
                                    <IconButton
                                        icon={<GoTrash />}
                                        style={{ position: "absolute", bottom: 7, right: 7 }}
                                        onClick={() =>
                                            handleDeleteComment(episodeId, comment._id)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

        </Fragment>
    )
}

export default Comments;