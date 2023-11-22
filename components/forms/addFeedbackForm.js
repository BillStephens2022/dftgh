import { Fragment, useState } from "react";
import Button from "@/components/buttons/button";
import classes from "@/components/forms/addFeedbackForm.module.css";

const initialFormData = {
    name: "",
    feedback: "",
    publicPost: false
};

const AddFeedbackForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        const inputValue = type === "checkbox" ? checked : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: inputValue,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData); // Pass form data to parent onSubmit function
        setFormData(initialFormData); // Reset form after submission
    };

    return (
        <Fragment>
            <form className={classes.form} onSubmit={handleFormSubmit}>
                <div className={classes.form_group}>
                    <label htmlFor="name" className={classes.form_label}>Name</label>
                    <input name="name" placeholder="Your name" value={formData.name} onChange={handleInputChange} className={classes.form_input} type="text" />
                </div>
                <div className={classes.form_group}>
                    <label htmlFor="feedback" className={classes.form_label}>Feedback</label>
                    <textarea name="feedback" placeholder="Your feedback..." value={formData.feedback} onChange={handleInputChange} className={classes.form_textarea} type="text" rows={10} />
                </div>
                <div className={classes.form_group}>
                    <label htmlFor="publicPost" className={classes.form_label}>Post Publicly?</label>
                    <input name="publicPost" value={formData.publicPost} onChange={handleInputChange} className={classes.checkbox} type="checkbox" />
                </div>
                <div>
                    <Button text="Submit" backgroundColor="steelblue" />
                </div>
            </form>
        </Fragment>
    );
}

export default AddFeedbackForm;