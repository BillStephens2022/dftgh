const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const episodeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageLink: { type: String },
  dateAired: { type: Date, required: true },
});

const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;
