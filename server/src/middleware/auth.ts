import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/errorHandler';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check Bearer token in header (what your frontend sends)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Fallback: check cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Not authorized, no token', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role']
    });

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return next(new AppError('Not authorized, invalid token', 401));
  }
};