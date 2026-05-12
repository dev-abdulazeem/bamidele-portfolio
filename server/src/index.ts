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
import sequelize from './config/database';

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 5000;

// ============================================
// ALLOWED ORIGINS
// ============================================
const allowedOrigins = [
  'http://localhost:5173',                              // Local dev
  'https://bamidele-portfolio-theta.vercel.app',        // Production frontend
];

// Optional: add more from env variable (comma-separated)
if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

// ============================================
// CORS
// ============================================
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ============================================
// SECURITY
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================================
// UPLOADS
// ============================================
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

// ============================================
// STATIC FILES
// ============================================
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadDir));

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/experiences', experienceRoutes);

// ============================================
// UPLOAD ROUTE
// ============================================
app.post('/api/upload', protect, upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file received' });
      return;
    }

    // Railway fix: use forwarded headers for correct protocol/host
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host') || `localhost:${PORT}`;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    console.log('✅ Image uploaded:', imageUrl);

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

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bamidele Portfolio API is running!' });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected to Neon');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 Environment: ${process.env.NODE_ENV}`);
      console.log(`📂 Uploads directory: ${uploadDir}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();