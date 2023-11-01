import dbConnect from "@/components/lib/db";
import Episode from "@/models/Episode";
import Comment from "@/models/Comment";

// Function to get all comments from the database
export async function getAllComments() {
  try {
    const comments = await Comment.find();
    return comments;
  } catch (error) {
    throw new Error("Error fetching comments: " + error.message);
  }
}
