import { Fragment } from "react";
import Button from "../../components/button";
import classes from "./admin.module.css";

function Admin() {
  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.header}>Admin Page</h1>
        <div className={classes.button_div}>
          <Button text="Admin Login"></Button>
          <Button text="Add Episode"></Button>
        </div>
      </main>
    </Fragment>
  );
}

export default Admin;
