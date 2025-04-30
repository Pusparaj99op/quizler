import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizState, QuizAction, quizReducer } from '../store/reducers/quizReducer';
import { Quiz } from '../types/quiz.types';

interface QuizContextProps {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  addQuiz: (quiz: Quiz) => void;
  removeQuiz: (quizId: string) => void;
  updateQuiz: (quiz: Quiz) => void;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, { quizzes: [] });

  const addQuiz = (quiz: Quiz) => {
    dispatch({ type: 'ADD_QUIZ', payload: quiz });
  };

  const removeQuiz = (quizId: string) => {
    dispatch({ type: 'REMOVE_QUIZ', payload: quizId });
  };

  const updateQuiz = (quiz: Quiz) => {
    dispatch({ type: 'UPDATE_QUIZ', payload: quiz });
  };

  return (
    <QuizContext.Provider value={{ state, dispatch, addQuiz, removeQuiz, updateQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = (): QuizContextProps => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};