import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { verifyToken } from '../utils/jwt';
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

    // DEBUG: Log incoming request
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 URL:', req.originalUrl);
    console.log('🔍 Auth Header:', req.headers.authorization || 'undefined');
    console.log('🔍 Cookies:', JSON.stringify(req.cookies));

    // 1. Check Bearer token in header (for JSON/token-based auth)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ Token from Authorization header');
    }
    // 2. Fallback: check cookie (for cookie-based auth)
    else if (req.cookies?.token) {
      token = req.cookies.token;
      console.log('✅ Token from cookie');
    }

    if (!token) {
      console.log('❌ No token found');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return next(new AppError('Not authorized, no token', 401));
    }

    console.log('📝 Token preview:', token.substring(0, 30) + '...');

    // Verify token
    let decoded: any;
    try {
      decoded = verifyToken(token);
      console.log('✅ Token verified:', { id: decoded.id, email: decoded.email });
    } catch (jwtError: any) {
      console.log('❌ JWT verification failed:', jwtError.message);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return next(new AppError('Not authorized, invalid token', 401));
    }

    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role']
    });

    if (!user) {
      console.log('❌ User not found for id:', decoded.id);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return next(new AppError('User not found', 401));
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    console.log('✅ Auth success:', user.email);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    next();
  } catch (error) {
    console.log('❌ Unexpected auth error:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return next(new AppError('Not authorized, invalid token', 401));
  }
};