const mongoose = require('mongoose');

const Note = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  id: { type: Number, required: false },
  titleText: { type: String, required: false },
  markdownContent: { type: String, required: true },
  plainText: { type: String, required: true },
  dateString: { type: String, required: false },
  isoDate: { type: Date, default: Date.now },
  shared: { type: Boolean, default: false },
});

module.exports = mongoose.model('notestores', Note);
