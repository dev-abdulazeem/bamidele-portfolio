import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import skillRoutes from './routes/skillRoutes';
import messageRoutes from './routes/messageRoutes';
import experienceRoutes from './routes/experienceRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { protect } from './middleware/auth';

dotenv.config();

const app: Application = express();

// IMPORTANT: CORS must come BEFORE other middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware - configure helmet to allow cross-origin resources
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // ← ALLOWS IMAGES FROM DIFFERENT ORIGIN
  crossOriginEmbedderPolicy: false // ← DISABLES COEP THAT BLOCKS IMAGES
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create uploads directory
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure local storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any, false);
    }
  },
});

// Serve uploaded files statically WITH CORS HEADERS
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/experiences', experienceRoutes);

// Upload route — LOCAL STORAGE
app.post('/api/upload', protect, upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file received' });
      return;
    }

    // Build full URL properly
    const protocol = req.protocol;
    const host = req.get('host') || `localhost:${process.env.PORT || 5000}`;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    console.log('✅ Image uploaded:', imageUrl);
    console.log('📁 Saved to:', req.file.path);

    res.status(200).json({
      success: true,
      url: imageUrl,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Upload failed' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bamidele Portfolio API is running!' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV}`);
  console.log(`📂 Uploads directory: ${uploadDir}`);
});