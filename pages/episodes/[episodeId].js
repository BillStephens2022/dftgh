// pages/episodes/[episodeId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getEpisodeById } from '@/components/lib/api';
import Image from 'next/image';
import { formatDate } from '@/components/lib/format';
import Button from '@/components/button';
import classes from "./episodeId.module.css";

function EpisodeDetail() {
  const router = useRouter();
  const { episodeId } = router.query; // Get the episodeId from the route parameters
  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    // Fetch episode details when episodeId changes
    if (episodeId) {
      getEpisodeById(episodeId)
        .then((data) => {
          setEpisode(data); // Update episode state with fetched data
        })
        .catch((error) => {
          console.error('Error fetching episode details:', error);
        });
    }
  }, [episodeId]);

  if (!episode) {
    return <div>Loading...</div>; // Loading state while fetching episode details
  }

  function handleAddComment() {
    console.log("adding comment!");
  }

  // Render episode details here
  return (
    <div className={classes.episodeId_div}>
      <h1 className={classes.title}>{episode.title}</h1>
      <p className={classes.description}>{episode.description}</p>
      <div className={classes.image_div}><img src={episode.imageLink} width={200} height={200}></img></div>
      <p className={classes.date_aired}>{formatDate(episode.dateAired)}</p>
      <form className={classes.form}>
       <div className={classes.form_group}>
       <label className={classes.form_label} htmlFor="name">Name</label>
       <input className={classes.form_input} type="text" placeholder="Name" id="name"/>
       </div>
      <div className={classes.form_group}>
      <label className={classes.form_label} htmlFor="comment">Comment</label>
      <textarea placeholder="Your Comment" className={classes.form_textarea} rows="5" id="comment"></textarea>
</div>
      </form>

      <div className={classes.addComment_div}>
        <Button text="Add Comment" backgroundColor='seagreen' color='white' onClick={handleAddComment}></Button>
      </div>
    </div>
  );
}

export default EpisodeDetail;
