import { useState } from 'react';
import { quizService } from '../services/quiz.service';
import { Quiz } from '../types/quiz.types';

interface Response {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

// Helper function to map quiz data from service to Quiz type
const mapServiceQuizToQuizType = (quiz: any): Quiz => {
  return {
    _id: quiz._id || quiz.id || '',
    id: quiz.id || quiz._id || '',
    title: quiz.title || '',
    description: quiz.description || '',
    questions: Array.isArray(quiz.questions) ? quiz.questions : [],
    createdBy: quiz.createdBy || '',
    createdAt: quiz.createdAt || new Date().toISOString(),
    updatedAt: quiz.updatedAt || new Date().toISOString(),
    duration: quiz.duration || 0,
    totalQuestions: quiz.totalQuestions || (Array.isArray(quiz.questions) ? quiz.questions.length : 0)
  };
};

const useQuiz = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResponse, setQuizResponse] = useState<Response | null>(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzes();
      const mappedQuizzes = Array.isArray(response) ? response.map(mapServiceQuizToQuizType) : [];
      setQuizzes(mappedQuizzes);
      return mappedQuizzes;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quizzes';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizById = async (quizId: string) => {
    setLoading(true);
    try {
      const response = await quizService.getQuizById(quizId);
      const mappedQuiz = mapServiceQuizToQuizType(response);
      setCurrentQuiz(mappedQuiz);
      return mappedQuiz;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quiz';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.createQuiz(quizData);
      const mappedQuiz = mapServiceQuizToQuizType(data);
      setQuizzes(prev => [...prev, mappedQuiz]);
      return mappedQuiz;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create quiz';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async (quizId: string, answers: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await quizService.submitQuizAnswers(quizId, answers);
      setQuizResponse(response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit quiz';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    quizzes,
    currentQuiz,
    quizResponse,
    fetchQuizzes,
    fetchQuizById,
    createQuiz,
    handleSubmitQuiz
  };
};

export { useQuiz };
export default useQuiz;