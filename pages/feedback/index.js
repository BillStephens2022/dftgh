import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { addFeedback, getFeedback } from "@/components/lib/api";
import { formatDate } from "@/components/lib/format";
import { deleteFeedback } from "@/components/lib/api";
import ModalForm from "@/components/forms/modalForm";
import Button from "@/components/buttons/button";
import DeleteButton from "@/components/buttons/deleteButton";
import classes from "./feedback.module.css";
import AddFeedbackForm from "@/components/forms/addFeedbackForm";

const initialFormData = {
  name: "",
  feedback: "",
  publicPost: false
};

const Feedback = () => {
  const { data: session } = useSession();
  const [feedbackData, setFeedbackData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);


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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const success = await addFeedback(formData);
      if (success) {
        console.log("Feedback added successfully");
        setFormData(initialFormData);
        // Fetch updated feedback data after adding new feedback
        const updatedFeedbackData = await getFeedback();

        // Update local state with the latest feedback data
        setFeedbackData(updatedFeedbackData);
        // setOnSuccess(true); // Triggers modal close via useEffect
        closeModal();
      } else {
        console.error("Error adding feedback");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      console.log("feedbackId: ", feedbackId);
      const success = await deleteFeedback(feedbackId);
      if (success) {
        console.log("Feedback deleted successfully");
        const updatedFeedback = feedbackData.filter(
          (feedback) => feedback._id !== feedbackId
        );
        setFeedbackData(updatedFeedback);
      } else {
        console.error("Error deleting feedback");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Feedback</h1>
        <div className={classes.form_div}>
          <Button text="Add Feedback" onClick={openModal}/>
        {modalOpen && (
                    <ModalForm
                        onClose={closeModal}
                        modalTitle="Add Feedback"
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        form={<AddFeedbackForm onSubmit={handleFormSubmit} />}
                    />
                )}
          
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
              <DeleteButton onClick={() => handleDeleteFeedback(feedback._id)} />
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
