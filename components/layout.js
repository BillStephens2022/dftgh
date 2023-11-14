import { Fragment } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const Layout = (props) => {
  
    return (
      <Fragment>
        <Navbar />
        <main>{props.children}</main>
        <Footer />
      </Fragment>
    );
  }
  
  export default Layout;