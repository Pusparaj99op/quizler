import { Router } from 'express';
import { register, login, getUserProfile } from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get user profile (protected route)
router.get('/profile', authMiddleware, getUserProfile);

export default router;