// The Episodes page renders cards for the podcast episodes that have been
// "pushed" to the MongoDB database via the Admin page.
// The episode cards feature a photo, title, description, date aired, and buttons
// for Polls and Comments - these buttons show counts for # of polls and # of comments.

import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import { GoComment, GoPencil, GoTrash } from "react-icons/go";
import { RiBarChart2Fill } from "react-icons/ri";
import ModalForm from "@/components/forms/modalForm";
import classes from "@/pages/episodes/episodes.module.css";
import AddPollForm from "@/components/forms/addPollForm";
import EditEpisodeForm from "@/components/forms/editEpisodeForm";
import { getEpisodes, deleteEpisode, editEpisode } from "@/components/lib/api";
import { formatDate } from "@/components/lib/utils";
import IconButton from "@/components/buttons/iconButton";
import DeleteConfirmation from "@/components/deleteConfirmation";

const Episodes = ({ props }) => {
  // gets User session which is used to render edit and delete icons for
  // logged in users.
  const { data: session } = useSession();
  // State variable to store the fetched episodes data
  const [episodes, setEpisodes] = useState(props?.episodes || []);
  // State variable for fetching episodes and error handling
  const { data, error } = useSWR(
    "/api/episodes/",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 1000 }
  );
  // State variable for controlling modal behavior
  const [modalOpen, setModalOpen] = useState(false);
  // State variable for setting the form data for editing an episode or adding a poll
  const [formData, setFormData] = useState({
    // mode = "editEpisode" or "addPoll", used for determining which form to show
    // in the modal
    mode: "",

    episodeData: null, // For storing episode data in case of editing
  });

  // State variable for showing delete confirmation message (i.e. when deleting an episode)
  const [showConfirmation, setShowConfirmation] = useState(null);

  useEffect(() => {
    // Fetch episodes and sort them by date when data changes or error occurs
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

  // function for opening modal and determining which form to render in the modal
  // episode data is passed in when editing an episode, otherwise it is null.
  const openModal = (mode, episodeData = null) => {
    setModalOpen(true);
    setFormData({ mode, episodeData });
  };

  // function to close modal and reset the formData
  const closeModal = () => {
    setModalOpen(false);
    setFormData({ mode: "", episodeData: null });
  };

  // handler for delete button - when clicked a confirmation message
  // is rendered so user can confirm they really want to delete the episode
  const handleDeleteEpisode = (episodeId) => {
    setShowConfirmation(episodeId);
  };

  // deletes the selected episode from the database
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
  };

  // if user selects 'cancel' on the delete confirmation,
  // no action is taken and the confirmation message goes away.
  const cancelDeleteEpisode = () => {
    setShowConfirmation(null);
  };

  // if user clicks edit button, a modal will open rendering the EditEpisodeForm,
  // and is pre-populated with the episode data which the user can overwrite.
  const handleEditModal = async (event, episodeId) => {
    event.preventDefault();
    const episodeToEdit = episodes.find((episode) => episode._id === episodeId);
    if (episodeToEdit) {
      openModal("editEpisode", episodeToEdit);
    }
  };

  // handles submission of the EditEpisodeForm and updates the MongoDB database
  // with the editted episode
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
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <Head>
        <title>Drinking From The Garden Hose - Episodes</title>
        <meta
          name="description"
          content="Drinking From The Garden Hose Podcast Ed Philipp OB Spencer - Episodes Page"
        />
      </Head>
      <main className={classes.main}>
        <h1 className={classes.title}>Episodes</h1>
        {/* Modal renders either the AddPollForm or the EditEpisodeForm depending on which button is pressed. */}
        {modalOpen && (
          <ModalForm
            onClose={closeModal}
            modalTitle={
              formData.mode === "addPoll" ? "Add Poll" : "Add Episode"
            }
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

        {/* Renders all of the episodes from the MongoDB database in a card format,
        showing a photo, title, description, date aired, and buttons for Polls and Comments */}
        <div className={classes.episodes_div}>
          {episodes.map((episode) => (
            <div className={classes.card} key={episode._id}>
              <div className={classes.card_inner_wrapper}>
                <div
                  className={classes.banner_image}
                  style={{ backgroundImage: `url(${episode.imageLink})` }}
                >
                  {" "}
                </div>
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
                {/* Link brings you to the selected 'Episode' page based on the episode's ID
                the dynamic episode page will ultimately show the episodes details and a comments and polls section. */}
                <Link
                  href={`/episodes/${episode._id}`}
                  className={classes.link}
                >
                  <footer className={classes.cardFooter}>
                    <button
                      className={`${classes.card_button} ${classes.button_outline}`}
                    >
                      <span className={classes.footer_icon}>
                        <GoComment size={24} />
                      </span>
                      {episode.comments?.length}{" "}
                      {episode.comments?.length === 1 ? "Comment" : "Comments"}
                    </button>
                    <button
                      className={`${classes.card_button} ${classes.button_fill}`}
                    >
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
              {/* Renders delete confirmation message if user attempt to delete the episode */}
              {showConfirmation === episode._id && (
                <DeleteConfirmation
                  itemToBeDeleted="episode"
                  onClick1={confirmDeleteEpisode}
                  onClick2={cancelDeleteEpisode}
                  id={episode._id}
                />
              )}

              {/* If the user is logged in, a pencil icon and a trash icon will be 
d edit or delete the episode  */}
              {session && (
                <div className={classes.icon_button_div}>
                  <IconButton
                    icon={<GoPencil />}
                    onClick={(event) => handleEditModal(event, episode._id)}
                  />
                  <IconButton
                    icon={<GoTrash />}
                    onClick={(event) => handleDeleteEpisode(episode._id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </Fragment>
  );
};

// Fetches episodes data asynchronously at build time using getEpisodes function from the API.
// Sorts the episodes by date and sets them as initial props for the Episodes component.
export async function getStaticProps() {
  let episodes = [];
  // Retrieve episodes data from the API
  try {
    const episodesJSON = await getEpisodes();
    // Sort episodes by date in descending order (newest first)
    episodes = episodesJSON.sort(
      (a, b) => new Date(b.dateAired) - new Date(a.dateAired)
    );
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
