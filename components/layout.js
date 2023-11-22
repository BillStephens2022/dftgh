import { Fragment } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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