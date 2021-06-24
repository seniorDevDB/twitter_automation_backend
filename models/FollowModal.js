const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FollowSchema = new Schema({
  bot_number: Number,
  username: String,
  profile_port: Number,
  account_username: String
});

module.exports = FollowCollection = mongoose.model("follow", FollowSchema);
