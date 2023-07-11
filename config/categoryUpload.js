import cloudinaryPackage from 'cloudinary';
import multer from 'multer';
const cloudinary = cloudinaryPackage.v2;
import dotenv from 'dotenv';
dotenv.config();

import { CloudinaryStorage } from 'multer-storage-cloudinary';

//configure cloudianry
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});
//CREATE STORAGE engine for multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png', 'jpeg'],
  params: {
    folder: 'Project-Beers',
  },
});

const categoryFileUpload = multer({ storage: storage });

export default categoryFileUpload;
