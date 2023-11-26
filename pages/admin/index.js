import { Fragment, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import { addEpisode } from "@/components/lib/api";
import Button from "@/components/buttons/button";
import AdminLogin from "@/components/forms/adminlogin";
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
  // Use useEffect to handle changes to the session object
  const router = useRouter();


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
    console.log("episode to add: ", episode);
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
