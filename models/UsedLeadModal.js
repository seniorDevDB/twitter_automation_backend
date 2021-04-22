const { Int32 } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UsedLeadSchema = new Schema({
  username: String,
  url: String,
  bot_number: Number,
  dm: Boolean,
  dm_time: String,
  dm_expired: Boolean,
  comment: Boolean,
  comment_time: String,
  comment_expired: Boolean,
  follow: Boolean
});

module.exports = ReportCollection = mongoose.model("used_lead", UsedLeadSchema);
