// pages/episodes/[episodeId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getEpisodeById } from '@/components/lib/api';
import Image from 'next/image';

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

  // Render episode details here
  return (
    <div>
      <h1>{episode.title}</h1>
      <p>{episode.description}</p>
      <div><img src={episode.imageLink} width={200} height={200}></img></div>
      <p>{episode.dateAired}</p>
    </div>
  );
}

export default EpisodeDetail;
