const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CommentSchema = new Schema({
  to_username: String,
  account_username: String,
  coming_time: String,
  content: String,
  save_time: String,
  bot_number: Number,
  profile: Number,
  link: String,
  new_reply: Boolean
});

module.exports = CommentCollection = mongoose.model("comment", CommentSchema);
