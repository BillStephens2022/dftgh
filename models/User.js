const mongoose = require("mongoose");
const Schema = mongoose.Schema;

console.log("Model definition code executed.");
const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
