import React, { useState } from "react";
import classes from "./addPollForm.module.css";

const AddPollForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("adding a new poll!");
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className={classes.question_div}>
        <label>Question:</label>
        <textArea
          className={classes.question_input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={5}
          required
        />
      </div>

      <br />
      <div className={classes.options_div}>
      {options.map((option, index) => (
        <div key={index} className={classes.option_div} >
          <label className={classes.option_label}>Option {index + 1}:</label>
          <input
            className={classes.option_input}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required={index < 2}
          />
          <br />
        </div>
      ))}
      </div>
      <button type="submit">Create Poll</button>
    </form>
  );
};

export default AddPollForm;
