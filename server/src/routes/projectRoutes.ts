import express from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects
} from '../controllers/projectController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProject);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;