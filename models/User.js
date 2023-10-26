const mongoose = require("mongoose");
const Schema = mongoose.Schema;

if (!mongoose.models.User) {
  console.log("Model definition code executed.");
  const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  });
  const User = mongoose.model("User", userSchema);

  module.exports = User;
} else {
  module.exports = mongoose.models.User;
}
