import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';
import { AppError } from '../utils/errorHandler';

export const getAllProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await Project.findAll({
      order: [['createdAt', 'DESC']] as any
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findByPk(String(req.params.id));
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findByPk(String(req.params.id));
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    await project.update(req.body);

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findByPk(String(req.params.id));
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await Project.findAll({
      where: { featured: true },
      order: [['createdAt', 'DESC']] as any
    });

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    next(error);
  }
};