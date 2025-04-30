import { Request, Response } from 'express';
import QuizService from '../services/quiz.service';
import { Quiz } from '../models/quiz.model';
import { validateQuiz } from '../utils/validators';

class QuizController {
    async createQuiz(req: Request, res: Response) {
        try {
            const { error } = validateQuiz(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const quiz = await QuizService.createQuiz(req.body);
            res.status(201).json(quiz);
        } catch (err) {
            res.status(500).send('Server error');
        }
    }

    async getQuizzes(req: Request, res: Response) {
        try {
            const quizzes = await QuizService.getAllQuizzes();
            res.status(200).json(quizzes);
        } catch (err) {
            res.status(500).send('Server error');
        }
    }

    async getQuizById(req: Request, res: Response) {
        try {
            const quiz = await QuizService.getQuizById(req.params.id);
            if (!quiz) return res.status(404).send('Quiz not found');
            res.status(200).json(quiz);
        } catch (err) {
            res.status(500).send('Server error');
        }
    }

    async updateQuiz(req: Request, res: Response) {
        try {
            const { error } = validateQuiz(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const updatedQuiz = await QuizService.updateQuiz(req.params.id, req.body);
            if (!updatedQuiz) return res.status(404).send('Quiz not found');
            res.status(200).json(updatedQuiz);
        } catch (err) {
            res.status(500).send('Server error');
        }
    }

    async deleteQuiz(req: Request, res: Response) {
        try {
            const deletedQuiz = await QuizService.deleteQuiz(req.params.id);
            if (!deletedQuiz) return res.status(404).send('Quiz not found');
            res.status(204).send();
        } catch (err) {
            res.status(500).send('Server error');
        }
    }
}

export default new QuizController();