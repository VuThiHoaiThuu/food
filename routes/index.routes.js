const express = require("express");
const router = express.Router();

//Middleware Import
const { checkUser } = require("../middlewares/AuthMiddleware");
const { getIndex } = require("../controllers/index.controller");

router.use("*", checkUser); 

//Home 
router.get("/", getIndex);


module.exports = router; 
