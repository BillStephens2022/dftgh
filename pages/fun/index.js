import { Fragment, useEffect, useState } from "react";

import classes from "./fun.module.css";


const Fun = () => {
    const [facts, setFacts] = useState();
    useEffect(() => {
      // Call getDate here, inside useEffect
      getDate();
    }, []); // Empty dependency array to ensure useEffect runs once on mount



  const getDate = async() => {
    const apiUrl = ("https://opentdb.com/api.php?amount=10&category=12&type=multiple");

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      setFacts(data.results);
      console.log("data fetched: ", facts);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Fun</h1>
        {facts.map((question, index) => (
          <div key={index}>
          <p className={classes.question}  dangerouslySetInnerHTML={{ __html: question.question }}></p>
          <ul>
            {question.incorrect_answers.map((incorrect_answer, index) => (
              <li key={index} className={classes.answers} dangerouslySetInnerHTML={{ __html: question.incorrect_answer }}></li>
            ))}
          </ul>
          </div>
        ))}
        
      </main>
    </Fragment>
  );

}

export default Fun;
