import mongoose from "mongoose";
const Schema = mongoose.Schema;


const episodeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageLink: { type: String },
  dateAired: { type: Date, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  polls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }]
});

export default mongoose.models.Episode || mongoose.model('Episode', episodeSchema);

