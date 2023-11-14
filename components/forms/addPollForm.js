import React, { useState } from "react";
import Button from "../buttons/button";
import classes from "./addPollForm.module.css";

const initialPollFormData = {
  question: "",
  options: ["", "", "", ""],
};

const AddPollForm = ({ onSubmit, onSubmitSuccess }) => {
  const [pollFormData, setPollFormData] = useState(initialPollFormData);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuestionChange = (e) => {
    setPollFormData((prevState) => ({
      ...prevState,
      question: e.target.value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setPollFormData((prevState) => {
      const newOptions = [...prevState.options];
      newOptions[index] = value;
      return {
        ...prevState,
        options: newOptions,
      };
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    
    // Check if there are at least 2 non-empty options
    const filteredOptions = pollFormData.options.filter((option) => option.trim() !== "");
    if (filteredOptions.length < 2) {
      setErrorMessage("Must provide at least 2 options");
      return;
    }

    // Construct the final pollFormData object with filtered options
    const finalPollFormData = {
      question: pollFormData.question,
      options: filteredOptions,
    };

    // Submit the form data
    onSubmit(finalPollFormData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className={classes.question_div}>
        <label>Question:</label>
        <textarea
          className={classes.question_input}
          value={pollFormData.question}
          onChange={handleQuestionChange}
          rows={5}
          required
        />
      </div>

      <br />
      <div className={classes.options_div}>
        {pollFormData.options.map((option, index) => (
          <div key={index} className={classes.option_div}>
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
      <Button type="submit" text="Create Poll" backgroundColor="steelblue" />
      <div className={classes.error_div}>
        {errorMessage && { errorMessage }}
      </div>
    </form>
  );
};

export default AddPollForm;
