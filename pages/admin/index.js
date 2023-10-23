import { Fragment, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "../../components/button";
import AdminLogin from "../../components/adminlogin";
import AdminSignup from "../../components/adminsignup";
import AddEpisodeForm from "../../components/addEpisodeForm";
import classes from "./admin.module.css";

function Admin() {
  const { data: session } = useSession();

  // Use useEffect to handle changes to the session object
  useEffect(() => {
    if (session) {
      // Session is authenticated, but user data is not available yet.
      // You can perform actions here, like fetching user data from an API.
      console.log(session);
    }
  }, [session]);

  function logoutHandler() {
    signOut();
  }

  function changePasswordHandler() {
    console.log("clicked change password button!");
  }

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

            <Button onClick={logoutHandler} text="Logout"></Button>
            <div className={classes.button_div}>
          <Button
            text="Change Password"
            onClick={changePasswordHandler}
          ></Button>
          <Button text="Add Episode"></Button>
        </div>
            <AddEpisodeForm />
          </div>
        )}
         
        {!session && (
          <div>
            <AdminSignup />
            <AdminLogin />
          </div>
        )}
      </main>
    </Fragment>
  );
}

export default Admin;
