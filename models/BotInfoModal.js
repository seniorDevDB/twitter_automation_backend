const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BotInfoSchema = new Schema({
  bot_dm1_link: String,
  bot_dm2_link: String,
  bot_comment_dm_link: String,
  lead_number: Number,
  bot_number: Number,
  status: String,
  check_dm_status: Boolean,
  check_comment_status: Boolean,
  check_follow_status: Boolean
});

module.exports = BotInfoCollection = mongoose.model("bot_info", BotInfoSchema);
