import { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import PlayButton from "@/components/buttons/playButton";
import classes from "@/pages/about/about.module.css";

const About = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [audioFiles, setAudioFiles] = useState({});

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== 'undefined') {
      // const edUrinalSoundClip = new Audio("/audio/ed-urinal.m4a");
      const edGirldadSoundClip = new Audio("/audio/ed-girldad.m4a");
      const edSnakeSoundClip = new Audio("/audio/ed-snake.m4a");
      const edSnoreSoundClip = new Audio("/audio/ed-snore.m4a");
      const edTravelSoundClip = new Audio("/audio/ed-travel.m4a");
      const edKingSoundClip = new Audio("/audio/ed-king.m4a");
      const edGiselleSoundClip = new Audio("/audio/ed-giselle.m4a");
      const edSantaSoundClip = new Audio("/audio/ed-santa.m4a");
      // const edToesSoundClip = new Audio("/audio/ed-toes.m4a");
      const obBoyDadSoundClip = new Audio("/audio/OB-boydad.m4a");
      // const obTesticsSoundClip = new Audio("/audio/OB-testics.m4a");
      const obSwordsSoundClip = new Audio("/audio/OB-swords.m4a");
      const obVacationSoundClip = new Audio("/audio/OB-vacation.m4a");
      const obDWMSoundClip = new Audio("/audio/OB-DWM.m4a");
      const obRawdogSoundClip = new Audio("/audio/OB-rawdog.m4a")
      const obBearSoundClip = new Audio("/audio/OB-bear.m4a");
      const obSockieSoundClip = new Audio("/audio/OB-sockie.m4a");
      // const ericSoundClip = new Audio("sounds/eric.m4a");
      setAudioFiles({
        "ed-girldad": { audioFile: edGirldadSoundClip, text: "girl dad" },
        "ed-snake": { audioFile: edSnakeSoundClip, text: "crippling fear of small woodpile snakes" },
        "ed-snore": { audioFile: edSnoreSoundClip, text: "major snoring problem" },
        "ed-travel": { audioFile: edTravelSoundClip, text: "gets anxious before traveling" },
        "ed-king": { audioFile: edKingSoundClip, text: "thinks if you marry a queen you should be a 'king'" },
        "ed-giselle": { audioFile: edGiselleSoundClip, text: "has his own take on Brazilian naming conventions" },
        "ed-santa": { audioFile: edSantaSoundClip, text: "thinks Santa Claus is biblical" },
        "ob-boydad": { audioFile: obBoyDadSoundClip, text: "boy dad" },
        "ob-swords": { audioFile: obSwordsSoundClip, text: "swordfighter (he calls it 'martial arts')" },
        "ob-vacation": { audioFile: obVacationSoundClip, text: "will only travel with 3 out of 4 family members" },
        "ob-dwm": { audioFile: obDWMSoundClip, text: "once mansplained 'dancing with myself'" },
        "ob-rawdog": { audioFile: obRawdogSoundClip, text: "used the term 'rawdogging' on air" },
        "ob-bear": { audioFile: obBearSoundClip, text: "thinks he can take on any bear with a machete" },
        "ob-sockie": { audioFile: obSockieSoundClip, text: "wears 'sockie' type shoes when playing with swords" }
      });
      return () => {
        // Stop and release resources for each Audio instance
        Object.values(audioFiles).forEach((audio) => {
          if (audio.audioFile) {
            audio.audioFile.pause(); // Pause the audio (if it's playing)
            audio.audioFile = null; // Set the audioFile reference to null
          }
        });
        setAudioFiles({}); // Clear the audioFiles state
      };
    }
  }, []); // Run this effect only once on mount


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

  // ...

  const handleListItemClick = (itemId) => {
    const currentAudioFile = audioFiles[itemId].audioFile;

    // Check if the clicked audio is already playing
    if (selectedItem === itemId && currentAudioFile.paused) {
      currentAudioFile.play(); // If paused, resume playing the audio
    } else {
      // Pause the previously playing audio (if any)
      Object.values(audioFiles).forEach((audio) => {
        if (audio.audioFile && !audio.audioFile.paused) {
          audio.audioFile.pause();
        }
      });

      setSelectedItem(itemId); // Set the new selected item

      // Play the clicked audio
      if (currentAudioFile) {
        currentAudioFile.play();
      }
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Drinking From The Garden Hose - About Page</title>
        <meta name="description" content="Drinking From The Garden Hose Podcast Ed Philipp OB Spencer - About Page" />
      </Head>
      <main className={classes.main}>
        <h1 className={classes.title}>Meet the 'Cast</h1>
        <div className={classes.container}>
          <div className={classes.ed_div}>
            <h2 className={classes.subtitle}>Ed</h2>
            <div className={classes.image} style={{ backgroundImage: `url(/images/ed.jpeg)` }}></div>

            <ul className={`${classes.ul} ${classes.ul_ed}`}>
              {filteredEdAudio.map(({ id, text }) => (
                <li key={id} id={id} className={classes.li}><PlayButton text={text} onClick={() => handleListItemClick(id)} /></li>
              ))}

            </ul>
          </div>
          <div className={classes.ob_div}>
            <h2 className={classes.subtitle}>OB</h2>
            <div className={classes.image} style={{ backgroundImage: `url(/images/ob.jpeg)` }}></div>
            <ul className={`${classes.ul} ${classes.ul_ob}`}>
              {filteredObAudio.map(({ id, text }) => (
                <li key={id} id={id} className={classes.li}><PlayButton text={text} onClick={() => handleListItemClick(id)} /></li>
              ))}

            </ul>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default About;
