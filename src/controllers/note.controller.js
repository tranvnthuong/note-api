const Note = require('../models/note.model');
const redis = require('../config/redis');
const slugify = require('../utils/slugify');

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');

class NoteController {
  async getNoteBySlug(req, res) {
    try {
      const noteInDb = await Note.findOne({ slug: req.params.slug }).select(
        '-_id -__v'
      );
      if (!noteInDb) return res.status(404).json({ message: 'note_not_found' });
      res.status(200).json({ message: 'Found a note', data: noteInDb });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  async createNote(req, res) {
    try {
      const captchaId = req.headers['captcha-id'];
      const captchaText = req.headers['captcha-text'];
      const storedCaptcha = await redis.get(captchaId);
      if (!storedCaptcha || storedCaptcha !== captchaText) {
        return res.status(400).json({ message: 'in_valid_captcha' });
      }
      const dataRequest = req.body;
      if (Buffer.byteLength(dataRequest.markdownContent, 'utf8') > 2097152) {
        return res.status(400).json({
          message: 'markdownContent must be less than 2MB',
        });
      }
      delete dataRequest.captcha;
      if (!dataRequest.slug) {
        dataRequest.slug = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: '-',
          style: 'lowerCase',
          length: 3,
        });
      } else {
        const slug = slugify(dataRequest.slug);
        const noteInDb = await Note.findOne({
          slug,
        });
        if (noteInDb)
          return res
            .status(400)
            .json({ message: `SLUG { ${slug} } has been used` });
      }
      await redis.del(captchaId);
      dataRequest.shared = true;
      const note = new Note(dataRequest);
      await note.save();
      res
        .status(200)
        .json({ message: 'Data updated successfully', data: note });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Exception caught' });
    }
  }

  // async updateNote(req, res) {
  //   try {
  //     const dataRequest = req.body;
  //     if (!dataRequest.slug) {
  //       return res.status(400).json({ message: 'Slug is required' });
  //     }
  //     const slug = slugify(dataRequest.slug);
  //     const updateNote = await Note.findOneAndUpdate({ slug }, dataRequest, {
  //       runValidators: true,
  //       upsert: false,
  //       new: false,
  //     });
  //     if (!updateNote) {
  //       return res.status(404).json({ message: 'Note not found' });
  //     }
  //     res
  //       .status(200)
  //       .json({ message: 'Data updated successfully', data: updateNote });
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).json({ message: 'Exception caught' });
  //   }
  // }
}

module.exports = new NoteController();
