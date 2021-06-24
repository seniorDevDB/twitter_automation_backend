const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReplyCommentSchema = new Schema({
  username: String,
  account_name: String,
  coming_time: String,
  content: String,
  previous_content: String,
  link: String,
  bot_number: Number,
  profile_port: Number
});

module.exports = ReplyCommentCollection = mongoose.model("reply_comment", ReplyCommentSchema);
