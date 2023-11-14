import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "../buttons/button";
import classes from "./adminlogin.module.css";

const initialFormData = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const ChangePasswordForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState(initialFormData);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Check if the form data is not in its initial state, so user doesn't start see error messages after they've successfully
    // submitted and changed their password and form is back in initial state.
    if (formData.newPassword !== "" && formData.confirmNewPassword !== "") {
      setPasswordMismatch(formData.newPassword !== formData.confirmNewPassword);
      setPasswordLengthError(formData.newPassword.length < 8);
    } else {
      // Reset error states if the form is in its initial state
      setPasswordMismatch(false);
      setPasswordLengthError(false);
    }
  }, [formData.newPassword, formData.confirmNewPassword]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitPasswordChange = async (event) => {
    event.preventDefault();

    if (passwordMismatch || passwordLengthError) {
      // Don't submit if there are validation errors, return early
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message); // set success message
        setFormData(initialFormData); // set form back to initial state
      } else {
        console.error(data.message); // log error from API
      }
    } catch (error) {
      console.error("Error:", error.message); // Network or other errors
    }
  };

  return (
    <Fragment>
      <h2 className={classes.form_header}>Change Password</h2>
      <div className={classes.form_container}>
        <form className={classes.form} onSubmit={handleSubmitPasswordChange}>
          <div>
            <label htmlFor="oldPassword" className={classes.label}>
              Username
            </label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Old password"
              className={classes.input}
              id="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={classes.label}>
              Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              className={classes.input}
              id="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={classes.label}>
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              className={classes.input}
              id="password"
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className={classes.errorMessage_div}>
            {passwordMismatch && (
              <p className={classes.errorMessage_p}>Passwords do not match.</p>
            )}
            {passwordLengthError && (
              <p className={classes.errorMessage_p}>
                Password must be at least 8 characters long.
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleSubmitPasswordChange}
            text="Submit"
          ></Button>
          <div className={classes.successMessage_div}>
            {successMessage && (
              <p className={classes.successMessage_p}>{successMessage}</p>
            )}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ChangePasswordForm;
