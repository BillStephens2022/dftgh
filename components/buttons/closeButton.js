import { IoIosCloseCircle } from "react-icons/io";
import classes from "@/components/buttons/closeButton.module.css";

const CloseButton = ({ onClick, modalOpen }) => (
  <IoIosCloseCircle
    size={25}
    color="lightseagreen"
    onClick={onClick}
    className={`${classes.buttonPosition} ${
      modalOpen ? classes.modalOpen : ""
    }`}
  />
);

export default CloseButton;
