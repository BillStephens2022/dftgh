import { Fragment, useState } from "react";
import classes from "./adminlogin.module.css";

function AdminSignup() {
  return (
    <Fragment>
      <h2 className={classes.form_header}>Admin Login</h2>
      <div className={classes.form_container}>
        <form className={classes.form}>
          <div>
            <label htmlFor="username" className={classes.label}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="username"
              className={classes.input}
              id="username"
            />
          </div>
          <div>
            <label htmlFor="password" className={classes.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              className={classes.input}
              id="password"
            />
          </div>
          <div>
            <label htmlFor="confirm" className={classes.label}>Confirm Password</label>
            <input
              type="password"
              name="confirm-password"
              placeholder="confirm password"
              className={classes.input}
              id="confirm-password"
            />
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default AdminSignup;
