import { Request, Response } from 'express';
import { quizService } from '../services/quiz.service';

export const createQuiz = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is added by auth middleware
    const quiz = await quizService.createQuiz(req.body, req.user.id);
    res.status(201).json(quiz);
  } catch (error) {
    console.error(`Error creating quiz: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is added by auth middleware
    const quizzes = await quizService.getQuizzes(req.query.all ? undefined : req.user.id);
    res.json(quizzes);
  } catch (error) {
    console.error(`Error getting quizzes: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error(`Error getting quiz by id: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await quizService.updateQuiz(req.params.id, req.body);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error(`Error updating quiz: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const success = await quizService.deleteQuiz(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(`Error deleting quiz: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is added by auth middleware
    const response = await quizService.submitQuizResponse(req.body, req.user.id);
    res.status(201).json(response);
  } catch (error) {
    console.error(`Error submitting quiz response: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserResponses = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is added by auth middleware
    const responses = await quizService.getUserResponses(req.user.id);
    res.json(responses);
  } catch (error) {
    console.error(`Error getting user responses: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
};