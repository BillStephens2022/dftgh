import { Fragment } from "react";
import classes from "./button.module.css";

function Button({text, onClick, type}) {
  return (
    <Fragment>
      <button className={classes.btn} onClick={onClick} type={type} >{text}</button>
    </Fragment>
  );
}

export default Button;
