import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/errorHandler';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return next(new AppError('User already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // FIXED: Cross-domain cookie settings for Vercel ↔ Railway
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,           // Always true for Railway (HTTPS)
      sameSite: 'none',       // REQUIRED for cross-domain cookies
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    const user = await User.findByPk(String(req.user.id), {
      attributes: ['id', 'email', 'role', 'createdAt']
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};