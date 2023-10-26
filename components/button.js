import { Fragment } from "react";
import classes from "./button.module.css";

function Button({ text, onClick, type, backgroundColor = "seagreen", color = "white", children }) {
  const buttonStyle = {
    backgroundColor: backgroundColor,
    color: color, 
  }
  return (
    <Fragment>
      <button className={classes.btn} onClick={onClick} type={type} style={buttonStyle}>{text}</button>
    </Fragment>
  );
}

export default Button;
