import { Request, Response, NextFunction } from 'express';
import Experience from '../models/Experience';
import { AppError } from '../utils/errorHandler';

export const getAllExperiences = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experiences = await Experience.findAll({
      order: [['startDate', 'DESC']] as any
    });

    res.status(200).json({
      success: true,
      experiences
    });
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json({
      success: true,
      experience
    });
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experience = await Experience.findByPk(String(req.params.id));
    if (!experience) {
      return next(new AppError('Experience not found', 404));
    }

    await experience.update(req.body);

    res.status(200).json({
      success: true,
      experience
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experience = await Experience.findByPk(String(req.params.id));
    if (!experience) {
      return next(new AppError('Experience not found', 404));
    }

    await experience.destroy();

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};