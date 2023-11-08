import { Fragment } from "react";
import { GoComment } from "react-icons/go";
import { RiBarChart2Fill } from 'react-icons/ri';
import classes from "./testimonials.module.css";

function Testimonials() {
  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Testimonials</h1>
        <div className={classes.container}>
          <div className={classes.wrapper}>
            <div className={classes.banner_image}> </div>
            <h1 className={classes.card_header}>NO MORE POD AND JAM</h1>
            <p className={classes.card_p}>Aired: Oct 20, 2023</p>
            <p className={classes.card_p}>
              OB and Ed discuss how Ed is doing as a single parent 
              this week including once again revisting his daughters laundry
              habits. <br />
             <p>The conversation is interupted by OB's outrage about how Ed does
              his morning bagels. </p>
              <p>After discussing food and chores the subject turns to Rutgers
              Homecoming and the rain. </p>
            </p>
          </div>
          <div className={classes.button_wrapper}>
            <button className={`${classes.btn} ${classes.outline}`}>
            <GoComment size={24} /> Comments
            </button>
            <button className={`${classes.btn} ${classes.fill}`}>
            <RiBarChart2Fill size={24} /> Polls
            </button>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default Testimonials;
