import { Fragment } from "react";
import classes from "./button.module.css";

function Button({text}) {
  return (
    <Fragment>
      <button className={classes.btn}>{text}</button>
    </Fragment>
  );
}

export default Button;
