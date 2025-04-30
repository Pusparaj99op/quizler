import axios from 'axios';
import { Quiz, QuizResponse } from '../types/quiz.types';
import { API_URL } from './api';

const quizService = {
  createQuiz: async (quizData: Quiz): Promise<QuizResponse> => {
    const response = await axios.post(`${API_URL}/quizzes`, quizData);
    return response.data;
  },

  getQuizzes: async (): Promise<Quiz[]> => {
    const response = await axios.get(`${API_URL}/quizzes`);
    return response.data;
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const response = await axios.get(`${API_URL}/quizzes/${quizId}`);
    return response.data;
  },

  updateQuiz: async (quizId: string, quizData: Quiz): Promise<QuizResponse> => {
    const response = await axios.put(`${API_URL}/quizzes/${quizId}`, quizData);
    return response.data;
  },

  deleteQuiz: async (quizId: string): Promise<void> => {
    await axios.delete(`${API_URL}/quizzes/${quizId}`);
  },

  submitQuizResponse: async (quizId: string, responseData: any): Promise<void> => {
    await axios.post(`${API_URL}/quizzes/${quizId}/responses`, responseData);
  }
};

export default quizService;