import React, { useState } from 'react';

const AddPollForm = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);

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
      <label>
        Question:
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
      </label>
      <br />
      {options.map((option, index) => (
        <div key={index}>
          <label>
            Option {index + 1}:
            <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required={index < 2} />
          </label>
          <br />
        </div>
      ))}
      <button type="submit">Create Poll</button>
    </form>
  );
};

export default AddPollForm;
