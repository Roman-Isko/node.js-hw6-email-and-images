import express from 'express';
import createHttpError from 'http-errors';
import upload from '../middlewares/upload.js';
import cloudinary from '../services/cloudinary.js';
import streamifier from 'streamifier';
import Contact from '../models/Contacts.js';

const router = express.Router();

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'contacts_photos' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

// POST /contacts
router.post('/', upload.single('photo'), async (req, res, next) => {
  try {
    const { body, file } = req;

    const contactData = { ...body };

    if (file) {
      const result = await uploadToCloudinary(file.buffer);
      contactData.photo = result.secure_url;
    }

    const created = await Contact.create(contactData);

    res.status(201).json({
      status: 201,
      message: 'Contact created',
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /contacts/:contactId
router.patch('/:contactId', upload.single('photo'), async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body, file } = req;

    const contact = await Contact.findById(contactId);
    if (!contact) throw createHttpError(404, 'Contact not found');

    if (file) {
      const result = await uploadToCloudinary(file.buffer);
      body.photo = result.secure_url;
    }

    Object.assign(contact, body);
    await contact.save();

    res.status(200).json({
      status: 200,
      message: 'Contact updated',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
