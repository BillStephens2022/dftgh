const mongoose = require("mongoose");
const Schema = mongoose.Schema;

if (!mongoose.models.Comment) {
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

  const Comment = mongoose.model("Comment", commentSchema);

  module.exports = Comment;
} else {
  module.exports = mongoose.models.Comment;
}
