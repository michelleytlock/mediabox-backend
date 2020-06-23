const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer'); //allows us to read paths to files, otherwise, could only read inputs

cloudinary.config({
  cloud_name: 'michelleytlock',
  api_key: '256443765661585',
  api_secret: 'LrvFXHoI-XhJ3-bM3gWata06qzI'
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'mediabox-assets', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  // params: { resource_type: 'raw' }, => this is in case you want to upload other type of files, not just images
  filename: function (req, res, cb) {
    cb(null, res.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

module.exports = multer({ storage });