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
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null, // Null means it's a top-level comment
  },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of replies
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);

