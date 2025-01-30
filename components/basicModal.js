import { Fragment } from "react";
import CloseButton from "./buttons/closeButton";
import classes from "@/components/basicModal.module.css";

const BasicModal = ({
  onClose,
  modalOpen,
  setModalOpen,
  modalTitle,
  children,
}) => {
  return (
    <Fragment>
      <div className={`${classes.modal} ${modalOpen ? classes.modalOpen : ""}`}>
        <div
          className={classes.modal_inner_container}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={classes.modal_header}>
            <h5 className={classes.modal_title}>{modalTitle}</h5>
            <CloseButton
              onClick={onClose}
              modalOpen={modalOpen}
            />
          </div>

          <div className={classes.modal_body}>{children}</div>
          <div className={classes.modal_footer}>
            <button
              type="button"
              className={classes.modal_button}
              onClick={() => setModalOpen(!modalOpen)}
            >Close</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BasicModal;
