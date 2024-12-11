const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


require("dotenv").config();

const app = express();
app.use(cookieParser());

//Mongoose Connection
const database = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};

//Express Static
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css/"));
app.use("/js", express.static(__dirname + "/public/js/"));
app.use("/img", express.static(__dirname + "/public/img/"));
app.use("/assets", express.static(__dirname + "/assets/"));
app.use("/uploads", express.static("./Multer/uploads"));

//Express Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

//Routes
app.use("/", require("./routes/index.routes"));
app.use("/user", require("./routes/users.routes"));
app.use("/menu", require("./routes/menu.routes"));
app.use("/cart", require("./routes/cart.routes"));
app.use("/orders", require("./routes/orders.routes"));
app.use("/payment", require("./routes/payment.routes"));



//Routes admin
app.use('/admin', require("./routes/admin.routes"));



database().then(() => {
  app.listen(
    process.env.PORT,
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
  );
});
