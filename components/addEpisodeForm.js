import { Fragment, useState } from "react";
import Button from "./button";
import classes from "./addEpisodeForm.module.css";

const initialFormData = {
  title: "",
  description: "",
  dateAired: "",
  imageUrl: "",
};

function AddEpisodeForm() {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/episodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Episode added successfully");
        setFormData(initialFormData);
      } else {
        console.error("Error adding episode:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding episode:", error);
    }
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
              value={formData.title}
              onChange={handleInputChange}
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
              value={formData.description}
              onChange={handleInputChange}
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
              value={formData.dateAired}
              onChange={handleInputChange}
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
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit" onClick={handleSubmit} text="Submit"></Button>
        </form>
      </div>
    </Fragment>
  );
}

export default AddEpisodeForm;
