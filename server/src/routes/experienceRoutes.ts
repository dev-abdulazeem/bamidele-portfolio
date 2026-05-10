import express from 'express';
import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} from '../controllers/experienceController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllExperiences);
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);

export default router;