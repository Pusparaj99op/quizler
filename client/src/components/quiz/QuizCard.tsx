import React from 'react';
import { Link } from 'react-router-dom';

interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  totalQuestions: number;
  duration: number; // in minutes
}

const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  description,
  createdAt,
  totalQuestions,
  duration,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <p className="text-gray-500">
        Created on: {new Date(createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-500">
        Total Questions: {totalQuestions} | Duration: {duration} minutes
      </p>
      <Link to={`/quiz/${id}`} className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
        Start Quiz
      </Link>
    </div>
  );
};

export default QuizCard;