const express = require("express");
const router = express.Router();

const { getMenu, getSearch } = require("../controllers/menu.controller");


const { isAuthenticated } = require("../middlewares/AuthMiddleware");

//Menu
router.get("/", isAuthenticated, getMenu);

//Search
router.get("/search", isAuthenticated, getSearch);

//Router Export
module.exports = router;
