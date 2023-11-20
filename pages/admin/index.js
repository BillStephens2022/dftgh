import { Fragment, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import Button from "../../components/buttons/button";
import AdminLogin from "../../components/forms/adminlogin";
import AdminSignup from "../../components/forms/adminsignup";

import classes from "./admin.module.css";
import ChangePasswordForm from "@/components/forms/changePasswordForm";

const Admin = () => {
  const { data: session } = useSession();
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
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
            <p className={classes.where_to_go}>Where do you want to go?</p>


            <div className={classes.button_div}>             
              <Button
                text="Change Password"
                onClick={changePasswordHandler}
                margin="0 7px 0 0"
              ></Button>
              <Button text="Home" href="/" margin="0 7px 0 7px"></Button>
              <Button text="Episodes" href="/episodes" margin="0 7px 0 7px"></Button>
              <Button text="Feedback" href="/feedback" margin="0 7px 0 7px"></Button>
              <Button onClick={logoutHandler} text="Logout" backgroundColor="red" margin="0 0 0 7px"></Button>
            </div>

          </div>
        )}

        {!session && (
          <div>
            <AdminSignup />
            <AdminLogin />
          </div>
        )}

        {session && showChangePasswordForm && (
          <div>
            <ChangePasswordForm />
          </div>
        )}
      </main>
    </Fragment>
  );
}

export default Admin;
