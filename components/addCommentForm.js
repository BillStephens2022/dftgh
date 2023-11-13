import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "./button";
import classes from "./addCommentForm.module.css";

const initialFormState = {
    name: "",
    commentText: ""
};

const AddCommentForm = ({ handleAddComment }) => {
    const { data: session } = useSession();
    const [commentFormData, setCommentFormData] = useState(initialFormState);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCommentFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (session) {
            setCommentFormData((prevData) => ({
                ...prevData,
                name: session.user.username,
            }));
        }
        handleAddComment(commentFormData);
    };

    return (
        <Fragment>
           
            <div className={classes.form_container}>
                <form className={classes.comment_form} onSubmit={handleSubmit}>
                    <div className={classes.form_group}>
                        <label className={classes.form_label} htmlFor="name">
                            Name
                        </label>
                        <input
                            className={classes.form_input}
                            type="text"
                            placeholder={session ? session.user.username : "Your Name"}
                            id="name"
                            name="name"
                            value={commentFormData.name}
                            onChange={handleInputChange}
                            disabled={session}
                        />
                    </div>
                    <div className={classes.form_group}>
                        <label className={classes.form_label} htmlFor="comment">
                            Comment
                        </label>
                        <textarea
                            placeholder="Your Comment"
                            className={classes.form_textarea}
                            rows="5"
                            id="comment"
                            name="commentText"
                            value={commentFormData.commentText}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className={classes.addComment_div}>
                        <Button
                            text="Add Comment"
                            backgroundColor="seagreen"
                            color="white"
                        ></Button>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

export default AddCommentForm;