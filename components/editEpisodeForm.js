import { Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./button";
import classes from "./addEpisodeForm.module.css";



function EditEpisodeForm({ onSubmit, onSubmitSuccess }) {
  //const { setEpisodes } = useEpisodeContext();
  const [formData, setFormData] = useState({
    title: episode.title,
    description: episode.description,
    dateAired: new Date(episode.dateAired), // Parse the stored date string to a Date object
    imageLink: episode.imageLink,
  });

    // Update formData whenever episode prop changes
    useEffect(() => {
        setFormData({
          title: episode.title,
          description: episode.description,
          dateAired: new Date(episode.dateAired),
          imageLink: episode.imageLink,
        });
      }, [episode]);
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    // Convert the selected date to a string in the desired format (ISO string)
    const formattedDate = date.toISOString();
    setFormData((prevData) => ({
      ...prevData,
      dateAired: formattedDate, // Update dateAired in formData with the formatted date string
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <Fragment>
      <h2 className={classes.form_header}>Edit Episode</h2>
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
            <label htmlFor="imageLink" className={classes.label}>
              Episode Image URL
            </label>
            <input
              type="text"
              name="imageLink"
              placeholder="Episode Image URL"
              className={classes.input}
              id="imageLink"
              value={formData.imageLink}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date" className={classes.label}>
              Episode Air Date
            </label>
            <DatePicker
              className={classes.input}
              id="date"
              placeholderText={"Episode Air Date"}
              selected={
                formData.dateAired ? new Date(formData.dateAired) : null
              } // Parse the stored date string to a Date object for the DatePicker component
              onChange={(date) => handleDateChange(date)}
            />
          </div>

          <Button type="submit" onClick={handleSubmit} text="Submit"></Button>
        </form>
      </div>
    </Fragment>
  );
}

export default EditEpisodeForm;