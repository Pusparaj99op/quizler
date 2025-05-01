import axios, { AxiosError } from 'axios';
import { authService } from './auth.service';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
}

class QuizService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  async getQuizzes(): Promise<Quiz[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/quiz`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to fetch quizzes';
      throw new Error(errorMessage);
    }
  }

  async getQuizById(id: string): Promise<Quiz> {
    try {
      const response = await axios.get(`${this.baseUrl}/quiz/${id}`, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to fetch quiz';
      throw new Error(errorMessage);
    }
  }

  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdBy' | 'createdAt'>): Promise<Quiz> {
    try {
      const response = await axios.post(`${this.baseUrl}/quiz`, quizData, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to create quiz';
      throw new Error(errorMessage);
    }
  }

  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<Quiz> {
    try {
      const response = await axios.put(`${this.baseUrl}/quiz/${id}`, quizData, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to update quiz';
      throw new Error(errorMessage);
    }
  }

  async deleteQuiz(id: string): Promise<boolean> {
    try {
      await axios.delete(`${this.baseUrl}/quiz/${id}`, {
        headers: authService.getAuthHeader()
      });
      return true;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to delete quiz';
      throw new Error(errorMessage);
    }
  }

  async submitQuizAnswers(quizId: string, answers: Record<string, string>): Promise<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/quiz/${quizId}/submit`, { answers }, {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = 
        axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to submit quiz answers';
      throw new Error(errorMessage);
    }
  }
}

export const quizService = new QuizService();
// Add default export for backward compatibility
export default quizService;