const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AccountSchema = new Schema({
  username: String,
  bot_number: Number,
  status: Boolean,
  number_of_tried_leads: Number,
  dm: Number,
  dm_reply: Number,
  comment: Number,
  comment_reply: Number,
  follow: Number,
  follow_back: Number,
});

module.exports = AccountCollection = mongoose.model("account", AccountSchema);
