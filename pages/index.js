import Head from "next/head";
import Image from "next/image";
import classes from "./home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Drinking from the Garden Hose</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
      </Head>
      <main className={classes.main}>
        <h1 className={classes.title}>Drinking from the Garden Hose</h1>
        <Image src="/DFTGH.webp" width={600} height={600}></Image>
      </main>
    </>
  );
}
