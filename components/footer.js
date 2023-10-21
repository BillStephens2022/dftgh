import Link from "next/link";
import classes from "./footer.module.css";

function Footer() {
  return (
    <div className={classes.footer}>
      <Link href="/admin"><div className={classes.circle}></div></Link>
      <h2>Copyright © 2023 Bill Stephens. All Rights Reserved</h2>
    </div>
  );
}

export default Footer;
