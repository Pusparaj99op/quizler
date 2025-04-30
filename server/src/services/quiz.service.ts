import { Quiz } from '../models/quiz.model';
import { Response } from '../models/response.model';
import { User } from '../models/user.model';
import { QuizData, QuizResponse } from '../types/quiz.types';

class QuizService {
    async createQuiz(quizData: QuizData): Promise<Quiz> {
        const quiz = new Quiz(quizData);
        return await quiz.save();
    }

    async getQuizById(quizId: string): Promise<Quiz | null> {
        return await Quiz.findById(quizId).populate('questions');
    }

    async getAllQuizzes(): Promise<Quiz[]> {
        return await Quiz.find().populate('questions');
    }

    async updateQuiz(quizId: string, quizData: Partial<QuizData>): Promise<Quiz | null> {
        return await Quiz.findByIdAndUpdate(quizId, quizData, { new: true });
    }

    async deleteQuiz(quizId: string): Promise<Quiz | null> {
        return await Quiz.findByIdAndDelete(quizId);
    }

    async submitResponse(quizId: string, userId: string, responseData: QuizResponse): Promise<Response> {
        const response = new Response({
            quiz: quizId,
            user: userId,
            answers: responseData.answers,
            score: responseData.score,
        });
        return await response.save();
    }

    async getResponsesForQuiz(quizId: string): Promise<Response[]> {
        return await Response.find({ quiz: quizId }).populate('user');
    }
}

export const quizService = new QuizService();