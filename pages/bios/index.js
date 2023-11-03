import { Fragment } from "react";
import Image from "next/image";
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
          <div>
            <h2 className={classes.subtitle}>Meet Ed</h2>
            <Image
              src="/images/ed.jpeg"
              width={300}
              height={300}
              alt="Photo of Ed"
              style={imageStyle}
            />
          </div>
          <div>
            <h2 className={classes.subtitle}>Meet Ob</h2>
            <Image
              src="/images/ob.jpeg"
              width={300}
              height={300}
              alt="Photo of OB"
              style={imageStyle}
            />
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default Bios;
