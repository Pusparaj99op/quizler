import React from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { QuestionType } from '../../types/quiz.types';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer }) => {
  const { currentQuestionIndex } = useQuiz();

  const handleAnswer = (answer: string) => {
    onAnswer(answer);
  };

  return (
    <div className="question-container">
      <h2 className="question-title">
        Question {currentQuestionIndex + 1}: {question.text}
      </h2>
      <div className="options">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;