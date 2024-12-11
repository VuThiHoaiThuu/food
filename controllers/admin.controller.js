const bcrypt = require("bcrypt");
const Account = require("../models/account.model");
const Product = require('../models/menu.model');
const Order = require('../models/order.model');
const User  = require('../models/user.model');
const jwt = require("jsonwebtoken");
 
require("dotenv").config();

// JWT Token Creation
const createToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
};


module.exports.getLogin = (req, res) => {
  let myCss = [];
  myCss.push({ uri: "/css/styles.css" });
  
  res.render("admin/login", { title: "Login Admin", styles: myCss });
};


module.exports.postLogin = async (req, res) => {
  // CSS Path
  let myCss = [];
  myCss.push({ uri: "/css/styles.css" });

  // Lấy thông tin từ form
  const { name, password } = req.body;
  let errors = [];

  // Kiểm tra đầu vào
  if (!name || !password) {
    errors.push({ msg: "Please fill out all required fields" });
  }

  // Trả về trang đăng nhập nếu có lỗi
  if (errors.length > 0) {
    return res.status(406).render("admin/login", {
      title: "Admin Login",
      styles: myCss,
      errors,
      name, 
      password,
    });
  }

  try {
    
    const admin = await Account.findOne({ name, password });
    if (!admin) {
      errors.push({ msg: "Username or password is incorrect" });
      return res.status(401).render("admin/login", {
        title: "Admin Login",
        styles: myCss,
        errors,
      });
    }


    //Tạo token và lưu trong cookie
    const token = createToken(admin._id, admin.name);
    res.cookie("jwt", token, {
      //maxAge: 1000 * 60 * 60 * 24 * 3, // Cookie tồn tại 3 ngày
      httpOnly: true,
    });
    res.redirect("/admin/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
}; 


module.exports.getLogout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/admin/login");
};


//index admin
module.exports.getIndex = async (req, res) => {
    let myCss = [];
    myCss.push({
      uri: "/css/styles.css",
    });
    

    // Lấy dữ liệu thống kê từ model Order
    const orders = await Order.find();
    const salesData = {};

    // Tính tổng số lượng và doanh số cho từng sản phẩm
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!salesData[item.itemName]) {
          salesData[item.itemName] = { quantity: 0, revenue: 0 };
        }
        salesData[item.itemName].quantity += item.itemQty;
        salesData[item.itemName].revenue += item.itemQty * item.itemPrice;
      });
    });

    // Chuyển đổi dữ liệu thành mảng để truyền vào EJS
    const formattedSalesData = Object.keys(salesData).map(itemName => ({
      itemName,
      quantity: salesData[itemName].quantity,
      revenue: salesData[itemName].revenue,
    }));

    // Render trang admin cùng với dữ liệu thống kê
    res.render("admin/", {
      title: "Admin",
      styles: myCss,
      salesData: formattedSalesData, // truyền dữ liệu thống kê vào view
    });
  
    //res.render("admin/", { title: "admin", styles: myCss});
  };



