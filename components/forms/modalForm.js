import { Fragment } from "react";
import Button from "@/components/buttons/button";
import classes from "@/components/forms/modalForm.module.css";
import CloseButton from "@/components/buttons/closeButton";


const ModalForm = ({ onClose, modalOpen, setModalOpen, modalTitle, form }) => {
  return (
    <Fragment>
      <div className={`${classes.modal} ${modalOpen ? classes.modalOpen : ""}`}>
         
        <div className={classes.modal_inner_container}>
          <div className={classes.modal_header}>
            <h5 className={classes.modal_header}>{modalTitle}</h5>
            <CloseButton onClick={onClose} modalOpen={modalOpen} />
            
          </div>
         
          <div className={classes.modal_body}>
            {form}
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

export default ModalForm;
