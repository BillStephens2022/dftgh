import { SessionProvider } from "next-auth/react";
import { EpisodeProvider } from "@/context/EpisodeContext";
import Layout from "/components/layout";
import "@/styles/globals.css";

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <EpisodeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </EpisodeProvider>
    </SessionProvider>
  );
}

export default App;
