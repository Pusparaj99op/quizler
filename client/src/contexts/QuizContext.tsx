import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Quiz } from '../types/quiz.types';

// Define state type
interface QuizState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  currentQuiz: Quiz | null;
}

// Define action types
type QuizAction = 
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'REMOVE_QUIZ'; payload: string }
  | { type: 'UPDATE_QUIZ'; payload: Quiz }
  | { type: 'SET_QUIZZES'; payload: Quiz[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_QUIZ'; payload: Quiz | null };

// Define reducer
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'ADD_QUIZ':
      return {
        ...state,
        quizzes: [...state.quizzes, action.payload]
      };
    case 'REMOVE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.filter(quiz => quiz.id !== action.payload)
      };
    case 'UPDATE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.map(quiz => 
          quiz.id === action.payload.id ? action.payload : quiz
        )
      };
    case 'SET_QUIZZES':
      return {
        ...state,
        quizzes: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'SET_CURRENT_QUIZ':
      return {
        ...state,
        currentQuiz: action.payload
      };
    default:
      return state;
  }
};

// Define context type
interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  addQuiz: (quiz: Quiz) => void;
  removeQuiz: (quizId: string) => void;
  updateQuiz: (quiz: Quiz) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
}

// Create context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Initial state
const initialState: QuizState = {
  quizzes: [],
  loading: false,
  error: null,
  currentQuiz: null
};

// Provider component
export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const addQuiz = (quiz: Quiz) => {
    dispatch({ type: 'ADD_QUIZ', payload: quiz });
  };

  const removeQuiz = (quizId: string) => {
    dispatch({ type: 'REMOVE_QUIZ', payload: quizId });
  };

  const updateQuiz = (quiz: Quiz) => {
    dispatch({ type: 'UPDATE_QUIZ', payload: quiz });
  };

  const setCurrentQuiz = (quiz: Quiz | null) => {
    dispatch({ type: 'SET_CURRENT_QUIZ', payload: quiz });
  };

  return (
    <QuizContext.Provider value={{ state, dispatch, addQuiz, removeQuiz, updateQuiz, setCurrentQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

// Context hook
export const useQuizContext = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};