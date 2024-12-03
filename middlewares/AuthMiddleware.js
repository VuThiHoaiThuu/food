const User = require("../models/user.model");
const Admin = require("../models/account.model")
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/user/login");
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);
      return res.redirect("/user/login");
    }
    const user = res.locals.user;
    if (!user) {
      return res.redirect("/user/logout");
    }
    next();
  });
};

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.user = null;
    return next();
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);
      res.locals.user = null;
      return next(); 
    }
    User.findById(decoded.id).then((user) => {
      if (!user) {
        res.locals.user = null;
        return next();
      }
      res.locals.user = user;
      next();
    });
  });
};

module.exports.isLogged = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next();
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);
      return next();
    }

    res.redirect("/menu");
  });
};

module.exports.adminLogged = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next();
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);
      return next();
    }

    res.redirect("admin/login");
  });
};

module.exports.requireLogin = (req, res, next) => {
  const token = req.cookies.jwt;

  // Kiểm tra nếu không có token thì chuyển hướng về trang login
  if (!token) {
    return res.redirect('/admin/login');
  }

  // Xác minh token
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);
      // Nếu token không hợp lệ, chuyển hướng về trang login
      return res.redirect('/admin/login');
    }

    // Nếu token hợp lệ, tiếp tục truy cập trang yêu cầu
    req.user = decoded;
    next();
  });
}; 