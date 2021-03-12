const { Int32 } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReportSchema = new Schema({
  bot_number: Number,
  lead_number: Number,
  sent_dm: Number,
  unsuccessful_dm: Number,
  spintax1_reply: Number,
  spintax2_reply: Number,
  sent_comment: Number,
  unsuccessful_comment: Number,
  comment_reply: Number,
  follow: Number,
  follow_back: Number
});

module.exports = ReportCollection = mongoose.model("report", ReportSchema);
