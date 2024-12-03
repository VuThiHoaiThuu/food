// const Item = require("../models/menu");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");


module.exports.getOrders = async (req, res) => {
  //Css Path
  let myCss = [];
  myCss.push({
    uri: "/css/orders.css",
  });


  const user = res.locals.user;
  const cart = await Cart.findOne({ userId: user._id });
  const order = await Order.find({ userId: user._id });

  res.render("orders", {
    title: "Your Orders",
    styles: myCss,
    orders: order,
    cart: cart,
  });
};


module.exports.getOrderView = async (req, res) => {
  //Css Path
  let myCss = [];
  myCss.push({
    uri: "/css/order.css",
  });


  const user = res.locals.user;
  const cart = await Cart.findOne({ userId: user._id });
  const orderId = req.params.id;
  const order = await Order.findOne({ userId: user._id, _id: orderId });

  res.render("order", {
    title: "Order Details",
    styles: myCss,
    order: order,
    cart: cart,
  });
};



module.exports.postOrder = async (req, res) => {
  const user = res.locals.user;
  const { items, bill } = req.body;
  const order = new Order({
    userId: user._id,
    items: items,
    bill: bill,
    address: user.address,
    //phoneNumber: user.phoneNumber
  });
  const placed = await order.save();
  res.send(placed);
};
