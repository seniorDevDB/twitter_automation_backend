const { Int32 } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReportSchema = new Schema({
  bot1_user_number: Number,
  bot1_successful_dm: Number,
  bot1_unsuccessful_dm: Number,
  bot1_spintax1_reply: Number,
  bot1_successful_comment: Number,
  bot1_unsuccessful_comment: Number,
  bot1_follow_back:Number,
  bot2_user_number: Number,
  bot2_successful_dm: Number,
  bot2_unsuccessful_dm: Number,
  bot2_spintax1_reply: Number,
  bot2_successful_comment: Number,
  bot2_unsuccessful_comment: Number,
  bot2_follow_back:Number,
  bot3_user_number: Number,
  bot3_successful_dm: Number,
  bot3_unsuccessful_dm: Number,
  bot3_spintax1_reply: Number,
  bot3_successful_comment: Number,
  bot3_unsuccessful_comment: Number,
  bot3_follow_back:Number,
});

module.exports = ReportCollection = mongoose.model("report", ReportSchema);
