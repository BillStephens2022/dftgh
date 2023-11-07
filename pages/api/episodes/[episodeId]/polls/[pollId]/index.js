
// /api/episodes/[episodeId]/polls/[pollId]
// route used for deleting an existing poll under a specific episode

import dbConnect from "@/components/lib/db";
import Episode from "@/models/Episode";
import Poll from "@/models/Poll";

export default async function handler(req, res) {
  await dbConnect();
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  console.log(req.query);
  const { episodeId, pollId } = req.query;
  
  // delete a poll under a specific episode
  if (req.method === "DELETE") {
    console.log("DELETE POLL ROUTE HIT!!");
    console.log("episode: ", episodeId, "poll: ", pollId);
    try {
      const existingEpisode = await Episode.findById(episodeId);

      if (!existingEpisode) {
        return res.status(404).json({ error: "Episode not found" });
      }

      // Remove the poll from the episode's polls array
      existingEpisode.polls = existingEpisode.polls.filter(
        (poll) => poll.toString() !== pollId
      );

      // Delete the poll from the database
      await Poll.findByIdAndDelete(pollId);

      // Save the episode without the deleted poll
      await existingEpisode.save();

      res.status(200).json({ message: "Poll deleted successfully" });
    } catch (error) {
      console.error("Error deleting poll:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
