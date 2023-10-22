import { Fragment, useState, useRef } from "react";
import Button from "./button";
import classes from "./adminlogin.module.css";

function AdminLogin() {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  

  async function handleSubmit(event) {
    event.preventDefault();
    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    console.log("attempting to log in!", enteredUsername, enteredPassword);
  }

  return (
    <Fragment>
     <h2 className={classes.form_header}>Admin Signup</h2>
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
          <Button type="button" onClick={handleSubmit} text="Submit"></Button>
        </form>

      </div>
    </Fragment>
  );
}

export default AdminLogin;