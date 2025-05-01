import React from 'react';
import { Question as QuestionType } from '../../types/quiz.types';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: string) => void;
}

interface OptionType {
  id: string;
  text: string;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer }) => {
  const handleAnswerSelection = (answer: string) => {
    onAnswer(answer);
  };

  return (
    <div className="question-container p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {question.questionText || question.text}
      </h2>
      {question.options && (
        <div className="options space-y-2">
          {question.options.map((option, index) => {
            // Handle both string options and object options with id/text properties
            const optionId = typeof option === 'object' && option !== null && 'id' in option
              ? (option as OptionType).id
              : index.toString();
              
            const optionText = typeof option === 'object' && option !== null && 'text' in option
              ? (option as OptionType).text
              : String(option);
              
            return (
              <button
                key={index}
                className="w-full p-3 bg-gray-100 hover:bg-blue-100 rounded-lg text-left"
                onClick={() => handleAnswerSelection(optionId)}
              >
                {optionText}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Question;