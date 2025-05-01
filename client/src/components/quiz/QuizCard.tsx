import React from 'react';
import { Link } from 'react-router-dom';
import { Quiz } from '../../types/quiz.types';

export interface QuizCardProps {
  quiz: Quiz;
  id?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  totalQuestions?: number;
  duration?: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  quiz, 
  id, 
  title, 
  description, 
  totalQuestions,
  duration 
}) => {
  const quizTitle = title || quiz.title;
  const quizDescription = description || quiz.description;
  const quizId = id || quiz.id || quiz._id;
  const questionCount = totalQuestions || quiz.questions?.length || 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-bold mb-2">{quizTitle}</h3>
      <p className="text-gray-600 mb-4">{quizDescription}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {questionCount} questions
        </span>
        {duration && (
          <span className="text-sm text-gray-500 mx-2">
            {duration} minutes
          </span>
        )}
        <Link
          to={`/quiz/${quizId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Start Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;