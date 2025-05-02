// File: src/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dir = 'uploads/affiliate';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/affiliate'); // folder lưu ảnh
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const isValid = allowedTypes.test(file.mimetype);
    cb(null, isValid);
  },
  limits: { fileSize: 8 * 1024 * 1024 },
});

module.exports = upload;
