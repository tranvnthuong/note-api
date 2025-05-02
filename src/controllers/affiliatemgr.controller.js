const Affiliate = require('../models/affiliate.model');
const Account = require('../models/account.model');
const jwt = require('jsonwebtoken');

const fs = require('fs');

require('dotenv').config();

let DELAY_LOOP_AFFILIATE = '120:180'; // min : max;
let DELAY_START_AFFILIATE = '3:7';

class AffiliateMgr {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await Account.findOne({ username, password });
      if (admin) {
        const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRATION,
        });
        res.json({ message: 'Login successfully', token });
      } else {
        res.status(401).json({ message: 'Incorrect account or password' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async getDelayAffiliate(req, res) {
    try {
      const [minDelayLoop, maxDelayLoop] = DELAY_LOOP_AFFILIATE.split(':');
      const minLoop = parseInt(minDelayLoop);
      const maxLoop = parseInt(maxDelayLoop);
      const delayLoop =
        (Math.random() * (maxLoop - minLoop + 1) + minLoop) * 1000;
      const [minDelayStart, maxDelayStart] = DELAY_START_AFFILIATE.split(':');
      const minStart = parseInt(minDelayStart);
      const maxStart = parseInt(maxDelayStart);
      const delayStart =
        (Math.random() * (maxStart - minStart + 1) + minStart) * 1000;
      res.status(200).json({
        message: 'get delay affiliate success',
        delayLoop,
        delayStart,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async getSDelayAffiliate(req, res) {
    try {
      res.status(200).json({
        message: 'get delay affiliate success',
        delayLoop: DELAY_LOOP_AFFILIATE,
        delayStart: DELAY_START_AFFILIATE,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async setDelayAffiliate(req, res) {
    try {
      const { delayLoop, delayStart } = req.body;
      const regex = /^\d{1,3}:\d{1,3}$/;
      if (!regex.test(delayLoop) || !regex.test(delayStart)) {
        return res.status(400).json({ message: 'Invalid delay format' });
      }
      if (
        parseInt(delayLoop.split(':')[0]) > parseInt(delayLoop.split(':')[1]) ||
        parseInt(delayStart.split(':')[0]) > parseInt(delayStart.split(':')[1])
      ) {
        return res
          .status(400)
          .json({ message: 'Number b must be greater than a' });
      }
      DELAY_LOOP_AFFILIATE = delayLoop;
      DELAY_START_AFFILIATE = delayStart;
      res.status(200).json({
        message: 'set delay affiliate success',
        delayLoop: DELAY_LOOP_AFFILIATE,
        delayStart: DELAY_START_AFFILIATE,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async getListAffiliate(req, res) {
    try {
      const listAffiliate = await Affiliate.find({});
      res.status(200).json({
        message: 'get affiliates success',
        data: listAffiliate,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async createAffiliate(req, res) {
    try {
      const { name, title, linkURL, manualWeight } = req.body;
      if (!linkURL || !manualWeight || manualWeight < 0) {
        return res.status(400).json({ message: 'Invalid data' });
      }
      const imageFolder = '/uploads/affiliate/';
      let imageURL, imageName;
      if (req.file) {
        imageURL = imageFolder + req.file.filename;
        imageName = req.file.filename;
      } else {
        imageURL = imageFolder + 'shopee-aff1.webp';
        imageName = 'shopee-aff1.webp';
      }
      const affiliate = new Affiliate({
        name,
        title,
        imageName,
        imageURL,
        linkURL,
        manualWeight,
      });
      const newAffiliate = await affiliate.save();
      res.status(200).json({ message: 'created', data: newAffiliate });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async updateAffiliate(req, res) {
    try {
      const affiliateData = req.body;
      if (req.file) {
        const oldPath = 'uploads/affiliate/' + affiliateData.imageName;
        if (
          affiliateData.imageName !== 'shopee-aff1.webp' &&
          fs.existsSync(oldPath)
        ) {
          fs.unlinkSync(oldPath);
        }
        affiliateData.imageName = req.file.filename;
        affiliateData.imageURL = '/uploads/affiliate/' + req.file.filename;
      }
      const updatedAffiliate = await Affiliate.findByIdAndUpdate(
        affiliateData._id,
        affiliateData,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedAffiliate) {
        return res.status(404).json({ message: 'Affiliate not found' });
      }
      res
        .status(200)
        .json({ message: 'update success', data: updatedAffiliate });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async deleteAffiliate(req, res) {
    const id = req.params.id;
    try {
      const deletedAffiliate = await Affiliate.findByIdAndDelete(id);
      if (!deletedAffiliate) {
        res.status(404).json({ message: 'not found' });
      } else {
        const oldPath = 'uploads/affiliate/' + deletedAffiliate.imageName;
        if (
          deletedAffiliate.imageName !== 'shopee-aff1.webp' &&
          fs.existsSync(oldPath)
        ) {
          fs.unlinkSync(oldPath);
        }
        res.status(200).json({ message: 'deleted successfully' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }
}

module.exports = new AffiliateMgr();
