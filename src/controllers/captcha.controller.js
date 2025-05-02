const svgCaptcha = require('svg-captcha');
const redis = require('../config/redis');

exports.generateCaptcha = async (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    ignoreChars: '0o1i',
    noise: 4,
    color: true,
    lowercase: true,
    background: '#f4f4f4',
  });

  const captchaId = `captcha:${Date.now()}`;
  await redis.setex(captchaId, 90, captcha.text.toLowerCase());

  res.json({
    captchaId,
    captchaSvg: captcha.data,
  });
};
