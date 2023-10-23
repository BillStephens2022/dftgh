import { Fragment, useRef } from "react";
import Button from "./button";
import classes from "./addEpisodeForm.module.css";

function AddEpisodeForm() {
    const titleInputRef = useRef();
    const descriptionInputRef = useRef();
    const dateInputRef = useRef();
    const urlInputRef = useRef();
    

    function handleSubmit() {
        console.log("Adding Episode!");
    }

    return (
        <Fragment>
          <h2 className={classes.form_header}>Add an Episode</h2>
          <div className={classes.form_container}>
            <form className={classes.form} onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title" className={classes.label}>
                  Episode Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Episode Title"
                  className={classes.input}
                  id="title"
                  ref={titleInputRef}
                />
              </div>
              <div>
                <label htmlFor="description" className={classes.label}>
                  Episode Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Episode Description"
                  className={classes.input}
                  id="description"
                  ref={descriptionInputRef}
                />
              </div>
              <div>
                <label htmlFor="date" className={classes.label}>
                  Episode Air Date
                </label>
                <input
                  type="date"
                  name="date"
                  placeholder="Episode Air Date"
                  className={classes.input}
                  id="date"
                  ref={dateInputRef}
                />
              </div>
              <div>
                <label htmlFor="url" className={classes.label}>
                  Episode Image URL
                </label>
                <input
                  type="text"
                  name="url"
                  placeholder="Episode Image URL"
                  className={classes.input}
                  id="url"
                  ref={urlInputRef}
                />
              </div>
              <Button type="button" onClick={handleSubmit} text="Submit"></Button>
            </form>
          </div>
        </Fragment>
      );
    }
    
    export default AddEpisodeForm;
