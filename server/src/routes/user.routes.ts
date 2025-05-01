import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  createUser 
} from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Protected routes - require authentication
router.use(authMiddleware);

// Admin routes
router.get('/', getAllUsers);
router.post('/', createUser);

// User specific routes
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;