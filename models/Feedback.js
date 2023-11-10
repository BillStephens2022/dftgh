import mongoose from "mongoose";
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  name: { type: String, required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

