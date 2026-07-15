import express, { Request, Response } from 'express';
import { protect } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Extend Request inline for this file only
interface AuthenticatedRequest extends Request {
  user?: {
    id: number | string;
    email: string;
    role?: string;
  };
}

router.get('/me', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;