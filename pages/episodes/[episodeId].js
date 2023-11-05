// pages/episodes/[episodeId].js
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  getEpisodeById,
  addComment,
  deleteComment,
  addPoll,
} from "@/components/lib/api";
import Image from "next/image";
import ModalForm from "@/components/modalForm";
import AddPollForm from "@/components/addPollForm";
import { formatDate } from "@/components/lib/format";
import Button from "@/components/button";
import classes from "./episodeId.module.css";

const initialCommentFormData = {
  name: "",
  commentText: "",
  episodeId: "",
  createdAt: "",
};



function EpisodeDetail() {
  const router = useRouter();
  const { data: session } = useSession();
  const { episodeId } = router.query; // Get the episodeId from the route parameters
  const [episode, setEpisode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
 
  const [commentFormData, setCommentFormData] = useState(
    initialCommentFormData
  );

  useEffect(() => {
    // Fetch episode details when episodeId changes
    if (episodeId) {
      // Set episodeId in the form data
      setCommentFormData((prevData) => ({
        ...prevData,
        episodeId: episodeId,
      }));

      const fetchEpisodeDetails = async () => {
        try {
          const data = await getEpisodeById(episodeId);
          setEpisode(data); // Update episode state with fetched data
        } catch (error) {
          console.error("Error fetching episode details:", error);
        }
      };

      fetchEpisodeDetails();
    }
  }, [episodeId]);

  if (!episode) {
    return <div>Loading...</div>; // Loading state while fetching episode details
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPollFormData(initialPollFormData); // reset formData state when closing the modal
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCommentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleAddComment(event) {
    event.preventDefault();
    try {
      console.log("from add comment handler: ", episodeId, commentFormData);
      const addedComment = await addComment(episodeId, commentFormData);
      setEpisode((prevEpisode) => {
        return {
          ...prevEpisode,
          comments: [...prevEpisode.comments, addedComment],
        };
      });
      setCommentFormData(initialCommentFormData);
      console.log("Comment added successfully:", addedComment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  async function handleDeleteComment(episodeId, commentId) {
    try {
      const success = await deleteComment(episodeId, commentId);
      if (success) {
        console.log("Comment deleted successfully");
        // Update the episode state to remove the deleted comment
        setEpisode((prevEpisode) => ({
          ...prevEpisode,
          comments: prevEpisode.comments.filter(
            (comment) => comment._id !== commentId
          ),
        }));
      } else {
        console.error("Error deleting comment");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleAddPoll = async (pollFormData) => {
    console.log("adding poll for episode id: ", episodeId, "Poll Form Data: ", pollFormData);
    try {
      const addedPoll = await addPoll(episodeId, pollFormData);
      setEpisode((prevEpisode) => {
        return {
          ...prevEpisode,
          polls: [...prevEpisode.polls, addedPoll],
        };
      });
      console.log("Poll added successfully! ", addedPoll);
    } catch (error) {
      console.error("Error adding poll:", error);
    }
  }

  return (
    <div className={classes.episodeId_div}>
      <div className={classes.addPollButton_div}>
        <Button
          text="Add Poll"
          backgroundColor="steelblue"
          color="white"
          onClick={openModal}
        />
      </div>
      {modalOpen && (
        <ModalForm
          onClose={closeModal}
          modalTitle={"Add Poll"}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          form={
            <AddPollForm
              onSubmit={handleAddPoll}
              onSubmitSuccess={closeModal}
            />
          }
        />
      )}
      <h1 className={classes.title}>{episode.title}</h1>

      <p className={classes.description}>{episode.description}</p>
      <div className={classes.image_div}>
        <img src={episode.imageLink} width={200} height={200}></img>
      </div>
      <p className={classes.date_aired}>{formatDate(episode.dateAired)}</p>
      <form className={classes.form}>
        <div className={classes.form_group}>
          <label className={classes.form_label} htmlFor="name">
            Name
          </label>
          <input
            className={classes.form_input}
            type="text"
            placeholder="Name"
            id="name"
            name="name"
            value={commentFormData.name}
            onChange={handleInputChange}
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
            onClick={handleAddComment}
          ></Button>
        </div>
      </form>
      {episode.polls.map((poll) => {
        return (
          <div className={classes.poll_div} key={poll._id}>
            <p className={classes.poll_question}>{poll.question}</p>
            <ul>
              {poll.options.map((option) => {
                return (
                  <li key={option._id}>{option.text}</li>
                )
              })}
              </ul>
              </div>
            )}
         
     )}

      {episode.comments.map((comment) => {
        return (
          <div className={classes.comment_div} key={comment._id}>
            <p className={classes.comment_text}>{comment.commentText}</p>

            <p className={classes.comment_author}>
              Posted by: {comment.name} on {formatDate(comment.createdAt)}
            </p>
            {session && (
              <div>
                <button
                  className={classes.comment_delete_btn}
                  onClick={() => handleDeleteComment(episodeId, comment._id)}
                >
                  x
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default EpisodeDetail;
