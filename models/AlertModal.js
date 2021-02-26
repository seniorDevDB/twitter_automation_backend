const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AlertSchema = new Schema({
  status: Boolean,
});

module.exports = AlertCollection = mongoose.model("alert", AlertSchema);
