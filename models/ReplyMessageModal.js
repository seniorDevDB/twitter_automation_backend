const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReplyMessageSchema = new Schema({
  username: String,
  coming_time: String,
  content: String,
  link: String,
  bot_number: Number,
  profile: Number
});

module.exports = ReplyMessageCollection = mongoose.model("reply_message", ReplyMessageSchema);
