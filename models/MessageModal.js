const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MessageSchema = new Schema({
  username: String,
  account_username: String,
  coming_time: String,
  content: String,
  save_time: String,
  bot_number: Number,
  profile: Number,
  link: String,
  new_reply: Boolean,
  mark_as_read: Boolean
});

module.exports = MessageCollection = mongoose.model("message", MessageSchema);
