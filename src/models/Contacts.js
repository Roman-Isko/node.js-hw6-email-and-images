// import mongoose from 'mongoose';

// const contactSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//     },
//     phone: {
//       type: String,
//       required: [true, 'Phone number is required'],
//     },
//     isFavourite: {
//       type: Boolean,
//       default: false,
//     },
//     contactType: {
//       type: String,
//       enum: ['personal', 'work', 'other'],
//       default: 'personal',
//     },
//   },
//   { timestamps: true },
// );

// const Contact = mongoose.model('Contact', contactSchema);
// export default Contact;

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['personal', 'work', 'other'],
      default: 'personal',
    },
    // 👇 нове поле для Cloudinary
    photo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
