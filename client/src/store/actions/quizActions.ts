import { Dispatch } from 'redux';
import { quizService } from '../../services/quiz.service';

// Action types
export const FETCH_QUIZZES_REQUEST = 'FETCH_QUIZZES_REQUEST';
export const FETCH_QUIZZES_SUCCESS = 'FETCH_QUIZZES_SUCCESS';
export const FETCH_QUIZZES_FAILURE = 'FETCH_QUIZZES_FAILURE';

export const CREATE_QUIZ_REQUEST = 'CREATE_QUIZ_REQUEST';
export const CREATE_QUIZ_SUCCESS = 'CREATE_QUIZ_SUCCESS';
export const CREATE_QUIZ_FAILURE = 'CREATE_QUIZ_FAILURE';

// Action creators
export const fetchQuizzes = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: FETCH_QUIZZES_REQUEST });
      const quizzes = await quizService.getQuizzes();
      dispatch({ type: FETCH_QUIZZES_SUCCESS, payload: quizzes });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quizzes';
      dispatch({ type: FETCH_QUIZZES_FAILURE, payload: errorMessage });
    }
  };
};

export const createQuiz = (quizData: any) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: CREATE_QUIZ_REQUEST });
      const newQuiz = await quizService.createQuiz(quizData);
      dispatch({ type: CREATE_QUIZ_SUCCESS, payload: newQuiz });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create quiz';
      dispatch({ type: CREATE_QUIZ_FAILURE, payload: errorMessage });
    }
  };
};