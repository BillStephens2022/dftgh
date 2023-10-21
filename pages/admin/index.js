import { Fragment, useState } from "react";
import Button from "../../components/button";
import AdminLogin from "../../components/adminlogin";
import classes from "./admin.module.css";

function Admin() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.header}>Admin Page</h1>
        <div className={classes.button_div}>
          <Button text="Admin Login" onClick={() => setShowModal(true)}></Button>
          <Button text="Add Episode"></Button>
        </div>
      </main>
      {showModal && (
        <AdminLogin  onClose={() => setShowModal(false)} />
      )}
    </Fragment>
  );
}

export default Admin;
