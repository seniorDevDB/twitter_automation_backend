const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BotInfoSchema = new Schema({
  bot1_dm1_link: String,
  bot1_dm2_link: String,
  bot1_comment_dm_link: String,
  bot2_dm1_link: String,
  bot2_dm2_link: String,
  bot2_comment_dm_link: String,
  bot3_dm1_link: String,
  bot3_dm2_link: String,
  bot3_comment_dm_link: String,
  username_number: Number,
  status: String,
  check_dm_status: Boolean,
  check_comment_status: Boolean,
  check_follow_status: Boolean
});

module.exports = BotInfoCollection = mongoose.model("bot_info", BotInfoSchema);
