import { Fragment } from "react";
import classes from "./button.module.css";

const Button = ({ text, onClick, type, backgroundColor = "", backgroundImage = "linear-gradient(135deg, #184e68 0%, #57ca85 100%)", color = "white", icon, children, margin = "0" }) => {
  const buttonStyle = {
    backgroundColor: backgroundColor ? backgroundColor : "none",
    backgroundImage: backgroundColor ? "none" : backgroundImage,
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
