const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FollowBackSchema = new Schema({
  username: String,
  account_username: String,
  profile: Number,
  bot_number: Number,
});

module.exports = FollowBackCollection = mongoose.model("follow_back", FollowBackSchema);
