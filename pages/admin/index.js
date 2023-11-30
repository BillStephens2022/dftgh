// Admin page is only available to the Podcasters, which when logged in, allows them to control Episode content on the site.
// The page features a full listing of episodes from the podcast's RSS feed. Next to each episode, there is a button that allows the podcaster
// to "push" the episode to the database so that it renders on the Episodes page. 
// This 'Push' button opens a pre-populated form (populated from RSS feed details) in a modal, and the user can add a photo to the form via
// the Cloudinary upload widget. Once the form is submitted the Episode will appear on the Episodes page along with a rendered card for that episode.
// After the episode has been pushed, the status updates with a green checkmark to indicate the episode was already pushed.
// This page also allows the Podcasters to change their password or log off.
import { Fragment, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import { addEpisode, getEpisodes } from "@/components/lib/api";
import Button from "@/components/buttons/button";
import AdminLogin from "@/components/forms/adminlogin";
// note: commented out Signup page as only the Podcasters can log in. Now that they've signed up, this is no longer needed, but
// keeping it in case we ever need to sign up another admin User or if later we want to start authenticating all users before they
// can post comments or feedback
// import AdminSignup from "../../components/forms/adminsignup";
import RssFeed from "@/components/rssFeed";
import ModalForm from "@/components/forms/modalForm";
import AddEpisodeForm from "@/components/forms/addEpisodeForm";
import classes from "@/pages/admin/admin.module.css";
import ChangePasswordForm from "@/components/forms/changePasswordForm";

const Admin = () => {
  const { data: session } = useSession();
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [fetchedEpisodes, setFetchedEpisodes] = useState([]);
  
  const router = useRouter();

  // Use useEffect to handle changes to the session object
  useEffect(() => {
    if (session) {
      // Session is authenticated, but user data is not available yet.
      // You can perform actions here, like fetching user data from an API.
      console.log(session);
    }
  }, [session]);

  const logoutHandler = () => {
    signOut();
  }

  const changePasswordHandler = () => {
    console.log("clicked change password button!");
    setShowChangePasswordForm(true);
  }

  const handlePushEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const handleAddEpisode = async (newEpisode) => {
    try {
      const success = await addEpisode(newEpisode);
      if (success) {
        const updatedEpisodesFromDB = await getEpisodes();
        setFetchedEpisodes(updatedEpisodesFromDB);
        setModalOpen(false); // Close the modal after adding episode
      } else {
        console.error("Error adding episode");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const podcastUrl = "https://drinkingfromthegardenhose.libsyn.com/rss";

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.header}>Admin Page</h1>

        {session && (
          <div className={classes.logout_button}>
            <h3 className={classes.welcome_header}>
              Welcome,{" "}
              <span className={classes.welcome_header_span}>
                {session.user.username}!
              </span>
            </h3>
            <div className={classes.button_div}>
              <Button
                text="Change Password"
                onClick={changePasswordHandler}
                margin="0 0.25rem 0 0"
                minWidth="10rem"
              ></Button>
              <Button onClick={logoutHandler} text="Logout" backgroundColor="red" margin="0 0 0 0.25rem" minWidth="10rem"></Button>
            </div>

          </div>
        )}

        {!session && (
          <div>
            {/* <AdminSignup /> */}
            <AdminLogin />
          </div>
        )}

        {session && showChangePasswordForm && (
          <div>
            <ChangePasswordForm />
          </div>
        )}

        {session && (
          <RssFeed 
            podcastUrl={podcastUrl} 
            handlePushEpisodeClick={handlePushEpisodeClick} 
            modalOpen={modalOpen} 
            setModalOpen={setModalOpen} 
            selectedEpisode={selectedEpisode}
            setSelectedEpisode={setSelectedEpisode}
            fetchedEpisodes={fetchedEpisodes}
            setFetchedEpisodes={setFetchedEpisodes}
          />
        )}

        {modalOpen && (
          <ModalForm
            onClose={closeModal}
            modalTitle={"Push Episode"}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            form={

              <AddEpisodeForm
                onSubmit={handleAddEpisode}
                onSubmitSuccess={closeModal}
                selectedEpisode={selectedEpisode}
              />

            }
          />
        )}
      </main>
    </Fragment>



  );
}

export default Admin;
