import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "./buttons/button";
import DeleteButton from "./buttons/deleteButton";
import classes from "./comments.module.css";
import { formatDate } from "./lib/format";
import ModalForm from "./forms/modalForm";
import AddCommentForm from "./forms/addCommentForm";

const Comments = ({ episodeId, comments, handleAddComment, handleDeleteComment }) => {
    const { data: session } = useSession();
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

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
                        form={<AddCommentForm handleAddComment={handleAddComment} />}
                    />
                )}
                {comments.map((comment) => {
                    return (
                        <div className={classes.comment_div} key={comment._id}>
                            <p className={classes.comment_text}>{comment.commentText}</p>

                            <p className={classes.comment_author}>
                                Posted by: {comment.name} on {formatDate(comment.createdAt)}
                            </p>
                            {session && (
                                <div>
                                    <DeleteButton
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