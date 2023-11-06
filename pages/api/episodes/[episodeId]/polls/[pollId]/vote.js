// /api/episodes/[episodeId]/polls/[pollId]/vote

import dbConnect from "@/components/lib/db";
import Poll from "@/models/Poll";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { pollId } = req.query;
    const { optionIndex } = req.body;

    try {
      const poll = await Poll.findById(pollId);

      if (!poll) {
        return res.status(404).json({ error: "Poll not found" });
      }

      // Increment the vote count for the selected option
      poll.options[optionIndex].votes += 1;

      // Save the updated poll to the database
      await poll.save();

      res.status(200).json(poll);
    } catch (error) {
      console.error("Error voting on poll:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}