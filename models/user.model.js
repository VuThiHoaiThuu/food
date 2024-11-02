const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: { 
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  // phoneNumber: {
  //   type: String,
  // },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Model
//const User = new mongoose.model("user", userSchema);
const User = mongoose.model('User', userSchema);

module.exports = User;
