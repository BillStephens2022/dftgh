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
   // like/unlike a comment 
  } else if (req.method === "PATCH") {
    try {
      const { commentId, liked } = req.body; // Expecting commentId and liked status
      if (!commentId || liked === undefined) {
        return res
          .status(400)
          .json({ error: "Comment ID and liked status are required" });
      }

      const updateValue = liked ? -1 : 1; // Decrement if liked, increment if not

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { likes: updateValue } },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      res.status(200).json(updatedComment);
    } catch (error) {
      console.error("Error updating like count:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
