import { Fragment } from "react";
import { useSession } from "next-auth/react";
import classes from "./comments.module.css";
import { formatDate } from "./lib/format";

const Comments = ({ comments }) => {
    const { data: session } = useSession();
    return (
        <Fragment>
            <div className={classes.comments_div}>
                <h3 className={classes.comments_h3}>Comments</h3>

                {comments.map((comment) => {
                    return (
                        <div className={classes.comment_div} key={comment._id}>
                            <p className={classes.comment_text}>{comment.commentText}</p>

                            <p className={classes.comment_author}>
                                Posted by: {comment.name} on {formatDate(comment.createdAt)}
                            </p>
                            {session && (
                                <div>
                                    <button
                                        className={classes.delete_btn}
                                        onClick={() =>
                                            handleDeleteComment(episodeId, comment._id)
                                        }
                                    >
                                        x
                                    </button>
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