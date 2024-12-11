const Item = require("../models/menu.model");
const Cart = require("../models/cart.model");
const Order = require('../models/order.model');

module.exports.placeOrder = async (req, res) => {
  const { userId } = req.body; // Lấy userId từ request body

  try {
      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ userId });

      if (!cart || cart.items.length === 0) {
          return res.status(400).json({ error: 'Cart is empty' });
      }

      // Tạo danh sách items từ giỏ hàng
      let items = [];
      let subTotal = 0;

      for (const cartItem of cart.items) {
          const product = await Product.findById(cartItem.itemId);
          if (!product) {
              return res.status(404).json({ error: `Product with ID ${cartItem.itemId} not found` });
          }

          const itemTotal = product.price * cartItem.qty; // Tính tiền từng sản phẩm
          subTotal += itemTotal;

          items.push({
              itemName: product.name,
              itemServe: product.serve || '', // Nếu có thông tin bổ sung
              itemQty: cartItem.qty,
              itemPrice: product.price,
          });
      }

      const tax = subTotal * 0.1; // Ví dụ thuế 10%
      const deliveryCharge = 20000; // Phí giao hàng cố định
      const grandTotal = subTotal + tax + deliveryCharge;

      // Tạo Order mới
      const order = new Order({
          userId,
          items,
          bill: {
              subTotal,
              tax,
              deliveryCharge,
              grandTotal,
          },
          address: req.body.address || 'No address provided',
      });

      await order.save();

      // Xóa giỏ hàng sau khi đặt hàng
      await Cart.deleteOne({ userId });

      // Chuyển đến thanh toán
      return res.status(200).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
      console.error('Error placing order:', error);
      return res.status(500).json({ error: 'Failed to place order' });
  }
};

module.exports.getCart = async (req, res) => {
  //Css Path
  let myCss = [];
  myCss.push({
    uri: "/css/cart.css",
  });

  //To find cart count
  const user = res.locals.user;
  const cart = await Cart.findOne({ userId: user._id });

  //Fetching Menu Items from Database
  const items = await Item.find({});

  res.render("cart", {
    title: "EatEasy",
    styles: myCss,
    items: items,
    cart: cart,
  });
};

module.exports.getCount = async (req, res) => {
  //To find cart count
  const user = res.locals.user;
  const cart = await Cart.findOne({ userId: user._id });

  res.send(cart);
};


module.exports.postCart = async (req, res) => {
  const itemId = req.params.id;
  const user = res.locals.user;
  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    const cartNew = new Cart({
      userId: user._id,
      items: { itemId: itemId, qty: 1 },
    });
    await cartNew.save();
    return res.redirect("/menu");
  }

  const isExist = await Cart.findOne({
    userId: user._id,
    "items.itemId": itemId,
  });
  if (isExist) {
    return res.redirect("/menu");
  }
  //Saving the item to cart for particular user
  cart.items.push({ itemId: itemId, qty: 1 });
  await cart.save();
  return res.redirect("/menu");
};


module.exports.patchCart = async (req, res) => {
  const id = +req.params.id;
  const user = res.locals.user;
  const newQty = req.body.qty;


  // const cart = await Cart.findOne({ userId: user._id });
  // cart.items[index].qty = newQty;
  // await cart.save();

  //Using findOneAndUpdate with item id

  await Cart.findOneAndUpdate(
    { userId: user._id, "items.itemId": id },
    { $set: { "items.$.qty": newQty } }
  );

  // res.redirect("/cart");
  res.send("Item Updated");
};


module.exports.deleteCart = async (req, res) => {
  const id = +req.params.id;
  const user = res.locals.user;
  await Cart.findOneAndUpdate(
    { userId: user._id },
    { $pull: { items: { itemId: id } } }
  );
  res.redirect("/cart");
};


module.exports.clearCart = async (req, res) => {
  const user = res.locals.user;
  await Cart.deleteOne({ userId: user._id });
  res.send("Cart Cleared");
};
