import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import QuizCard from '../components/quiz/QuizCard';
import Sidebar from '../components/layout/Sidebar';
import { useQuiz } from '../hooks/useQuiz';
import { Quiz } from '../types/quiz.types';

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const { fetchQuizzes } = useQuiz();

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                setLoading(true);
                const fetchedQuizzes = await fetchQuizzes();
                if (fetchedQuizzes) {
                    setQuizzes(fetchedQuizzes);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load quizzes';
                setError(errorMessage);
                console.error('Error loading quizzes:', err);
            } finally {
                setLoading(false);
            }
        };

        loadQuizzes();
    }, [fetchQuizzes]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    {loading ? (
                        <p className="text-gray-600">Loading quizzes...</p>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p>Error: {error}</p>
                            <p className="text-sm mt-2">Please try refreshing the page or check your network connection.</p>
                        </div>
                    ) : quizzes && quizzes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quizzes.map((quiz) => (
                                <QuizCard key={quiz.id || quiz._id} quiz={quiz} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-center">
                            <p className="text-gray-700">No quizzes found. Create your first quiz!</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;