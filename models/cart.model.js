const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      itemId: {
        type: Number,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Cart = new mongoose.model("cart", cartSchema);


module.exports = Cart;
