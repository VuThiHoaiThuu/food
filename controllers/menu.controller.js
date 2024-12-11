const Item = require("../models/menu.model");
const Cart = require("../models/cart.model");


module.exports.getMenu = async (req, res) => {
  //Css Path
  let myCss = [];
  myCss.push({
    uri: "/css/menu.css",
  }); 


  const user = res.locals.user;
  const cart = await Cart.findOne({ userId: user._id });

  const items = await Item.find({});

  res.render("menu", {
    title: "EatEasy",
    styles: myCss,
    items: items,
    cart: cart,
  });
};


module.exports.getSearch = async (req, res) => {
  const name = req.query.name;

  //Checking if name has value
  if (!name) {
    let myCss = [];
    myCss.push({
      uri: "/css/search.css",
    });

    //To find cart count
    const user = res.locals.user;
    const cart = await Cart.findOne({ userId: user._id });

    return res.render("search", {
      title: "Search - EatEasy",
      styles: myCss,
      cart: cart,
    });
  }

  const query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  const items = await Item.find(query);

  res.json({ items });
};
