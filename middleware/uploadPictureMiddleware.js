const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const dotenv = require('dotenv')
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,     
  api_key: process.env.CLOUDINARY_API_KEY,         
  api_secret:process.env.CLOUDINARY_API_SECRET     
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images', 
  allowedFormats: ['jpg', 'jpeg', 'png'],
});

const uploadPicture = multer({
  storage: storage,
//   fileFilter: function(req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     // if (ext !== 'png' && ext !== 'jpeg' && ext !== 'jpg') {
//     //   return cb(new Error('Only images are allowed'));
//     // }
//     return cb(null, true);
//   }
});

module.exports = { uploadPicture };