const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 requests
  standardHeaders: true, // trả header RateLimit theo chuẩn
  legacyHeaders: false, // tắt header X-RateLimit cũ
  handler: (req, res) => {
    return res.status(429).json({
      message: 'Too many requests, please try again later',
    });
  },
  skip: (req) => {
    return req.method === 'OPTIONS'; // bỏ qua các request OPTIONS
  },
});