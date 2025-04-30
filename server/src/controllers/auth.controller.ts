import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { generateToken } from '../utils/tokenGenerator';
import { validateRegistration, validateLogin } from '../utils/validators';

class AuthController {
    async register(req: Request, res: Response) {
        const { username, email, password } = req.body;

        const { error } = validateRegistration(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: 'User already exists' });

            const user = await AuthService.createUser({ username, email, password });
            const token = generateToken(user._id);
            res.status(201).json({ user, token });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        try {
            const user = await AuthService.authenticateUser(email, password);
            if (!user) return res.status(401).json({ message: 'Invalid credentials' });

            const token = generateToken(user._id);
            res.status(200).json({ user, token });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }

    async getUserProfile(req: Request, res: Response) {
        try {
            const user = await User.findById(req.userId).select('-password');
            if (!user) return res.status(404).json({ message: 'User not found' });

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    }
}

export const authController = new AuthController();