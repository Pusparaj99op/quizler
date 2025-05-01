import { Router } from 'express';
import { 
  createQuiz, 
  getQuizzes, 
  getQuizById, 
  updateQuiz, 
  deleteQuiz,
  submitQuiz,
  getUserResponses
} from '../controllers/quiz.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Protected routes - require authentication
router.use(authMiddleware);

// Quiz routes
router.post('/', createQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

// Quiz response routes
router.post('/submit', submitQuiz);
router.get('/responses/user', getUserResponses);

export default router;