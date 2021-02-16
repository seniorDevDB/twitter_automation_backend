const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MessageSchema = new Schema({
  name: String,
  username: String,
  coming_time: String,
  content: String,
  save_time: String,
  bot_number: Number,
  profile: Number
});

module.exports = MessageCollection = mongoose.model("message", MessageSchema);
