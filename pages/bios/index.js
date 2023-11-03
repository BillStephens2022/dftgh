import { Fragment } from "react";
import Image from "next/image";
import audioFiles from "@/components/lib/audio/audio";
import classes from "./bios.module.css";

function Bios() {
  const imageStyle = {
    borderRadius: "50%",
    border: "1px solid #fff",
  };

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Bios</h1>
        <div className={classes.container}>
          <div className={classes.ed_div}>
            <h2 className={classes.subtitle}>Meet Ed ("Roadkill")</h2>
            <Image
              src="/images/ed.jpeg"
              width={300}
              height={300}
              alt="Photo of Ed"
              style={imageStyle}
            />
            <p id="ed-girldad">
              <span id="pink">girl</span> dad
            </p>
            <p id="ed-snake">crippling fear of small woodpile snakes</p>
            <p id="ed-snore">major snoring problem</p>
            <p id="ed-travel">gets anxious before traveling</p>
            <p id="ed-king">
              thinks if you marry a queen you should be a "king"
            </p>
            <p id="ed-giselle">
              has his own take on Brazilian naming conventions
            </p>
            <p id="ed-santa">thinks Santa Claus is biblical</p>
          </div>
          <div className={classes.ob_div}>
            <h2 className={classes.subtitle}>Meet OB ("Flounder")</h2>
            <Image
              src="/images/ob.jpeg"
              width={300}
              height={300}
              alt="Photo of OB"
              style={imageStyle}
            />
            <p id="ob-boydad">
              <span id="blue">boy</span> dad
            </p>
            <p id="ob-swords">swordfighter (he calls it "martial arts")</p>
            <p id="ob-vacation">
              will only travel with 3 out of 4 family members
            </p>
            <p id="ob-dwm">once mansplained "dancing with myself"</p>
            <p id="ob-rawdog">used the term "rawdogging" on air</p>
            <p id="ob-bear">thinks he can take on any bear with a machete</p>
            <p id="ob-sockie">
              wears "sockie" type shoes when playing with swords
            </p>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default Bios;
