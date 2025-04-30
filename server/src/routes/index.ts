import { Router } from 'express';
import authRoutes from './auth.routes';
import quizRoutes from './quiz.routes';
import userRoutes from './user.routes';

const router = Router();

// Mounting the routes
router.use('/auth', authRoutes);
router.use('/quizzes', quizRoutes);
router.use('/users', userRoutes);

export default router;