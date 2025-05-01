// This file contains action creators for Redux. 

import { Dispatch } from 'redux';
import { AuthActionTypes, AuthAction } from '../../types/auth.types';
import { QuizActionTypes, QuizAction } from '../../types/quiz.types';
import { authService } from '../../services/auth.service';
import { quizService } from '../../services/quiz.service';

// Auth Actions
export const loginUser = (credentials: { email: string; password: string }) => {
    return async (dispatch: Dispatch<AuthAction>) => {
        try {
            const user = await authService.login(credentials);
            dispatch({ type: AuthActionTypes.LOGIN_SUCCESS, payload: user });
        } catch (error: any) {
            dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: error.message || 'Login failed' });
        }
    };
};

export const registerUser = (userData: { name: string; email: string; password: string }) => {
    return async (dispatch: Dispatch<AuthAction>) => {
        try {
            const user = await authService.register(userData);
            dispatch({ type: AuthActionTypes.REGISTER_SUCCESS, payload: user });
        } catch (error: any) {
            dispatch({ type: AuthActionTypes.REGISTER_FAILURE, payload: error.message || 'Registration failed' });
        }
    };
};

// Quiz Actions
export const fetchQuizzes = () => {
    return async (dispatch: Dispatch<QuizAction>) => {
        try {
            const quizzes = await quizService.getQuizzes();
            dispatch({ type: QuizActionTypes.FETCH_QUIZZES_SUCCESS, payload: quizzes });
        } catch (error: any) {
            dispatch({ type: QuizActionTypes.FETCH_QUIZZES_FAILURE, payload: error.message || 'Failed to fetch quizzes' });
        }
    };
};

export const createQuiz = (quizData: any) => {
    return async (dispatch: Dispatch<QuizAction>) => {
        try {
            const newQuiz = await quizService.createQuiz(quizData);
            dispatch({ type: QuizActionTypes.CREATE_QUIZ_SUCCESS, payload: newQuiz });
        } catch (error: any) {
            dispatch({ type: QuizActionTypes.CREATE_QUIZ_FAILURE, payload: error.message || 'Failed to create quiz' });
        }
    };
};