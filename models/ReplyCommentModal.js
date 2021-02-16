const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReplyCommentSchema = new Schema({
  username: String,
  account_name: String,
  content: String,
  bot_number: Number,
  profile: Number
});

module.exports = ReplyCommentCollection = mongoose.model("reply_comment", ReplyCommentSchema);
