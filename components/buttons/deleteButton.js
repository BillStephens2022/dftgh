import { Fragment } from "react";
import classes from "./deleteButton.module.css";

function DeleteButton({ onClick, type, children }) {
  return (
    <Fragment>
      <button className={classes.delete_btn} onClick={onClick} type="button">x</button>
    </Fragment>
  );
}

export default DeleteButton;