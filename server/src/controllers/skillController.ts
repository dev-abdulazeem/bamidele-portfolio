import { Request, Response, NextFunction } from 'express';
import Skill from '../models/Skill';
import { AppError } from '../utils/errorHandler';

export const getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skills = await Skill.findAll({
      order: [['category', 'ASC'], ['proficiency', 'DESC']] as any
    });

    res.status(200).json({
      success: true,
      skills
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.params;
    const skills = await Skill.findAll({
      where: { category },
      order: [['proficiency', 'DESC']] as any
    });

    res.status(200).json({
      success: true,
      skills
    });
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      skill
    });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skill = await Skill.findByPk(String(req.params.id));
    if (!skill) {
      return next(new AppError('Skill not found', 404));
    }

    await skill.update(req.body);

    res.status(200).json({
      success: true,
      skill
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skill = await Skill.findByPk(String(req.params.id));
    if (!skill) {
      return next(new AppError('Skill not found', 404));
    }

    await skill.destroy();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};