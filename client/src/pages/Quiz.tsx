import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QuizContext } from '../contexts/QuizContext';
import Question from '../components/quiz/Question';
import Timer from '../components/quiz/Timer';
import QuizCard from '../components/quiz/QuizCard';

const Quiz = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const { fetchQuiz, quiz, loading, error } = useContext(QuizContext);

    useEffect(() => {
        fetchQuiz(quizId);
    }, [fetchQuiz, quizId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading quiz: {error}</div>;
    }

    return (
        <div className="quiz-container">
            <QuizCard title={quiz.title} description={quiz.description} />
            <Timer duration={quiz.duration} />
            <div className="questions">
                {quiz.questions.map((question, index) => (
                    <Question key={index} question={question} />
                ))}
            </div>
        </div>
    );
};

export default Quiz;