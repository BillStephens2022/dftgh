import { Fragment, useState } from "react";
import Button from "../../components/button";
import AdminLogin from "../../components/adminlogin";
import AdminSignup from "../../components/adminsignup";
import classes from "./admin.module.css";

function Admin() {
 

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.header}>Admin Page</h1>
        <div className={classes.button_div}>
          <Button text="Admin Login" onClick={() => setShowModal(true)}></Button>
          <Button text="Add Episode"></Button>
        </div>
        <div>
          <AdminLogin />
          <AdminSignup />
        </div>
      </main>
    </Fragment>
  );
}

export default Admin;
