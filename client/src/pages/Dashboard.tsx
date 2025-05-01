import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../store/actions';
import QuizCard from '../components/quiz/QuizCard';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const quizzes = useSelector((state: any) => state.quiz.quizzes);
    const loading = useSelector((state: any) => state.quiz.loading);

    useEffect(() => {
        dispatch(fetchQuizzes());
    }, [dispatch]);

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    {loading ? (
                        <p>Loading quizzes...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quizzes && quizzes.length > 0 ? (
                                quizzes.map((quiz: any) => (
                                    <QuizCard key={quiz.id || quiz._id} quiz={quiz} />
                                ))
                            ) : (
                                <p>No quizzes found. Create your first quiz!</p>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;