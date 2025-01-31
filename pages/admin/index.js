// Admin page is only available to the Podcasters, which when logged in, allows them to control Episode content on the site.
// The page features a full listing of episodes from the podcast's RSS feed. Next to each episode, there is a button that allows the podcaster
// to "push" the episode to the database so that it renders on the Episodes page.
// This 'Push' button opens a pre-populated form (populated from RSS feed details) in a modal, and the user can add a photo to the form via
// the Cloudinary upload widget. Once the form is submitted the Episode will appear on the Episodes page along with a rendered card for that episode.
// After the episode has been pushed, the status updates with a green checkmark to indicate the episode was already pushed.
// This page also allows the Podcasters to change their password or log off.
import { Fragment, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
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
  const [comments, setComments] = useState([]);

  const router = useRouter();

  const { data, error } = useSWR(
    "/api/comments/",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 1000 }
  );

  // Use useEffect to handle changes to the session object
  useEffect(() => {
    if (session) {
      // Session is authenticated, but user data is not available yet.
      console.log(session);
    }
  }, [session]);

  useEffect(() => {
    // Fetch comments
    if (error) {
      console.error("Error fetching comments:", error);
    }
    if (data) {
      setComments(data);
    }
  }, [data, error]);

  // List of podcaster names to exclude (case-insensitive) for top fans list
  const excludedNames = ["roadkill", "flounder", "ed", "ob"];

  // Compute the top 10 fans by counting comments per user
  const getTopFans = () => {
    const commentCounts = {};

    comments.forEach(({ name }) => {
      const lowerName = name.toLowerCase();
      if (!excludedNames.includes(lowerName)) {
        commentCounts[lowerName] = (commentCounts[lowerName] || 0) + 1;
      }
    });

    return Object.entries(commentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const topFans = getTopFans();

  // handle logging off
  const logoutHandler = () => {
    signOut();
  };

  // handle changing password - when button clicked, renders the form
  const changePasswordHandler = () => {
    setShowChangePasswordForm(true);
  };

  // handle clicking 'Push' episode button.  Sets the selected episode and opens
  // modal with partially pre-populated AddEpisodeForm (populated from RSS feed)
  const handlePushEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    setModalOpen(true);
  };

  // closes modal for the AddEpisodeForm
  const closeModal = () => {
    setModalOpen(false);
  };

  // adds 'pushed' episode to the MongoDB database and closes modal
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
  };

  // url for the RSS feed, passed into the RssFeed component as a prop in returned
  // JSX below
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
              <Button
                onClick={logoutHandler}
                text="Logout"
                backgroundColor="red"
                margin="0 0 0 0.25rem"
                minWidth="10rem"
              ></Button>
            </div>
          </div>
        )}

        {/* If user not logged in, the AdminLogin form will be rendered */}
        {!session && (
          <div>
            {/* <AdminSignup /> */}
            <AdminLogin />
          </div>
        )}

        {/* If user is logged in and user has clicked the Change Password button,
        the ChangePasswordForm will be rendered */}
        {session && showChangePasswordForm && (
          <div>
            <ChangePasswordForm />
          </div>
        )}

        {/* If user is logged in the RssFeed will be rendered showing a full
        listing of episodes from the feed, and status of whether the episode
        has been pushed or not. */}
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

        {/* Modal opens when user clicks the 'Push' button for a specific episode 
        Form will be pre-populated with episode details from the RSS Feed and 
        use will be able to attach a photo via a Cloudinary Upload Widget via 
        the AddEpisodeForm rendered in the modal */}

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
        {session && (
          <div className={classes.top_10}>
            <h2 className={classes.top_10_header}>Top 10 Fans</h2>
            <table className={classes.top_10_table}>
              <thead>
                <tr className={classes.top_10_table_header}>
                  <th className={classes.top_10_table_col_header}>Name</th>
                  <th className={classes.top_10_table_col_header}>Comments</th>
                </tr>
              </thead>
              <tbody>
                {topFans.map(({ name, count }) => (
                  <tr key={name} className={classes.top_10_table_row}>
                    <td className={classes.top_10_table_cell}>{name}</td>
                    <td className={classes.top_10_table_cell}>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Fragment>
  );
};

export default Admin;
