// /api/feedback/[feedbackId]
// route used for deleting specific feedback
import Feedback from "@/models/Feedback";
import dbConnect from "@/components/lib/db";


const handler = async (req, res) => {
  await dbConnect();
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  // Add new Feedback
  if (req.method === "DELETE") {
    const { feedbackId } = req.query;

    console.log("DELETE FEEDBACK ROUTE HIT!!");
    console.log("feedback: ", feedbackId );
    try {
      const existingFeedback = await Feedback.findById(feedbackId);

      if (!existingFeedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }

      // Delete the comment from the database
      await Feedback.findByIdAndDelete(feedbackId);

      res.status(200).json({ message: "Feedback deleted successfully" });

    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;