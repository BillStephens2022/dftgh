import { Fragment, useState, useRef } from "react";
import classes from "./adminlogin.module.css";

function AdminSignup() {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const enteredUsername = usernameInputRef.current.value;
  const enteredPassword = passwordInputRef.current.value;
  const enteredConfirmedPassword = confirmPasswordInputRef.current.value;

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("attempting to signup!", enteredUsername, enteredPassword, enteredConfirmedPassword);
  }

  return (
    <Fragment>
      <h2 className={classes.form_header}>Admin Login</h2>
      <div className={classes.form_container}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className={classes.label}>Username</label>
            <input
              type="text"
              name="username"
              placeholder="username"
              className={classes.input}
              id="username"
              ref={usernameInputRef}
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
              ref={passwordInputRef}
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
              ref={confirmPasswordInputRef}
            />
          </div>
          <button type="button" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </Fragment>
  );
}

export default AdminSignup;
