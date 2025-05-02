const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

router.get('/:slug', noteController.getNoteBySlug);
router.post('/', noteController.createNote);
// router.put('/', noteController.updateNote);

module.exports = router;
