const mongoose = require("mongoose");

// Schema
const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: { 
    type: String,
    required: true,
  },
  
});

// Model
const Account = new mongoose.model("account", accountSchema);

module.exports = Account;
