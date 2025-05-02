const express = require('express');
const router = express.Router();
const captchaController = require('../controllers/captcha.controller');

router.get('/', captchaController.generateCaptcha);

module.exports = router;
