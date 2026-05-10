import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import { AppError } from '../utils/errorHandler';

export const createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']] as any
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const message = await Message.findByPk(String(req.params.id));
    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const message = await Message.findByPk(String(req.params.id));
    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    await message.update({ read: true });

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const message = await Message.findByPk(String(req.params.id));
    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    await message.destroy();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};