import { Fragment, useState } from "react";
import classes from "./feedback.module.css";
import Button from "@/components/button";


const initialFormData = {
  name: "",
  feedback: "",
  public: false
};

function Feedback() {

  const [formData, setFormData] = useState(initialFormData);
  

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("feedback provided!");
    console.log(formData);
    setFormData(initialFormData);
  }

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Feedback</h1>
        <div className={classes.form_div}>
          <form className={classes.form} onSubmit={handleFormSubmit}>
            <div className={classes.form_group}>
              <label htmlFor="name" className={classes.form_label}>Name</label>
              <input name="name" placeholder="Your name" value={formData.name} onChange={handleInputChange} className={classes.form_input} type="text" />
            </div>
            <div className={classes.form_group}>
              <label htmlFor="feedback" className={classes.form_label}>Feedback</label>
              <textarea name="feedback" placeholder="Your feedback..." value={formData.feedback} onChange={handleInputChange}className={classes.form_textarea} type="text" rows={10} />
            </div>
            <div className={classes.form_group}>
              <label htmlFor="public" className={classes.form_label}>Post Publicly?</label>
              <input name="public" value={formData.public} onChange={handleInputChange} className={classes.checkbox} type="checkbox" />
            </div>
            <div>
              <Button text="Submit" />
            </div>
          </form>
        </div>
      </main>
    </Fragment>
  );
}

export default Feedback;
