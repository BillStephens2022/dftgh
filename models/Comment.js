import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  name: { type: String, required: true },
  commentText: { type: String, required: true },
  episodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Episode",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);

