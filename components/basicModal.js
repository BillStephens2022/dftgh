import { Fragment } from "react";
import Button from "@/components/buttons/button";
import classes from "@/components/basicModal.module.css";


const BasicModal = ({ onClose, modalOpen, setModalOpen, modalTitle, children }) => {
  return (
    <Fragment>
      <div className={`${classes.modal} ${modalOpen ? classes.modalOpen : ""}`}>
         
        <div className={classes.modal_inner_container} onClick={(e) => e.stopPropagation()}>
          <div className={classes.modal_header}>
            <h5 className={classes.modal_header}>{modalTitle}</h5>
            <button
              type="button"
              onClick={onClose}
              className={`${classes.buttonPosition} ${modalOpen ? classes.modalOpen : ""}`}
            >
              {" "}
              x
            </button>
            
          </div>
         
          <div className={classes.modal_body}>
            {children}
          </div>
          <div className={classes.modal_footer}>
            <Button
              backgroundColor="darkgray"
              type="button"
              text="Cancel"
              zIndex="4004"
              color="white"
              onClick={() => setModalOpen(!modalOpen)}
            ></Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default BasicModal;