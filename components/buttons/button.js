import { Fragment } from "react";
import { useRouter } from 'next/router';
import classes from "@/components/buttons/button.module.css";

const Button = ({ text, onClick, type, href, backgroundColor = "", backgroundImage = "linear-gradient(135deg, #184e68 0%, #57ca85 100%)", color = "white", icon, children, margin = "0" }) => {
  const router = useRouter();

  const buttonStyle = {
    backgroundColor: backgroundColor ? backgroundColor : "none",
    backgroundImage: backgroundColor ? "none" : backgroundImage,
    color: color,
    margin: margin
  };

  const handleClick = () => {
    if (href) {
      console.log("button pressed, navigating to: ", href);
      router.push(href); // if there is an href prop passed in, use router.push to navigate to the specified href
    } else if (onClick) {  // otherwise use the onClick prop to determine what the button will do
      onClick();
    }
  };

  return (
    <Fragment>
      <button className={classes.btn} onClick={handleClick} type={type} style={buttonStyle}>{text}</button>
    </Fragment>
  );
}

export default Button;
