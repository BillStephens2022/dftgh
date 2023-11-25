import React, { useState, useEffect } from 'react';
import xml2js from 'xml2js';
import { formatDate } from './lib/format';
import Button from './buttons/button';
import classes from "@/components/rssFeed.module.css";




const RssFeed = ({ podcastUrl }) => {
    const [episodes, setEpisodes] = useState([]);

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
                            description: item.description[0],
                            pubDate: item.pubDate[0],
                        }));
                        setEpisodes(parsedEpisodes);
                    }
                });
            } catch (error) {
                console.error('Error fetching podcast episodes:', error);
            }
        };

        if (podcastUrl) {
            fetchPodcastEpisodes();
        }
    }, [podcastUrl]);

    return (
        <div className={classes.rss_feed}>
            <h1 className={classes.rss_feed_header}>Podcast Episodes</h1>
            <table className={classes.rss_feed_table}>
                <thead>
                    <tr>
                        <th className={classes.rss_feed_table_col_header}>Date Published</th>
                        <th className={classes.rss_feed_table_col_header}>Title</th>
                        <th className={classes.rss_feed_table_col_header}>Push to "Episodes" page</th>
                    </tr>
                </thead>
                <tbody>
                    {episodes.map((episode, index) => (
                        <tr className={classes.rss_feed_table_row} key={index}>
                            <td className={classes.rss_feed_table_data}>{formatDate(new Date(episode.pubDate).toLocaleString())}</td>
                            <td className={classes.rss_feed_table_data}>{episode.title}</td>
                            <td className={classes.rss_feed_table_data}>
                                <Button text="Push to Episodes Page" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RssFeed;
