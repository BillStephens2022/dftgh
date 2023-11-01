import dbConnect from "@/components/lib/db";
import Episode from "@/models/Episode";
import Comment from "@/models/Comment";

export default async function handler(req, res) {
    await dbConnect();
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  
    const { episodeId } = req.query;
  
    if (req.method === "POST") {
      try {
        const { name, commentText } = req.body;
  
        const existingEpisode = await Episode.findById(episodeId);
  
        if (!existingEpisode) {
          return res.status(404).json({ error: "Episode not found" });
        }
  
        // Create a new comment
        const newComment = new Comment({
          name,
          commentText,
          episodeId: existingEpisode._id
        });
  
        // Save the new comment to the database
        await newComment.save();
  
        // Add the comment reference to the episode's comments array
        existingEpisode.comments.push(newComment._id);
        await existingEpisode.save();
  
        res.status(201).json(newComment);
      } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Internal server error" });
      }
   
    } else if (req.method === "GET") {
      try {
        if (episodeId) {
          // Fetch comments by episodeId
          const comments = await Comment.find({ episodeId: episodeId });
          res.status(200).json(comments);
        } else {
          res.status(500).json({ error: "Internal server error" });
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(400).json({ error: "No episode Id provided." });
      }
    } else if (req.method === "DELETE") {
      try {
        const existingEpisode = await Episode.findById(episodeId);
  
        if (!existingEpisode) {
          return res.status(404).json({ error: "Episode not found" });
        }
  
        const existingComment = await Comment.findById(commentId);
  
        if (!existingComment) {
          return res.status(404).json({ error: "Comment not found" });
        }
  
        // Remove the comment from the episode's comments array
        existingEpisode.comments = existingEpisode.comments.filter(
          (comment) => comment.toString() !== commentId
        );
  
        // Save the episode without the deleted comment
        await existingEpisode.save();
  
        // Delete the comment from the database
        await existingComment.deleteOne();
  
        res.status(200).json({ message: "Comment deleted successfully" });
      } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Internal server error" });
      } 
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  }
 
  
  