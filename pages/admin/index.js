import { Fragment, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "../../components/button";
import AdminLogin from "../../components/adminlogin";
import AdminSignup from "../../components/adminsignup";
import classes from "./admin.module.css";



function Admin() {
  const { data: session, status } = useSession();

  // Use useEffect to handle changes to the session object
  useEffect(() => {
    if (status === "authenticated" && !session?.user) {
      // Session is authenticated, but user data is not available yet.
      // You can perform actions here, like fetching user data from an API.
    }
  }, [status, session]);
  console.log(session);
  
  function logoutHandler() {
    signOut();
  }

  function changePasswordHandler() {
    console.log("clicked change password button!");
  }

  return (
    <Fragment>
      <main className={classes.main}>
      {status === "authenticated" && session?.user && (
          <div className={classes.logout_button}>
            <h3>You are Logged in!</h3>
            <h3>{session.user.username}</h3>
            <Button onClick={logoutHandler} text="Logout"></Button>
          </div>
        )}
        <h1 className={classes.header}>Admin Page</h1>
        <div className={classes.button_div}>
          <Button
            text="Change Password"
            onClick={changePasswordHandler}
          ></Button>
          <Button text="Add Episode"></Button>
        </div>
        <AdminSignup />
        <AdminLogin />
      </main>
    </Fragment>
  );
}

export default Admin;
