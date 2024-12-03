const express = require("express");
const router = express.Router();

const {
  getOrders, 
  postOrder,
  getOrderView,
} = require("../controllers/order.controller");

const { isAuthenticated } = require("../middlewares/AuthMiddleware");

//Order 
router.get("/:id", isAuthenticated, getOrderView);

router.get("/", isAuthenticated, getOrders);

//Order Post Route
router.post("/new", isAuthenticated, postOrder);

module.exports = router;
 