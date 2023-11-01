// pages/episodes/[episodeId].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getEpisodeById, addComment } from "@/components/lib/api";
import Image from "next/image";
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
  const { episodeId } = router.query; // Get the episodeId from the route parameters
  const [episode, setEpisode] = useState(null);
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

      getEpisodeById(episodeId)
        .then((data) => {
          setEpisode(data); // Update episode state with fetched data
        })
        .catch((error) => {
          console.error("Error fetching episode details:", error);
        });
    }
  }, [episodeId]);

  if (!episode) {
    return <div>Loading...</div>; // Loading state while fetching episode details
  }

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
      console.log("COMMENTFORMDATA: ", commentFormData);
      const addedComment = await addComment(episodeId, commentFormData);

      setCommentFormData(initialCommentFormData);

      console.log("Comment added successfully:", addedComment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  return (
    <div className={classes.episodeId_div}>
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

      <div className={classes.addComment_div}>
        <Button
          text="Add Comment"
          backgroundColor="seagreen"
          color="white"
          onClick={handleAddComment}
        ></Button>
      </div>
    </div>
  );
}

export default EpisodeDetail;
