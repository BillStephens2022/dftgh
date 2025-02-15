// /api/episodes
// route used for adding new episodes, getting all episodes
import { getServerSession } from "next-auth/next";

import Episode from "@/models/Episode";
import dbConnect from "@/components/lib/db";


const handler = async (req, res) => {

  await dbConnect();
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  // Add a new Episode
  if (req.method === "POST") {
    
    const session = await getServerSession(req, res);

    if (!session) {
      res.status(401).json({ message: "Not Authenticated to Add an Episode!" });
      return;
    }
    const { title, description, imageLink, dateAired } = req.body;

    try {
      const newEpisode = new Episode({
        title,
        description,
        imageLink,
        dateAired: new Date(dateAired),
      });

      await newEpisode.save();
      res.status(201).json({ message: "Episode added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }

    // Fetch all episodes
  } else if (req.method === "GET") {
    try {
      const episodes = await Episode.find({});
      res.status(200).json(episodes);
    } catch (error) {
      console.error("Error fetching episodes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;