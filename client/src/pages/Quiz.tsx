import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuizContext } from '../contexts/QuizContext';
import Question from '../components/quiz/Question';
import Timer from '../components/quiz/Timer';
import QuizCard from '../components/quiz/QuizCard';
import { Quiz as QuizType, Question as QuestionType } from '../types/quiz.types';
import quizService from '../services/quiz.service';

// Helper function to map quiz service response to Quiz type
const mapServiceQuizToQuizType = (quiz: any): QuizType => {
  return {
    _id: quiz._id || quiz.id || '',
    id: quiz.id || quiz._id || '',
    title: quiz.title || '',
    description: quiz.description || '',
    questions: Array.isArray(quiz.questions) ? quiz.questions : [],
    createdBy: quiz.createdBy || '',
    createdAt: quiz.createdAt || new Date().toISOString(),
    updatedAt: quiz.updatedAt || new Date().toISOString(),
    duration: quiz.duration || 30, // Default duration of 30 minutes
    totalQuestions: quiz.totalQuestions || (Array.isArray(quiz.questions) ? quiz.questions.length : 0)
  };
};

const Quiz: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { state, setCurrentQuiz } = useQuizContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                // Fix: handle potentially undefined id by providing a fallback
                if (!id) {
                    throw new Error("Quiz ID is missing");
                }
                const quizData = await quizService.getQuizById(id);
                // Map the service response to match the Quiz type
                const mappedQuiz = mapServiceQuizToQuizType(quizData);
                setCurrentQuiz(mappedQuiz);
                setLoading(false);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz';
                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchQuiz();
        
        return () => {
            // Clean up
            setCurrentQuiz(null);
        };
    }, [id, setCurrentQuiz]);

    const handleTimeUp = () => {
        // Handle time up logic
        console.log('Time is up!');
    };

    const handleAnswer = (answer: string) => {
        // Handle answer selection
        console.log('Selected answer:', answer);
        // Move to next question
        if (state.currentQuiz && currentQuestionIndex < state.currentQuiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading quiz...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

    if (!state.currentQuiz) {
        return <div className="text-center p-8">Quiz not found</div>;
    }

    const currentQuestion = state.currentQuiz.questions[currentQuestionIndex];

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <QuizCard
                    quiz={state.currentQuiz}
                    id={state.currentQuiz.id || state.currentQuiz._id}
                    title={state.currentQuiz.title}
                    description={state.currentQuiz.description}
                    createdAt={state.currentQuiz.createdAt}
                    totalQuestions={state.currentQuiz.questions.length}
                    duration={state.currentQuiz.duration}
                />
                
                <div className="mt-6">
                    <Timer 
                        duration={state.currentQuiz.duration} 
                        onTimeUp={handleTimeUp} 
                    />
                </div>
                
                {currentQuestion && (
                    <div className="mt-8">
                        <Question
                            question={currentQuestion}
                            onAnswer={handleAnswer}
                        />
                    </div>
                )}
                
                <div className="mt-6 text-center">
                    <p>Question {currentQuestionIndex + 1} of {state.currentQuiz.questions.length}</p>
                </div>
            </div>
        </div>
    );
};

export default Quiz;