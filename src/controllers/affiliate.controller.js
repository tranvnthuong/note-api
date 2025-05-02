const Affiliate = require('../models/affiliate.model');

class AffiliateClient {
  async getListAffiliate(req, res) {
    try {
      const listAffiliate = await Affiliate.find({}).select(
        '-imageName -createdAt -updatedAt -__v'
      );
      if (listAffiliate.length == 0) {
        res.status(404).json({ message: 'No data' });
      }
      res.status(200).json({
        message: 'affiliates',
        data: listAffiliate,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async clickAffiliate(req, res) {
    try {
      const affiliateInDb = await Affiliate.findByIdAndUpdate(
        req.params.id,
        { $inc: { clicks: 1 } },
        { new: true }
      );
      if (!affiliateInDb) return res.status(404).json({ message: 'not found' });
      res.sendStatus(204);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async impressionsAffiliate(req, res) {
    try {
      const affiliateInDb = await Affiliate.findByIdAndUpdate(
        req.params.id,
        { $inc: { impressions: 1 } },
        { new: true }
      );
      if (!affiliateInDb) return res.status(404).json({ message: 'not found' });
      res.sendStatus(204);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }
}

module.exports = new AffiliateClient();