// Lấy danh sách sản phẩm
module.exports.getProducts = async (req, res) => {
  let myCss = [{ uri: "/css/styles.css" }];
  try {
      const products = await Product.find();
      res.render("admin/products", { title: "Danh sách sản phẩm", styles: myCss, products });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

 // Thêm sản phẩm mới
module.exports.addProduct = (req, res) => {
  let myCss = [{ uri: "/css/producs_edit.css" }];
  res.render("admin/product_add", { title: "Thêm sản phẩm mới", styles: myCss });
};

module.exports.createProduct = async (req, res) => {
  let myCss = [{ uri: "/css/producs_edit.css" }];
  let errors = [];
  try {
      const { itemId, name, price, serve, unit, category } = req.body;
      const imagePath = req.file ? req.file.filename : null;

      // Kiểm tra các trường hợp lỗi
      if (!itemId || !name || !price || !serve || !unit || !category || !imagePath) {
          errors.push({ msg: "Vui lòng điền đầy đủ thông tin và chọn ảnh." });
      }

      if (name.length > 70) {
          errors.push({ msg: "Tên sản phẩm không được dài hơn 70 ký tự." });
      }

      if (errors.length > 0) {
          // Trả lại trang với danh sách lỗi
          return res.status(400).render("admin/product_add", {
              title: "Thêm sản phẩm mới",
              styles: myCss,
              errors,
              itemId,
              name,
              price,
              serve,
              unit,
              category
          });
      }

      // Tạo sản phẩm mới
      const newProduct = new Product({
          itemId,
          name,
          price,
          serve,
          unit,
          category,
          image: imagePath  // Gán đường dẫn ảnh vào trường `image`
      });
      await newProduct.save();

      // Lấy danh sách tất cả sản phẩm sau khi tạo sản phẩm mới
      const products = await Product.find();  // Truy vấn tất cả sản phẩm từ database

      res.redirect('/admin/products');
  } catch (error) {
      errors.push({ msg: error.message });
      res.status(401).render("admin/product_add", {
          title: "Thêm sản phẩm mới",
          styles: myCss,
          errors
      });
  }
};



module.exports.editProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const products = await Product.findById(id); // Lấy sản phẩm theo ID
        if (!products) {
            return res.status(404).render("404", { title: "Not Found" });
        }

        let myCss = [{ uri: "/css/producs_edit.css" }];
        res.render("admin/product_edit", { title: "Chỉnh sửa sản phẩm", styles: myCss, products }); // Đảm bảo truyền product
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller để cập nhật thông tin sản phẩm
module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { itemId, name, price, serve, unit, category } = req.body;
  const image = req.file ? req.file.filename : null; // Lấy tên file mới nếu có

  let errors = []; // Khai báo mảng errors để chứa các lỗi
  let myCss = [{ uri: "/css/producs_edit.css" }]; // Thêm CSS nếu cần

  try {
      // Tìm sản phẩm hiện tại để lấy thông tin ảnh cũ
      const product = await Product.findById(id);
      if (!product) {
          return res.status(404).render("404", { title: "Not Found" });
      }

      // Kiểm tra các trường hợp lỗi
      if ( !name || !price || !serve || !unit || !category ) {
        errors.push({ msg: "Vui lòng điền đầy đủ thông tin và chọn ảnh." });
      }

      if (name.length > 70) {
          errors.push({ msg: "Tên sản phẩm không được dài hơn 70 ký tự." });
      }

      if (errors.length > 0) {
          // Nếu có lỗi, trả lại trang sửa sản phẩm và hiển thị lỗi
          return res.render("admin/product_edit", {
              title: "Chỉnh sửa sản phẩm",
              styles: myCss,
              errors,
              itemId,
              name,
              price,
              serve,
              unit,
              category,
              image: image || product.image, // Giữ ảnh cũ nếu không có ảnh mới
              products: product // Đảm bảo truyền dữ liệu sản phẩm vào view
          });
      }

      // Chuẩn bị dữ liệu cập nhật
      const updateData = {
          itemId,
          name,
          price,
          serve,
          unit,
          category,
          image: image || product.image // Giữ nguyên ảnh cũ nếu không có ảnh mới
      };

      // Cập nhật sản phẩm
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedProduct) {
          return res.status(404).render("404", { title: "Not Found" });
      }

      res.redirect('/admin/products'); // Chuyển hướng về trang danh sách sản phẩm
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


//Xóa sản phẩm 
module.exports.deleteProduct = async (req, res) => {
  let myCss = [{ uri: "/css/styles.css" }];
  try {
      const productId = req.params.id;  // Lấy id từ URL

      // Tìm và xóa sản phẩm theo id
      await Product.findByIdAndDelete(productId);

      // Lấy danh sách sản phẩm sau khi xóa
      const products = await Product.find();

      // Render lại trang danh sách sản phẩm
      res.render("admin/products", { title: "Danh sách sản phẩm", styles: myCss, products });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


// Lấy danh sách đơn hàng
module.exports.getOrders = async (req, res) => {
  let myCss = [{ uri: "/css/styles.css" }];
  try {
      const orders = await Order.find().populate({ path: 'userId', model: 'User', select: 'name' }); // Lấy trường name từ User
      res.render("admin/ad_order", { title: "Danh sách đơn hàng", styles: myCss, orders });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

module.exports.getOrderDetails = async (req, res) => {
  const orderId = req.params.id; // Lấy ID đơn hàng từ params
  try {
    const order = await Order.findById(orderId)
      .populate({ path: 'userId', select: 'name' }); // Lấy tên người dùng

    if (!order) { 
      return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
    }
    
    let myCss = [{ uri: "/css/order_detail.css" }];
    res.render('admin/ad_order_details', { title: 'Chi tiết đơn hàng', styles: myCss, order }); // Gửi dữ liệu tới view
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
