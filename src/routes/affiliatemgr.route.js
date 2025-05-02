const express = require('express');
const router = express.Router();
const affiliateMgrController = require('../controllers/affiliatemgr.controller');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload.middleware');

router.post('/login', affiliateMgrController.login);
router.get('/getDelayAffiliate', affiliateMgrController.getDelayAffiliate);
router.get(
  '/getSDelayAffiliate',
  authMiddleware.verifyToken,
  affiliateMgrController.getSDelayAffiliate
);
router.post(
  '/setDelayAffiliate',
  authMiddleware.verifyToken,
  affiliateMgrController.setDelayAffiliate
);

router.post(
  '/',
  authMiddleware.verifyToken,
  upload.single('imageURL'),
  affiliateMgrController.createAffiliate
);

router.get(
  '/',
  authMiddleware.verifyToken,
  affiliateMgrController.getListAffiliate
);

router.put(
  '/',
  authMiddleware.verifyToken,
  upload.single('imageURL'),
  affiliateMgrController.updateAffiliate
);

router.delete(
  '/:id',
  authMiddleware.verifyToken,
  affiliateMgrController.deleteAffiliate
);

module.exports = router;
