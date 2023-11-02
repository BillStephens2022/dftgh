import { Fragment, useState } from "react";
import { signIn } from "next-auth/react";
import Button from "./button";
import classes from "./adminlogin.module.css";

const initialFormData = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitPasswordChange = (event) => {
    event.preventDefault();
    console.log("attempting to change password!");
    console.log("formData: ", formData)
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
          <Button
            type="button"
            onClick={handleSubmitPasswordChange}
            text="Submit"
          ></Button>
        </form>
      </div>
    </Fragment>
  );
}

export default ChangePasswordForm;
