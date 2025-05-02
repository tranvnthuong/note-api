const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliate.controller');

router.get('/impressions/:id', affiliateController.impressionsAffiliate);
router.get('/clicks/:id', affiliateController.clickAffiliate);
router.get('/', affiliateController.getListAffiliate);

module.exports = router;
