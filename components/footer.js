import Link from "next/link";
import { GoPasskeyFill } from "react-icons/go";
import classes from "@/components/footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className={classes.footer}>
      <Link href="/admin"><div className={classes.login_icon}><GoPasskeyFill fill="white" size="16px" /></div></Link>
      <p className={classes.text}>Copyright © {currentYear}, <Link className={classes.link} href="https://billstephens2022.github.io/my_portfolio/">Bill Stephens</Link>. All Rights Reserved.</p>
    </div>
  );
}

export default Footer;
