import { Fragment } from "react";
import classes from "@/components/buttons/iconButton.module.css";

const IconButton = ({ icon, onClick, style }) => {
    const buttonStyle = {
        ...style
    }
  return (
    <Fragment>
      <button className={classes.icon_btn} onClick={onClick} type="button" style={buttonStyle}>{icon}</button>
    </Fragment>
  );
}

export default IconButton;