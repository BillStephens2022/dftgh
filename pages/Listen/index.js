import { Fragment } from "react";
import classes from "./listen.module.css";

function Listen() {
  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Listen</h1>
        <div>
        <iframe
          id="embedPlayer"
          src="https://embed.podcasts.apple.com/us/podcast/drinking-from-the-garden-hose/id1572514520?itsct=podcast_box_player&amp;itscg=30200&amp;ls=1&amp;theme=auto"
          height="450px"
          frameBorder="0"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="autoplay *; encrypted-media *; clipboard-write"
          style={{
              width: "100%",
              maxWidth: "660px",
              overflow: "hidden",
              borderRadius: "10px",
              transform: "translateZ(0px)",
              animation: "2s ease 0s 6 normal none running loading-indicator",
              backgroundColor: "rgb(228, 228, 228)"
            }}
        ></iframe>
        </div>
      </main>
    </Fragment>
  );
}

export default Listen;
