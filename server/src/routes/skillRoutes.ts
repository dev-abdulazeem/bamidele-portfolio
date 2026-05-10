import express from 'express';
import {
  getAllSkills,
  getSkillsByCategory,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllSkills);
router.get('/category/:category', getSkillsByCategory);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router;