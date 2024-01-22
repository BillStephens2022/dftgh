import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Layout from "@/components/layout";
import "@/styles/globals.css";

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>      
        <Layout>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta property="og:title" content="Drinking From the Garden Hose - The Gen X Podcast" />
            <meta property="og:description" content="Drinking From The Garden Hose Podcast w/Ed Philipp and OB Spencer. 2 guys talking about how it used to be...and now they are cranky old men in training...but they aren't there yet." />
            <meta name="og:keywords" content="Podcast, Podcasts, Drinking From The Garden Hose, Generation X, Ed Philipp, OB, Obadiah Spencer, Top Podcasts, Fun Podcasts, Generation X Podcast" />
            <meta name="google-site-verification" content="qxZwsIkUNeqRkaDbKtWLky2-URdkA2OB5OWYgNk5aE0" />
          </Head>
          <Component {...pageProps} />
        </Layout>     
    </SessionProvider>
  );
}

export default App;
