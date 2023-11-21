import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import classes from "./fun.module.css";


const Fun = () => {


  return (
    <Fragment>
      <Head>
        <title>Drinking From The Garden Hose - Fun Page</title>
        <meta name="description" content="Drinking From The Garden Hose Podcast Ed Philipp OB Spencer - Fun Page" />
      </Head>
      <main className={classes.main}>
        <h1 className={classes.title}>Fun</h1>
      </main>
    </Fragment>
  );

}

export default Fun;
