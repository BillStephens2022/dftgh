import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useEpisodeContext } from "@/context/EpisodeContext";
import Button from "@/components/button";
import ModalForm from "@/components/modalForm";
import classes from "./episodes.module.css";
import AddEpisodeForm from "@/components/addEpisodeForm";
import { getEpisodes, addEpisode } from "@/components/lib/api";

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
            <div className={classes.card} key={episode._id}>
              <div className={classes.image_div}>
                <img
                  src={episode.imageLink}
                  alt={episode.title}
                  className={classes.image}
                ></img>
              </div>
              <div className={classes.episode_details}>
                <h3 className={classes.episode_detail}>{episode.title}</h3>
                <h4 className={classes.episode_detail}>
                  Aired: {episode.dateAired}
                </h4>
                <p className={classes.episode_detail}>{episode.description}</p>
                {session && (
                  <div>
                    <Button text="Delete"></Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </Fragment>
  );
}

export default Episodes;
