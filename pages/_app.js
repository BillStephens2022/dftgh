import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Layout from "@/components/layout";
import "@/styles/globals.css";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Head>
          <title>Drinking from the Garden Hose</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta
            name="description"
            content="Drinking From The Garden Hose podcast w/Ed Philipp and OB Spencer. 2 guys talking about how it used to be...and now they are cranky old men in training...but they aren't there yet."
          />
          <meta
            name="keywords"
            content="Podcast, Podcasts, Drinking From The Garden Hose, Generation X, Ed Philipp, OB, OB Spencer, Top Podcasts, Fun Podcasts, Generation X Podcast"
          />
          <meta
            property="og:description"
            content="Drinking From The Garden Hose podcast w/Ed Philipp and OB Spencer. 2 guys talking about how it used to be...and now they are cranky old men in training...but they aren't there yet."
          />
          <meta
            name="og:keywords"
            content="Podcast, Podcasts, Drinking From The Garden Hose, Generation X, Ed Philipp, OB, OB Spencer, Top Podcasts, Fun Podcasts, Generation X Podcast"
          />
          <meta
            property="og:image"
            content="https://billstephens2022.github.io/my_portfolio/images/dftgh1.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Drinking From The Garden Hose - The Podcast"
          />
          <meta
            name="twitter:description"
            content="Drinking From The Garden Hose podcast w/Ed Philipp and OB Spencer. 2 guys talking about how it used to be...and now they are cranky old men in training...but they aren't there yet."
          />
          <meta
            name="twitter:image"
            content="https://billstephens2022.github.io/my_portfolio/images/dftgh1.png"
          />
          <meta
            name="google-site-verification"
            content="qxZwsIkUNeqRkaDbKtWLky2-URdkA2OB5OWYgNk5aE0"
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default App;
