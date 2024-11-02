const express = require("express");
const router = express.Router();

//Order Controller
const {
  getOrders,
  postOrder,
  getOrderView,
} = require("../controllers/order.controller");

//Middleware Import
const { isAuthenticated } = require("../middlewares/AuthMiddleware");

//Order Get Route
router.get("/:id", isAuthenticated, getOrderView);

//Order Get Route
router.get("/", isAuthenticated, getOrders);

//Order Post Route
router.post("/new", isAuthenticated, postOrder);

//Router Export
module.exports = router;
 