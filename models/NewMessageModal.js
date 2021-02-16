const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const NewMessageSchema = new Schema({
  username: String,
  coming_time: String,
  content: String,
  save_time: String,
  bot_number: Number,
  profile: Number
});

module.exports = NewMessageCollection = mongoose.model("new_message", NewMessageSchema);
