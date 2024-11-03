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

//Login 
router.get("/login", getLogin);
router.post("/login", postLogin);

//Logout 
router.get("/logout", getLogout);

//Indedx
router.get('/', requireLogin, getIndex);

//Product 
router.get("/products",requireLogin, getProducts);

//Create new product
router.get("/products/create", addProduct)
router.post("/products/create",upload.single("image"), createProduct);

// Edit product
router.get('/products/edit/:id', editProduct);
router.post('/products/update/:id',upload.single("image"), updateProduct);

//Delete product
router.post("/products/:id/delete", deleteProduct);

// Orders
router.get("/order", requireLogin, getOrders);
router.get('/order/:id', getOrderDetails);


module.exports = router;
