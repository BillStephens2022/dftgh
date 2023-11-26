import React, { useState, useEffect } from 'react';
import xml2js from 'xml2js';
import { getEpisodes } from '@/components/lib/api';
import { formatDate, isSameDate } from '@/components/lib/dates';
import Button from '@/components/buttons/button';
import classes from "@/components/rssFeed.module.css";

const RssFeed = ({ podcastUrl, handlePushEpisodeClick, selectedEpisode, setSelectedEpisode }) => {
    const [episodes, setEpisodes] = useState([]);
    const [fetchedEpisodes, setFetchedEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);

    const cleanDescription = (description) => {
        // Replace all occurrences of <p> and </p> with an empty string
        return description.replace(/<\/?p>/g, '');
    };

    // Fetch episodes from MongoDB
    useEffect(() => {
        const fetchEpisodesFromDB = async () => {
            try {
                const episodesFromDB = await getEpisodes();
                setFetchedEpisodes(episodesFromDB);
            } catch (error) {
                console.error('Error fetching episodes from the database:', error);
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
                        console.error('Error parsing XML:', err);
                        return;
                    }

                    if (result && result.rss && result.rss.channel && result.rss.channel[0] && result.rss.channel[0].item) {
                        const parsedEpisodes = result.rss.channel[0].item.map((item) => ({
                            title: item.title[0],
                            description: cleanDescription(item.description[0]),
                            pubDate: item.pubDate[0],
                        }));
                        setEpisodes(parsedEpisodes);
                    }
                });
            } catch (error) {
                console.error('Error fetching podcast episodes:', error);
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
            <h1 className={classes.rss_feed_header}>Podcast Episodes</h1>
            <table className={classes.rss_feed_table}>
                <thead>
                    <tr>
                        <th className={classes.rss_feed_table_col_header}>Date Published</th>
                        <th className={classes.rss_feed_table_col_header}>Title</th>
                        <th className={classes.rss_feed_table_col_header}>Push Status</th>
                    </tr>
                </thead>
                <tbody>
                    {episodes.map((episode, index) => (
                        <tr className={classes.rss_feed_table_row} key={index}>
                            <td className={classes.rss_feed_table_data}>{formatDate(new Date(episode.pubDate).toLocaleString())}</td>
                            <td className={classes.rss_feed_table_data}>{episode.title}</td>
                            <td className={classes.rss_feed_table_data}>
                                {isEpisodePushed(episode) ? (
                                    <span role="img" aria-label="Checkmark">
                                        ✅ Pushed
                                    </span>
                                ) : (
                                    <Button text="Push to Episodes Page" onClick={() => handlePushEpisodeClick(episode)} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RssFeed;
