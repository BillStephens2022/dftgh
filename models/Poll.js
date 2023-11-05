const mongoose = require("mongoose");
const Schema = mongoose.Schema;

if (!mongoose.models.Poll) {
  const pollSchema = new Schema({
    question: {
      type: String,
      required: true,
    },
    episodeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episode",
        required: true,
    },
    options: {
      type: [
        {
          text: {
            type: String,
            required: true,
          },
          votes: {
            type: Number,
            default: 0,
          },
        },
      ],
      validate: [
        optionsArrayLimit,
        "A poll must have at least 2 options and at most 4 options.",
      ],
    },
  });
  const Poll = mongoose.model("Poll", pollSchema);

  module.exports = Poll;
} else {
  module.exports = mongoose.models.Poll;
}

function optionsArrayLimit(val) {
  return val.length >= 2 && val.length <= 4;
}
