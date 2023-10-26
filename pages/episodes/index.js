import { Fragment, useEffect } from "react";
import { useSession } from "next-auth/react";

import Button from "@/components/button";
import classes from "./episodes.module.css";


function Episodes() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      console.log(session);
    }
  }, [session]);
  
  const episodes = [
    {
      id: 1,
      title: "No More Pod and Jam",
      description: "2 cranky old men arguing about bagels",
      air_date: "2023-10-20",
      image_url:
        "https://images.unsplash.com/photo-1627308595260-6fad84c40413?auto=format&fit=crop&q=80&w=1935&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Pod 309",
      description: "Podding Around",
      air_date: "2023-10-06",
      image_url:
        "https://cdn.britannica.com/40/75640-050-F894DD85/tiger-Siberian.jpg",
    },
  ];

  return (
    <Fragment>
      <main className={classes.main}>
        <h1 className={classes.title}>Episodes</h1>
        {session && (<Button text="Add Episode" backgroundColor="steelblue" color="white" />)}
        <div className={classes.episodes_div}>
          {episodes.map((episode) => (
            <div className={classes.card} key={episode.id}>
            <div className={classes.image_div}>
                <img
                  src={episode.image_url}
                  alt={episode.title}
                  className={classes.image}
                ></img>
              </div>
              <div className={classes.episode_details}>
              <h3 className={classes.episode_detail}>{episode.title}</h3>
              <h4 className={classes.episode_detail}>Aired: {episode.air_date}</h4>
              <p className={classes.episode_detail}>{episode.description}</p>
              {session && (
                <div>
                  <Button text="Delete"></Button>
         
                </div>
              )}
              </div>
              
            </div>
          ))}
        </div>
      </main>
    </Fragment>
  );
}

export default Episodes;
