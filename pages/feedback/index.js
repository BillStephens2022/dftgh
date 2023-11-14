import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { addFeedback, getFeedback } from "@/components/lib/api";
import { formatDate } from "@/components/lib/format";
import Button from "@/components/buttons/button";
import classes from "./feedback.module.css";

const initialFormData = {
  name: "",
  feedback: "",
  publicPost: false
};

const Feedback = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState(initialFormData);
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    if (session) {
      console.log(session);
    }
    const fetchFeedback = async () => {
      try {
        const data = await getFeedback();
        setFeedbackData(data); // Update episode state with fetched data
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    }
    fetchFeedback();
  }, [session]);


  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("feedback provided!");
    console.log(formData);
    try {
      const success = await addFeedback(formData);
      if (success) {
        console.log("Feedback added successfully");
        setFormData(initialFormData);
        // Fetch updated feedback data after adding new feedback
        const updatedFeedbackData = await getFeedback();

        // Update local state with the latest feedback data
        setFeedbackData(updatedFeedbackData);
      } else {
        console.error("Error adding feedback");
      }
    } catch {
      console.error(error.message);
    }
  }

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Feedback</h1>
        <div className={classes.form_div}>
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
              <Button text="Submit" />
            </div>
          </form>
        </div>
        <div className={classes.feedback_div}>

          {!session && feedbackData.map((feedback) => (
            feedback.publicPost ?
              <div className={classes.feedback_item} key={feedback._id}>

                <p className={classes.feedback_text}>{feedback.feedback}</p>
                <p className={classes.feedback_name}>by: {feedback.name}</p>
                <p className={classes.feedback_date}>on {formatDate(feedback.createdAt)}</p>
              </div>
              : null
          ))}

          {session && feedbackData.map((feedback) => (

            <div className={classes.feedback_item} key={feedback._id}>

              <p className={classes.feedback_text}>{feedback.feedback}</p>
              <p className={classes.feedback_name}>by: {feedback.name} on {formatDate(feedback.createdAt)}</p>
              <p className={classes.feedback_date}></p>
              {feedback.publicPost ? <p>Public Post</p> : <p><span className={classes.span}>***Private***</span> Post</p>}
            </div>

          ))}


        </div>
      </main>
    </Fragment>
  );
}

export default Feedback;
