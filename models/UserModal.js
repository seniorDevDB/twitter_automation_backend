const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email: String,
  password: String,
});

module.exports = UserCollection = mongoose.model("user", UserSchema);
