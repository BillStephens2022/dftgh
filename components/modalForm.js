import { Fragment, useState } from "react";
import AddEpisodeForm from "./addEpisodeForm";
import Button from "./button";
import classes from "./modalForm.module.css";

function ModalForm({ onClose, modalOpen, setModalOpen, modalTitle }) {
  return (
    <Fragment>
      <div className={classes.modal} isOpen={modalOpen}>
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
          <AddEpisodeForm />
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
