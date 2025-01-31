// /api/comments
// route used for getting all comments

import Comment from "@/models/Comment";
import dbConnect from "@/components/lib/db";


const handler = async (req, res) => {

  await dbConnect();
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  // fetch all comments
  if (req.method === "GET") {
    try {
      const comments = await Comment.find({});
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;