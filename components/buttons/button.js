import { Fragment } from "react";
import classes from "./button.module.css";

const Button = ({ text, onClick, type, backgroundColor = "seagreen", color = "white", children, margin = "0" }) => {
  const buttonStyle = {
    backgroundColor: backgroundColor,
    color: color,
    margin: margin
  }
  return (
    <Fragment>
      <button className={classes.btn} onClick={onClick} type={type} style={buttonStyle}>{text}</button>
    </Fragment>
  );
}

export default Button;
