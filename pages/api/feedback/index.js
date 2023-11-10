// /api/feedback
// route used for adding new feedback, getting all feedback
import Feedback from "@/models/Feedback";
import dbConnect from "@/components/lib/db";


export default async function handler(req, res) {
  await dbConnect();
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  

  // Add new Feedback
  if (req.method === "POST") {
    const { name, feedback, publicPost } = req.body;

    try {
      const newFeedback = new Feedback({
        name,
        feedback,
        publicPost,
      });
      console.log(newFeedback);

      await newFeedback.save();
      res.status(201).json({ message: "Feedback added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }

  // Fetch all feedback
  } else if (req.method === "GET") {
    try {
      const allFeedback = await Feedback.find({});
      res.status(200).json(allFeedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}