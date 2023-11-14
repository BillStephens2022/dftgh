//  /api/episodes/[episodeId]/polls
//  used for posting a new poll on a specific episode, and
//  getting all polls for a specific episode

import dbConnect from "@/components/lib/db";
import Episode from "@/models/Episode";
import Poll from "@/models/Poll";

const handler = async (req, res) => {
  console.log("POST POLL ROUTE HIT!");
  await dbConnect();
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  const { episodeId } = req.query;

  // Post new comments on an episode
  if (req.method === "POST") {
    try {
      console.log("POST POLL ROUTE HIT!");
      const { question, options } = req.body;

      const existingEpisode = await Episode.findById(episodeId);

      if (!existingEpisode) {
        return res.status(404).json({ error: "Episode not found" });
      }

      // Create a new poll
      const newPoll = new Poll({
        episodeId: existingEpisode._id,
        question,
        options,
      });

      // Save the new poll to the database
      await newPoll.save();

      // Add the comment reference to the episode's polls array
      existingEpisode.polls.push(newPoll._id);
      await existingEpisode.save();

      res.status(201).json(newPoll);
    } catch (error) {
      console.error("Error adding poll:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  // fetch all polls for a specific episode
  } else if (req.method === "GET") {
    try {
      if (episodeId) {
        // Fetch comments by episodeId
        const polls = await Poll.find({ episodeId: episodeId });
        res.status(200).json(polls);
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
      res.status(400).json({ error: "No episode Id provided." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;