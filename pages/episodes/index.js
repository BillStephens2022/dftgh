import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useEpisodeContext } from "@/context/EpisodeContext";
import Button from "@/components/button";
import ModalForm from "@/components/modalForm";
import classes from "./episodes.module.css";
import AddEpisodeForm from "@/components/addEpisodeForm";

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
  }, [session]);

  useEffect(() => {
    getEpisodes();
  }, []); // fetch episodes on mount


  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  async function getEpisodes() {
    try {
      const response = await fetch("/api/episodes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const episodesJSON = await response.json();
        dispatch({ type: "SET_EPISODES", payload: episodesJSON });
      } else {
        console.error("Error fetching episodes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  }

  async function addEpisode(newEpisode) {
    try {
      const response = await fetch("/api/episodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEpisode),
      });

      if (response.ok) {
        console.log("Episode added successfully");
        getEpisodes(); // Fetch episodes after adding a new episode
        closeModal(); // Close the modal after adding episode
      } else {
        console.error("Error adding episode:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding episode:", error);
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
            form={<AddEpisodeForm onSubmit={addEpisode} onSubmitSuccess={closeModal} />}
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
