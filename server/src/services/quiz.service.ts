import { Quiz, Response } from '../models/quiz.model';
import { User } from '../models/user.model';
import { QuizData, QuizResponse, IQuiz, IResponse } from '../types/quiz.types';

export const quizService = {
  createQuiz: async (quizData: QuizData, userId: string): Promise<IQuiz> => {
    const newQuiz = await Quiz.create({
      ...quizData,
      createdBy: userId,
    });
    return newQuiz;
  },

  getQuizById: async (id: string): Promise<IQuiz | null> => {
    return await Quiz.findById(id);
  },

  getQuizzes: async (userId?: string): Promise<IQuiz[]> => {
    if (userId) {
      return await Quiz.find({ createdBy: userId });
    }
    return await Quiz.find();
  },

  updateQuiz: async (id: string, data: Partial<QuizData>): Promise<IQuiz | null> => {
    return await Quiz.findByIdAndUpdate(id, data, { new: true });
  },

  deleteQuiz: async (id: string): Promise<boolean> => {
    const result = await Quiz.findByIdAndDelete(id);
    return !!result;
  },

  submitQuizResponse: async (
    responseData: QuizResponse,
    userId: string
  ): Promise<IResponse> => {
    const quiz = await Quiz.findById(responseData.quiz);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    const score = quiz.questions.reduce((total, question, index) => {
      return total + (question.correctAnswer === responseData.answers[index] ? 1 : 0);
    }, 0);

    const response = await Response.create({
      quiz: responseData.quiz,
      user: userId,
      answers: responseData.answers,
      score,
    });

    return response;
  },

  getUserResponses: async (userId: string): Promise<IResponse[]> => {
    return await Response.find({ user: userId }).populate('quiz');
  },
};

export default quizService;