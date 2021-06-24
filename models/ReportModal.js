const { Int32 } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReportSchema = new Schema({
  bot_number: Number,
  lead_number: Number,
  lead_number_a_day: Number,
  sent_dm: Number,
  expired_dm: Number,
  spintax1_reply: Number,
  sent_comment: Number,
  expired_comment: Number,
  comment_reply: Number,
  follow: Number,
  follow_back: Number,
  unfollow: Number,
});

module.exports = ReportCollection = mongoose.model("report", ReportSchema);
