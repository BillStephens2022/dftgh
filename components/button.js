import { Fragment } from "react";
import classes from "./button.module.css";

function Button({text, onClick}) {
  return (
    <Fragment>
      <button className={classes.btn} onClick={onClick}>{text}</button>
    </Fragment>
  );
}

export default Button;
