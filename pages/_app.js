import { SessionProvider } from "next-auth/react";
import { EpisodeProvider } from "@/context/EpisodeContext";
import Layout from "/components/layout";
import "@/styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
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
