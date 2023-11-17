import { Fragment, useState } from "react";
import audioFiles from "@/components/lib/audio/audio";
import classes from "./about.module.css";

const About = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const imageStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
  };

  // filters out only Ed's audio files
  const filteredEdAudio = Object.entries(audioFiles)
    .filter(([key]) => key.startsWith("ed-"))
    .map(([key, value]) => ({ id: key, text: value.text }));

  // filters out only Ed's audio files
  const filteredObAudio = Object.entries(audioFiles)
    .filter(([key]) => key.startsWith("ob-"))
    .map(([key, value]) => ({ id: key, text: value.text }));

  const handleListItemClick = (itemId) => {
    setSelectedItem(itemId);
    const audioFile = audioFiles[itemId].audioFile;
    if (audioFile) {
      audioFile.play();
    }
  };

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Meet the 'Cast</h1>
        <div className={classes.container}>
          <div className={classes.ed_div}>
            <h2 className={classes.subtitle}>Ed</h2>
            <div className={classes.image} style={{ backgroundImage: `url(/images/ed.jpeg)` }}></div>
            
            <ul className={`${classes.ul} ${classes.ul_ed}`}>
              {filteredEdAudio.map(({ id, text }) => (
                <li key={id} id={id} className={classes.li} onClick={() => handleListItemClick(id)}>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className={classes.ob_div}>
            <h2 className={classes.subtitle}>OB</h2>
            <div className={classes.image} style={{ backgroundImage: `url(/images/ob.jpeg)` }}></div>
            <ul className={`${classes.ul} ${classes.ul_ob}`}>
              {filteredObAudio.map(({ id, text }) => (
                <li key={id} id={id} className={classes.li} onClick={() => handleListItemClick(id)}>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default About;
