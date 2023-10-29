import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useEpisodeContext } from "@/context/EpisodeContext";
import Link from "next/link";
import Button from "@/components/button";
import ModalForm from "@/components/modalForm";
import classes from "./episodes.module.css";
import AddEpisodeForm from "@/components/addEpisodeForm";
import { getEpisodes, addEpisode, deleteEpisode } from "@/components/lib/api";
import { formatDate } from "@/components/lib/format";

function Episodes() {
  const { data: session } = useSession();
  const {
    state: { episodes },
    dispatch,
  } = useEpisodeContext();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (session) {
      console.log(session);
    }
    fetchEpisodes(); // fetch episodes on component mount
  }, [session]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  async function fetchEpisodes() {
    try {
      const episodesJSON = await getEpisodes();
      dispatch({ type: "SET_EPISODES", payload: episodesJSON });
    } catch (error) {
      console.error(error.message);
    }
  }
  

  async function handleAddEpisode(newEpisode) {
    try {
      const success = await addEpisode(newEpisode);
      if (success) {
        console.log("Episode added successfully");
        fetchEpisodes(); // Fetch episodes after adding a new episode
        closeModal(); // Close the modal after adding episode
      } else {
        console.error("Error adding episode");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleDeleteEpisode(episodeId) {
    try {
      const success = await deleteEpisode(episodeId);
      if (success) {
        console.log("Episode deleted successfully");
        fetchEpisodes(); // Fetch episodes after deleting an episode
      } else {
        console.error("Error deleting episode");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async function handleEditEpisode(episodeId) {
    console.log("editing id: ", episodeId);
  }


  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Episodes</h1>
        {session && (
          <Button
            text="Add Episode"
            backgroundColor="steelblue"
            color="white"
            onClick={openModal}
          />
        )}

        {modalOpen && (
          <ModalForm
            onClose={closeModal}
            modalTitle="Add Episode"
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            form={<AddEpisodeForm onSubmit={handleAddEpisode} onSubmitSuccess={closeModal} />}
          >
          </ModalForm>
        )}

        <div className={classes.episodes_div}>
          {episodes.map((episode) => (
            <Link key={episode._id} href={`/episodes/${episode._id}`} className={classes.link}>
            <div className={classes.card} key={episode._id}>
              <div className={classes.image_div}>
                <img
                  src={episode.imageLink}
                  alt={episode.title}
                  className={classes.image}
                ></img>
              </div>
              <div className={classes.episode_details}>
                <h3 className={classes.episode_title}>{episode.title}</h3>
                <h4 className={classes.episode_detail}>
                  Aired: {formatDate(episode.dateAired)}
                </h4>
                <p className={classes.episode_detail}>{episode.description}</p>
                {session && (
                  <div>
                    <Button text="Delete" backgroundColor="red" onClick={() => handleDeleteEpisode(episode._id)}></Button>
                    <Button text="Edit" backgroundColor="goldenrod" onClick={() => handleEditEpisode(episode._id)}></Button>
                  </div>
                 
                )}
              </div>
            </div>
            </Link>
          ))}
        </div>
      </main>
    </Fragment>
  );
}

export default Episodes;
