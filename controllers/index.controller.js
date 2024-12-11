const Cart = require("../models/cart.model");


module.exports.getIndex = async (req, res) => {
  let myCss = [];
  myCss.push({
    uri: "/css/index.css",
  });

 
  const user = res.locals.user;
  let cart = null;
  if (user) {
    cart = await Cart.findOne({ userId: user._id });
  }

  res.render("index", { title: "EatEasy", styles: myCss, cart: cart });
}; 
 