const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: [
      'jpeg',
      'jpeg',
      'png',
      'svg',
      'gif',
      'bmp',
      'tiff',
      'heif',
      'heic',
      'webp',
      'mov',
      'mp4',
      'mpeg',
    ],
    folder: 'more-than-words',
  },
});

module.exports = multer({ storage });
