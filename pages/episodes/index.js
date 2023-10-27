import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import Button from "@/components/button";
import ModalForm from "@/components/modalForm";
import classes from "./episodes.module.css";

function Episodes() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    if (session) {
      console.log(session);
    }
  }, [session]);

  useEffect(() => {
    async function fetchEpisodes() {
      const episodesData = await getEpisodes();
      if (episodesData) {
        setEpisodes(episodesData);
      }
    }
  
    // Call the fetchEpisodes function when the component mounts
    fetchEpisodes();
  }, []); // Empty dependency array ensures the effect runs once after the initial render
  


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
        console.log(episodesJSON);
        return episodesJSON;
      } else {
        console.error("Error fetching episodes:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
      return null;
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

        {modalOpen && <ModalForm onClose={closeModal} modalTitle="Add Episode" modalOpen={modalOpen} setModalOpen={setModalOpen}></ModalForm>}

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
