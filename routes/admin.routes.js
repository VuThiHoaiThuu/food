const upload = require("../Multer/multerConfig")
const express = require("express");
const router = express.Router();
const {
  getLogin,
  postLogin,
  getIndex,
  getProducts,
  createProduct,
  addProduct,
  editProduct,
  updateProduct, 
  deleteProduct,
  getOrders,
  getOrderDetails,
  getLogout
} = require("../controllers/admin.controller");

const {
  requireLogin,
} = require("../middlewares/AuthMiddleware");

// Login Routes
router.get("/login", getLogin);
router.post("/login", postLogin);

// Logout Route
router.get("/logout", getLogout);

// Main Page Route
router.get('/', requireLogin, getIndex);

// Product Routes
router.get("/products",requireLogin, getProducts);

//Create new product
router.get("/products/create", addProduct)
router.post("/products/create",upload.single("image"), createProduct);

// Route để lấy thông tin sản phẩm cho việc chỉnh sửa
router.get('/products/edit/:id', editProduct);
// Route để cập nhật thông tin sản phẩm
router.post('/products/update/:id',upload.single("image"), updateProduct);
//Xóa sản phẩm
router.post("/products/:id/delete", deleteProduct);


router.get("/order", requireLogin, getOrders);
router.get('/order/:id', getOrderDetails);


module.exports = router;
