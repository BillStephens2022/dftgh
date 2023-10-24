const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const episodeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  dateAired: { type: Date, required: true },
  // Other fields as needed
});

const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;
