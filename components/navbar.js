import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Button from "./button";
import classes from "./navbar.module.css";

function Navbar() {
  const { data: session } = useSession();
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();

  const handleLinkClick = () => {
    setIsChecked(false);
  };

  function logoutHandler() {
    signOut();
  }

  // const imageStyle = {
  //   borderRadius: "50%",
  // };

  return (
    <Fragment>
      {/* <div className={classes.image}>
        <Link href="/">
          <Image src="/images/DFTGH.webp" alt="logo" height={100} width={100} />
        </Link>
      </div> */}
      <div className={classes.navbar}>
        <input
          type="checkbox"
          className={classes.nav_checkbox}
          id="navi-toggle"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <label htmlFor="navi-toggle" className={classes.nav_button}>
          <span className={classes.nav_icon}>&nbsp;</span>
        </label>
        <div className={classes.nav_background}></div>
        <nav className={classes.navbar_nav}>
          <ul className={classes.nav_items}>
          <li className={classes.nav_item}>
              <Link
                href="/"
                className={`${classes.nav_item} ${classes.nav_link} ${
                  router.pathname === "/" ? classes.active : ""
                }`}
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <li className={classes.nav_item}>
              <Link
                href="/bios"
                className={`${classes.nav_item} ${classes.nav_link} ${
                  router.pathname === "/bios" ? classes.active : ""
                }`}
                onClick={handleLinkClick}
              >
                Bios
              </Link>
            </li>
            <li className={classes.nav_item}>
              <Link
                href="/episodes"
                className={`${classes.nav_item} ${classes.nav_link} ${
                  router.pathname === "/episodes" ? classes.active : ""
                }`}
                onClick={handleLinkClick}
              >
                Episodes
              </Link>
            </li>
            <li className={classes.nav_item}>
              <Link
                href="/testimonials"
                className={`${classes.nav_item} ${classes.nav_link} ${
                  router.pathname === "/testimonials" ? classes.active : ""
                }`}
                onClick={handleLinkClick}
              >
                Testimonials
              </Link>
            </li>
            <li className={classes.nav_item}>
              <Link
                href="/feedback"
                className={`${classes.nav_item} ${classes.nav_link} ${
                  router.pathname === "/feedback" ? classes.active : ""
                }`}
                onClick={handleLinkClick}
              >
                Feedback
              </Link>
            </li>
            {session && (
              <div className={classes.nav_items}>
                <Button
                  text="Log Out"
                  backgroundColor="red"
                  onClick={logoutHandler}
                ></Button>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </Fragment>
  );
}

export default Navbar;
