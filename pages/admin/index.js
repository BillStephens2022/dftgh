import { Fragment, useState } from "react";
// import { useSession, signOut } from "next-auth/client";
import Button from "../../components/button";
import AdminLogin from "../../components/adminlogin";
import AdminSignup from "../../components/adminsignup";
import classes from "./admin.module.css";

function Admin() {
  // const [session, loading] = useSession();
  // function logoutHandler() {
  //   signOut();
  // }

  return (
    <Fragment>
      <main className={classes.main}>
      {/* {session && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )} */}
        <h1 className={classes.header}>Admin Page</h1>
        <div className={classes.button_div}>
          <Button text="Admin Login" onClick={() => setShowModal(true)}></Button>
          <Button text="Add Episode"></Button>
        </div>
          <AdminSignup />
          <AdminLogin />
          
        
      </main>
    </Fragment>
  );
}

export default Admin;
