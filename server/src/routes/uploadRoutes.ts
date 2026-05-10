import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { protect } from '../middleware/auth';

const router = express.Router();

console.log('🔧 UPLOAD ROUTE LOADED');

// Check env vars
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ MISSING');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ MISSING');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ MISSING');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio-projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  } as any,
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log('📁 File received:', file.originalname, file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed') as any, false);
    }
  },
});

router.post('/', protect, (req: Request, res: Response, next: any) => {
  console.log('📥 Upload request received');
  console.log('Auth header:', req.headers.authorization ? '✅ Present' : '❌ Missing');
  
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      console.error('❌ Multer/Cloudinary error:', err.message);
      return res.status(500).json({ 
        success: false, 
        message: err.message,
        error: err.stack 
      });
    }
    
    if (!req.file) {
      console.error('❌ No file in request');
      return res.status(400).json({ 
        success: false, 
        message: 'No file received' 
      });
    }

    const file = req.file as any;
    console.log('✅ Upload success:', file.path);
    
    res.status(200).json({
      success: true,
      url: file.path,
    });
  });
});

export default router;