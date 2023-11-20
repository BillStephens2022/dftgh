import { Fragment } from "react";
import classes from "./deleteConfirmation.module.css";

const DeleteConfirmation = ({itemToBeDeleted, onClick1, onClick2, id}) => {
    console.log(itemToBeDeleted, ": to be deleted");
    return (
        <div className={classes.delete_notification}>
            <p>Are you sure you want to delete this {itemToBeDeleted}?</p>
            <button onClick={() => onClick1(id)}>Yes</button>
            <button onClick={() => onClick2(id)}>No</button>
        </div>
    )
}

export default DeleteConfirmation;