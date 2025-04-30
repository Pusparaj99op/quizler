import { Router } from 'express';
import { 
    createQuiz, 
    getQuizzes, 
    getQuizById, 
    updateQuiz, 
    deleteQuiz 
} from '../controllers/quiz.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Route to create a new quiz
router.post('/', authMiddleware, createQuiz);

// Route to get all quizzes
router.get('/', authMiddleware, getQuizzes);

// Route to get a quiz by ID
router.get('/:id', authMiddleware, getQuizById);

// Route to update a quiz by ID
router.put('/:id', authMiddleware, updateQuiz);

// Route to delete a quiz by ID
router.delete('/:id', authMiddleware, deleteQuiz);

export default router;