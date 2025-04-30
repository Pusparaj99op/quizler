import { Router } from 'express';
import { 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser, 
    getAllUsers 
} from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Route to create a new user
router.post('/', authMiddleware, createUser);

// Route to get a user by ID
router.get('/:id', authMiddleware, getUserById);

// Route to update a user
router.put('/:id', authMiddleware, updateUser);

// Route to delete a user
router.delete('/:id', authMiddleware, deleteUser);

// Route to get all users
router.get('/', authMiddleware, getAllUsers);

export default router;