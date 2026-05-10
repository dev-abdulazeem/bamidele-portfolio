import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new AppError(message.join(', '), 400);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
};