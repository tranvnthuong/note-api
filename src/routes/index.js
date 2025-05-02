const express = require('express');
const router = express.Router();

router.use('/note', require('./note.route'));
router.use('/captcha', require('./captcha.route'));
router.use('/affiliate', require('./affiliate.route'));
router.use('/affiliatemgr', require('./affiliatemgr.route'));

module.exports = router;
