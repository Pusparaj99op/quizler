import { Request, Response } from 'express';
import User from '../models/user.model';
import { createUser, getUserById, updateUser, deleteUser } from '../services/user.service';

// Controller to handle user-related requests
class UserController {
    // Create a new user
    async register(req: Request, res: Response) {
        try {
            const user = await createUser(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Get user by ID
    async getUser(req: Request, res: Response) {
        try {
            const user = await getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Update user information
    async update(req: Request, res: Response) {
        try {
            const updatedUser = await updateUser(req.params.id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Delete a user
    async delete(req: Request, res: Response) {
        try {
            const result = await deleteUser(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

export default new UserController();