import React, { useState, useEffect } from "react";
import xml2js from "xml2js";
import { getEpisodes } from "@/components/lib/api";
import { formatDate, isSameDate } from "@/components/lib/utils";
import Button from "@/components/buttons/button";
import classes from "@/components/rssFeed.module.css";

const RssFeed = ({
  podcastUrl,
  handlePushEpisodeClick,
  selectedEpisode,
  setSelectedEpisode,
  fetchedEpisodes,
  setFetchedEpisodes,
}) => {
  const [episodes, setEpisodes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [displayCount, setDisplayCount] = useState(5);

  const loadMoreEpisodes = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  const cleanDescription = (description) => {
    // Replace all occurrences of <p> and </p> with an empty string
    return description.replace(/<\/?p>/g, "");
  };

  // Fetch episodes from MongoDB
  useEffect(() => {
    const fetchEpisodesFromDB = async () => {
      try {
        const episodesFromDB = await getEpisodes();
        setFetchedEpisodes(episodesFromDB);
      } catch (error) {
        console.error("Error fetching episodes from the database:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodesFromDB();
  }, []);

  useEffect(() => {
    const fetchPodcastEpisodes = async () => {
      try {
        const response = await fetch(podcastUrl);
        const xmlText = await response.text();

        const parser = new xml2js.Parser();
        parser.parseString(xmlText, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }

          if (
            result &&
            result.rss &&
            result.rss.channel &&
            result.rss.channel[0] &&
            result.rss.channel[0].item
          ) {
            const parsedEpisodes = result.rss.channel[0].item.map((item) => ({
              title: item.title[0],
              description: cleanDescription(item.description[0]),
              pubDate: item.pubDate[0],
            }));
            setEpisodes(parsedEpisodes);
          }
        });
      } catch (error) {
        console.error("Error fetching podcast episodes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (podcastUrl) {
      fetchPodcastEpisodes();
    }
  }, [podcastUrl]);

  // Reconciliation of episodes in mongoDB vs what is in the RSS feed, so user can see which episodes have been pushed to the DB (and Episodes page)
  const isEpisodePushed = (episode) => {
    return fetchedEpisodes.some(
      (dbEpisode) =>
        dbEpisode.title.toLowerCase() === episode.title.toLowerCase() &&
        isSameDate(dbEpisode.dateAired, episode.pubDate)
    );
  };

  if (loading) {
    return <p>Loading...</p>; // Render a loading indicator while fetching data
  }

  return (
    <div className={classes.rss_feed}>
      <h2 className={classes.rss_feed_header}>Episode Status Table</h2>
      <div className={classes.rss_feed_instructions_div}>
        <p className={classes.rss_feed_instructions}>
          Pressing the "Push" button will push the episode to the Episodes page
          and you will be prompted to add a photo of your choice.
        </p>
        <p className={classes.rss_feed_instructions}>
          By pushing the episode, this will allow listeners to add comments and
          vote in any polls you add to episode.
        </p>
      </div>
      <p className={classes.rss_feed_table_note}>From Libsyn RSS Feed (Last 5):</p>
      <table className={classes.rss_feed_table}>
        <thead>
          <tr>
            <th className={classes.rss_feed_table_col_header}>
              Date Published
            </th>
            <th className={classes.rss_feed_table_col_header}>Title</th>
            <th className={classes.rss_feed_table_col_header}>Push Status</th>
          </tr>
        </thead>
        <tbody>
          {episodes.slice(0, displayCount).map((episode, index) => (
            <tr className={classes.rss_feed_table_row} key={index}>
              <td className={classes.rss_feed_table_data}>
                {formatDate(new Date(episode.pubDate).toLocaleString())}
              </td>
              <td className={classes.rss_feed_table_data}>{episode.title}</td>
              <td className={classes.rss_feed_table_data}>
                {isEpisodePushed(episode) ? (
                  <span role="img" aria-label="Checkmark">
                    ✅ Pushed
                  </span>
                ) : (
                  <Button
                    text="Push"
                    onClick={() => handlePushEpisodeClick(episode)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
        {displayCount < episodes.length && (
          <tfoot>
          <tr>
            <td colSpan="3" className={classes.show_more_button_td}>
              <button
                onClick={loadMoreEpisodes}
                className={classes.button_show_more}
              >
                Show More
              </button>
            </td>
          </tr>
        </tfoot>
        )}
      </table>
    </div>
  );
};

export default RssFeed;
