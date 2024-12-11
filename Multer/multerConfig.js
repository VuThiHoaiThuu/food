const multer = require("multer");
const path = require("path");
const fs = require("fs");

//thư mục uploads 
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir); // Tạo thư mục nếu chưa có
}

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Đặt thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname); // Đặt tên file để tránh trùng lặp
    }
});

// Khởi tạo multer với cấu hình lưu trữ và giới hạn kích thước file (tùy chọn)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } 
});

module.exports = upload;
