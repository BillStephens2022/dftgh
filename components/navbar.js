import Link from "next/link";
import classes from "./navbar.module.css";
import Image from "next/image";

function Navbar() {
  return (
    
    
    <nav className={classes.navbar}>
      <ul className={classes.nav_items}>
        <li className={classes.nav_item}>Listen</li>
        <li className={classes.nav_item}>Bios</li>
        <li className={classes.nav_item}>Testimonials</li>
        <li className={classes.nav_item}>Feedback</li>
      </ul>
    </nav>
   
  );
}

export default Navbar;
