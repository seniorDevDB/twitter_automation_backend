const { Int32 } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReportSchema = new Schema({
  bot1_successful_dm: Number,
  bot1_unsuccessful_dm: Number,
  bot1_spintax1_reply: Number,
  bot2_successful_dm: Number,
  bot2_unsuccessful_dm: Number,
  bot2_spintax1_reply: Number,
});

module.exports = ReportCollection = mongoose.model("report", ReportSchema);
