const express = require("express");
const router = express.Router();

//UserController
const {
  getLogin, 
  postLogin,
  getRegister,
  postRegister,
  getLogout,
  patchUpdate,
} = require("../controllers/user.controller");

const {
  isAuthenticated,
  checkUser,
  isLogged,
} = require("../middlewares/AuthMiddleware");

//Login 
router.get("/login", isLogged, getLogin);
router.post("/login", postLogin);

//Register Route
router.get("/register", isLogged, getRegister);
router.post("/register", postRegister);

//Logout 
router.get("/logout", getLogout);

router.patch("/u/:field", isAuthenticated, patchUpdate);


module.exports = router;
