import { useEffect, useState } from 'react';
import { getQuiz, submitQuiz } from '../services/quiz.service';
import { Quiz, Question, Response } from '../types/quiz.types';

const useQuiz = (quizId: string) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [responses, setResponses] = useState<Response[]>([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const fetchedQuiz = await getQuiz(quizId);
                setQuiz(fetchedQuiz);
            } catch (err) {
                setError('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleResponseChange = (questionId: string, answer: any) => {
        setResponses((prevResponses) => {
            const existingResponseIndex = prevResponses.findIndex(response => response.questionId === questionId);
            if (existingResponseIndex > -1) {
                const updatedResponses = [...prevResponses];
                updatedResponses[existingResponseIndex].answer = answer;
                return updatedResponses;
            }
            return [...prevResponses, { questionId, answer }];
        });
    };

    const submit = async () => {
        try {
            await submitQuiz(quizId, responses);
            // Handle successful submission (e.g., navigate to results page)
        } catch (err) {
            setError('Failed to submit quiz');
        }
    };

    return {
        quiz,
        loading,
        error,
        responses,
        handleResponseChange,
        submit,
    };
};

export default useQuiz;