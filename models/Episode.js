const mongoose = require("mongoose");
const Schema = mongoose.Schema;

if (!mongoose.models.Episode) {
  const episodeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageLink: { type: String },
    dateAired: { type: Date, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    polls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }]
  });

  const Episode = mongoose.model("Episode", episodeSchema);
  module.exports = Episode;
} else {
  module.exports = mongoose.models.Episode;
}
