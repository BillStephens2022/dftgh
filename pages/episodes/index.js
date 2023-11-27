import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import { GoComment, GoPencil, GoTrash } from "react-icons/go";
import { RiBarChart2Fill } from 'react-icons/ri';
import Button from "@/components/buttons/button";
import ModalForm from "@/components/forms/modalForm";
import classes from "@/pages/episodes/episodes.module.css";
import AddEpisodeForm from "@/components/forms/addEpisodeForm";
import AddPollForm from "@/components/forms/addPollForm";
import EditEpisodeForm from "@/components/forms/editEpisodeForm";
import {
  getEpisodes,
  deleteEpisode,
  editEpisode,
} from "@/components/lib/api";
import { formatDate } from "@/components/lib/dates";
import IconButton from "@/components/buttons/iconButton";
import DeleteConfirmation from "@/components/deleteConfirmation";

const Episodes = ({ props }) => {
  const { data: session } = useSession();
  const [episodes, setEpisodes] = useState(props?.episodes || []);

  const { data, error } = useSWR("/api/episodes/", (url) => fetch(url).then(res => res.json()), { refreshInterval: 1000 });
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    mode: "",  // "addEpisode", "editEpisode", or "addPoll"
    episodeData: null, // For storing episode data in case of editing
  })
  const [showConfirmation, setShowConfirmation] = useState(null);

  useEffect(() => {
    if (error) {
      console.error("Error fetching episodes:", error); 
    }
    if (data) {
      const sortedEpisodes = data.sort(
        (a, b) => new Date(b.dateAired) - new Date(a.dateAired)
      );
      setEpisodes(sortedEpisodes);
    }
  }, [data, error]);


  const openModal = (mode, episodeData = null) => {
    setModalOpen(true);
    setFormData({ mode, episodeData }); // set mode and episodeData when button selected to open the modal
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ mode: "", episodeData: null }); // reset formData state when closing the modal
  };

  const handleDeleteEpisode = (episodeId) => {
    console.log("Are you sure you want to delete this ID? ", episodeId);
    setShowConfirmation(episodeId);  // Set the confirmation state to the ID of the feedback to be deleted
  }

  const confirmDeleteEpisode = async (episodeId) => {

    try {
      const success = await deleteEpisode(episodeId);
      if (success) {
        const updatedEpisodes = await getEpisodes();
        const sortedEpisodes = updatedEpisodes.sort(
          (a, b) => new Date(b.dateAired) - new Date(a.dateAired)
        );
        setEpisodes(sortedEpisodes);
      } else {
        console.error("Error deleting episode");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const cancelDeleteEpisode = () => {
    setShowConfirmation(null); // Reset confirmation without deleting
  };

  const handleEditModal = async (event, episodeId) => {
    event.preventDefault();
    const episodeToEdit = episodes.find((episode) => episode._id === episodeId);
    if (episodeToEdit) {
      openModal("editEpisode", episodeToEdit);
    }
  }

  const handleEditEpisode = async (episodeIdToUpdate, episodeData) => {
    try {
      const success = await editEpisode(episodeIdToUpdate, episodeData);
      if (success) {
        console.log("Episode edited successfully!");
        const updatedEpisodes = await getEpisodes();
        const sortedEpisodes = updatedEpisodes.sort(
          (a, b) => new Date(b.dateAired) - new Date(a.dateAired)
        );
        setEpisodes(sortedEpisodes);
        closeModal();
      } else {
        console.error("Error editing episode");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!data) {
    return <p>Loading...</p>
  }

  return (
    <Fragment>
      <Head>
        <title>Drinking From The Garden Hose - Episodes</title>
        <meta name="description" content="Drinking From The Garden Hose Podcast Ed Philipp OB Spencer - Episodes Page" />
      </Head>
      <main className={classes.main}>
        <h1 className={classes.title}>Episodes</h1>
        
        {modalOpen && (
          <ModalForm
            onClose={closeModal}
            modalTitle={formData.mode === "addPoll" ? "Add Poll" : "Add Episode"}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            form={
              formData.mode === "addPoll" ? (
                <AddPollForm />
              ) : (
                <EditEpisodeForm
                  episode={formData.episodeData}
                  onSubmit={handleEditEpisode}
                />
              ) 
            }
          />
        )}
        <div className={classes.episodes_div}>
          {episodes.map((episode) => (
            <div className={classes.card} key={episode._id}>
              <div className={classes.card_inner_wrapper}>
                <div className={classes.banner_image} style={{ backgroundImage: `url(${episode.imageLink})` }}> </div>
                <div className={classes.card_header}>
                  <h3 className={classes.episode_title}>{episode.title}</h3>
                  <h4 className={classes.episode_aired}>
                    Aired: {formatDate(episode.dateAired)}
                  </h4>
                </div>
                <div className={classes.card_main}>
                  <div className={classes.episode_details}>
                    <p className={classes.episode_detail}>
                      {episode.description}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/episodes/${episode._id}`}
                  className={classes.link}
                >
                  <footer className={classes.cardFooter}>
                    <button className={`${classes.card_button} ${classes.button_outline}`}>
                      <span className={classes.footer_icon}>
                        <GoComment size={24} />

                      </span>
                      {episode.comments?.length}{" "}
                      {episode.comments?.length === 1 ? "Comment" : "Comments"}
                    </button>
                    <button className={`${classes.card_button} ${classes.button_fill}`}>
                      <span className={classes.footer_icon}>
                        <RiBarChart2Fill size={24} />

                      </span>
                      <span>
                        {episode.polls?.length}{" "}
                        {episode.polls?.length === 1 ? "Poll" : "Polls"}
                      </span>
                    </button>

                  </footer>

                </Link>

              </div>
              {showConfirmation === episode._id && (
                <DeleteConfirmation itemToBeDeleted="episode" onClick1={confirmDeleteEpisode} onClick2={cancelDeleteEpisode} id={episode._id} />
              )}
              {session && (
                <div className={classes.icon_button_div}>
                  <IconButton
                    icon={<GoPencil />}
                    onClick={(event) =>
                      handleEditModal(event, episode._id)
                    }
                  />
                  <IconButton
                    icon={<GoTrash />}
                    onClick={(event) =>
                      handleDeleteEpisode(episode._id)
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </Fragment>
  );
}

export async function getStaticProps() {
  let episodes = [];

  try {
    const episodesJSON = await getEpisodes();
    episodes = episodesJSON.sort((a, b) => new Date(b.dateAired) - new Date(a.dateAired));
  } catch (error) {
    console.error(error.message);
  }

  return {
    props: {
      episodes,
    },
    revalidate: 1200, // Re-generate page every 1200 seconds (20 minutes)
  };
}

export default Episodes;
