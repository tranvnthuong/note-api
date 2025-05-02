const mongoose = require('mongoose');

const Affiliate = new mongoose.Schema(
  {
    name: { type: String, required: false, default: '' },
    title: { type: String, required: false, default: '' },
    imageName: { type: String, required: false, default: '' },
    imageURL: { type: String, required: false, default: '' },
    linkURL: { type: String, required: true },
    clicks: { type: Number, min: 0, default: 0 },
    impressions: { type: Number, min: 0, default: 0 },
    manualWeight: { type: Number, required: true, min: 1, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('affiliatestores', Affiliate);
