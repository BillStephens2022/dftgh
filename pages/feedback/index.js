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
        const unsortedFeedback = await getFeedback();
        // sort data so that most recent items are first
        const feedback = unsortedFeedback.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setFeedbackData(feedback); // Update episode state with fetched data
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
      const currentDate = new Date(); // Current date/time
      formData.createdAt = currentDate.toISOString(); // Add createdAt field
  
      const { message, feedback } = await addFeedback(formData);
      
      if (feedback) {
        
        setFeedbackData(prevFeedback => {
          const updatedFeedback = [feedback, ...prevFeedback];
          return updatedFeedback.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
        });
        console.log("hello EVERYONE");
        closeModal();
      } else {
        console.error("Error adding feedback");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      console.log("feedbackId: ", feedbackId);
      const success = await deleteFeedback(feedbackId);
      if (success) {
        console.log("Feedback deleted successfully");
        setFeedbackData(prevFeedback => {
          const updatedFeedback = prevFeedback.filter(
            (feedback) => feedback._id !== feedbackId
          );
          return updatedFeedback;
        });
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
          <Button text="Post Feedback" onClick={openModal} />
          {modalOpen && (
            <ModalForm
              onClose={closeModal}
              modalTitle="Add Feedback"
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              form={<AddFeedbackForm onSubmit={handleFormSubmit} />}
            />
          )}
          <h3 className={classes.subtitle}>Note: feedback can be posted publicly or privately</h3>

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
              <p className={classes.feedback_name}>-- {feedback.name}, {formatDate(feedback.createdAt)}</p>
              <p className={classes.feedback_date}></p>
              {feedback.publicPost ? <p>Public Post</p> : <p><span className={classes.span}>***Private***</span> Post</p>}             
            </div>

          ))}


        </div>
      </main>
    </Fragment>
  );
}

export async function getStaticProps() {
  let feedback = [];

  try {
    const feedbackJSON = await getFeedback();
    feedback = feedbackJSON.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error(error.message);
  }

  return {
    props: {
      feedback,
    },
    revalidate: 1200, // Re-generate page every 1200 seconds (20 minutes)
  };
}

export default Feedback;
