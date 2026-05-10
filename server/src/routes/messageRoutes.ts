import express from 'express';
import {
  createMessage,
  getAllMessages,
  getMessage,
  markAsRead,
  deleteMessage
} from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', createMessage);
router.get('/', protect, getAllMessages);
router.get('/:id', protect, getMessage);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

export default router;