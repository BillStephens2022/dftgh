import Link from "next/link";
import classes from "./navbar.module.css";
import Image from "next/image";
import { Fragment } from "react";

function Navbar() {
  const imageStyle = {
    borderRadius: "50%",
  };

  return (
    <Fragment>
      <nav className={classes.navbar}>
        <div className={classes.container}>
          <div className={classes.image}>
            <Link href="/">
              <Image
                src="/DFTGH.webp"
                alt="logo"
                height={50}
                width={50}
                style={imageStyle}
              />
            </Link>
          </div>

          <ul className={classes.nav_items}>
            <li className={classes.nav_item}>
              <Link href="/bios">Bios</Link>
            </li>
            <li className={classes.nav_item}>
              <Link href="/episodes">Episodes</Link>
            </li>
            <li className={classes.nav_item}>
              <Link href="/listen">Listen</Link>
            </li>
            <li className={classes.nav_item}>
              <Link href="/testimonials">Testimonials</Link>
            </li>
            <li className={classes.nav_item}>
              <Link href="/feedback">Feedback</Link>
            </li>
          </ul>
        </div>
      </nav>
    </Fragment>
  );
}

export default Navbar;
