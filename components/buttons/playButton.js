import { Fragment } from "react";
import { GoPlay } from "react-icons/go";
import classes from "./playButton.module.css";

const PlayButton = ({ onClick, children, text }) => {
    return (
        <Fragment>
            <button className={classes.btn_play}><GoPlay /><span className={classes.btn_text} onClick={onClick} >{text}</span></button>
        </Fragment>
    );
}

export default PlayButton;