import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { validateRegistration, validateLogin } from '../middleware/validators';

const router = Router();

// Route for user registration
router.post('/register', validateRegistration, register);

// Route for user login
router.post('/login', validateLogin, login);

// Route for user logout
router.post('/logout', logout);

export default router;