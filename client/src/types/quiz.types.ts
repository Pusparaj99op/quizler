export interface Question {
  id: string;
  text: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  _id: string;
  id: string; // Added for compatibility
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  duration: number; // Added missing property
  totalQuestions: number; // Added missing property
}

export interface Response {
  _id: string;
  quiz: Quiz;
  user: string;
  answers: string[];
  score: number;
  createdAt: string;
}

// Redux action types
export enum QuizActionTypes {
  FETCH_QUIZZES_REQUEST = 'FETCH_QUIZZES_REQUEST',
  FETCH_QUIZZES_SUCCESS = 'FETCH_QUIZZES_SUCCESS',
  FETCH_QUIZZES_FAILURE = 'FETCH_QUIZZES_FAILURE',
  
  FETCH_QUIZ_REQUEST = 'FETCH_QUIZ_REQUEST',
  FETCH_QUIZ_SUCCESS = 'FETCH_QUIZ_SUCCESS',
  FETCH_QUIZ_FAILURE = 'FETCH_QUIZ_FAILURE',
  
  CREATE_QUIZ_REQUEST = 'CREATE_QUIZ_REQUEST',
  CREATE_QUIZ_SUCCESS = 'CREATE_QUIZ_SUCCESS',
  CREATE_QUIZ_FAILURE = 'CREATE_QUIZ_FAILURE',
  
  UPDATE_QUIZ_REQUEST = 'UPDATE_QUIZ_REQUEST',
  UPDATE_QUIZ_SUCCESS = 'UPDATE_QUIZ_SUCCESS',
  UPDATE_QUIZ_FAILURE = 'UPDATE_QUIZ_FAILURE',
  
  DELETE_QUIZ_REQUEST = 'DELETE_QUIZ_REQUEST',
  DELETE_QUIZ_SUCCESS = 'DELETE_QUIZ_SUCCESS',
  DELETE_QUIZ_FAILURE = 'DELETE_QUIZ_FAILURE',
  
  SUBMIT_QUIZ_REQUEST = 'SUBMIT_QUIZ_REQUEST',
  SUBMIT_QUIZ_SUCCESS = 'SUBMIT_QUIZ_SUCCESS',
  SUBMIT_QUIZ_FAILURE = 'SUBMIT_QUIZ_FAILURE'
}

export interface QuizAction {
  type: QuizActionTypes;
  payload?: any;
  error?: any;
}