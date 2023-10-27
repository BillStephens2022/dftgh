import { Fragment } from "react";
import Button from "./button";
import classes from "./modalForm.module.css";

function ModalForm({ onClose, modalOpen, setModalOpen, modalTitle, form }) {
  return (
    <Fragment>
      <div className={classes.modal} >
        <div className={classes.modal_header}>
          <h5 className={classes.modal_header}>{modalTitle}</h5>
          <Button
            backgroundColor="red"
            text="X"
            type="button"
            onClick={onClose}
          >
            {" "}
            X
          </Button>
        </div>
        <div className={classes.modal_body}>
          {form}
        </div>
        <div className={classes.modal_footer}>
          <Button
            backgroundColor="darkgray"
            type="button"
            text="Cancel"
            onClick={() => setModalOpen(!modalOpen)}
          ></Button>
        </div>
      </div>
    </Fragment>
  );
}

export default ModalForm;
