import { Fragment, useState, useRef } from "react";
import Button from "@/components/buttons/button";
import classes from "@/components/forms/adminlogin.module.css";

const createUser = async (username, password) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }

const AdminSignup = () => {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmedPassword = confirmPasswordInputRef.current.value;

    if (enteredPassword === enteredConfirmedPassword) {
    try {
        const result = await createUser(enteredUsername, enteredPassword);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    } else {
        console.log("Passwords don't match, try again!");
    }
  }

  return (
    <Fragment>
      <h2 className={classes.form_header}>Admin Signup</h2>
      <div className={classes.form_container}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className={classes.label}>
              Username
            </label>
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
            <label htmlFor="password" className={classes.label}>
              Password
            </label>
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
            <label htmlFor="confirm" className={classes.label}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm-password"
              placeholder="confirm password"
              className={classes.input}
              id="confirm-password"
              ref={confirmPasswordInputRef}
            />
          </div>
          <Button type="button" onClick={handleSubmit} text="Submit"></Button>
        </form>
      </div>
    </Fragment>
  );
}

export default AdminSignup;
