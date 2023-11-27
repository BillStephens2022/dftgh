import { Fragment, useState, useRef } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/buttons/button";
import classes from "@/components/forms/adminlogin.module.css";

const AdminLogin = () => {

  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    try {
      const response = await signIn("credentials", {
        redirect: false,
        username: enteredUsername,
        password: enteredPassword,
      });
      console.log(response);
      if (response?.status == 200) {
        console.log("Login successful!");
        setLoginError(null);
      } else {
        console.error("Login failed: ", response?.error);
        setLoginError("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      setLoginError("Error logging in. Please try again.");
    }
  }

  return (
    <Fragment>
      <h2 className={classes.form_header}>Admin Login</h2>
      <div className={classes.form_container}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.form_group}>
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
          <div className={classes.form_group}>
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
          <Button type="submit" text="Submit" margin = "1rem 0 0.5rem 0"></Button>
          {loginError && ( // Conditionally render error message
            <p className={classes.errorMessage_p}>{loginError}</p>
          )}
        </form>
      </div>
    </Fragment>
  );
}

export default AdminLogin;
