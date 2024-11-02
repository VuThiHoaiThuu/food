const mongoose = require("mongoose");


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

const Account = new mongoose.model("account", accountSchema);

module.exports = Account;
