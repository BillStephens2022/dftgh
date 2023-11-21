
// /api/episodes/[episodeId]/comments/[commentId]
// route used for deleting an existing comment under a specific episode
import { getServerSession } from "next-auth/next";
import dbConnect from "@/components/lib/db";
import Episode from "@/models/Episode";
import Comment from "@/models/Comment";

const handler = async (req, res) => {
  await dbConnect();
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
 
  const { episodeId, commentId } = req.query;
  
  // delete a comment under a specific episode
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res);
    if (!session) {
      res.status(401).json({ message: "Not Authenticated to Delete a Comment!" });
      return;
    }

    try {
      const existingEpisode = await Episode.findById(episodeId);

      if (!existingEpisode) {
        return res.status(404).json({ error: "Episode not found" });
      }

      // Remove the comment from the episode's comments array
      existingEpisode.comments = existingEpisode.comments.filter(
        (comment) => comment.toString() !== commentId
      );

      // Delete the comment from the database
      await Comment.findByIdAndDelete(commentId);

      // Save the episode without the deleted comment
      await existingEpisode.save();

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
