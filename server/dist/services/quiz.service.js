"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizService = void 0;
const quiz_model_1 = require("../models/quiz.model");
exports.quizService = {
    createQuiz: async (quizData, userId) => {
        const newQuiz = await quiz_model_1.Quiz.create({
            ...quizData,
            createdBy: userId,
        });
        return newQuiz;
    },
    getQuizById: async (id) => {
        return await quiz_model_1.Quiz.findById(id);
    },
    getQuizzes: async (userId) => {
        if (userId) {
            return await quiz_model_1.Quiz.find({ createdBy: userId });
        }
        return await quiz_model_1.Quiz.find();
    },
    updateQuiz: async (id, data) => {
        return await quiz_model_1.Quiz.findByIdAndUpdate(id, data, { new: true });
    },
    deleteQuiz: async (id) => {
        const result = await quiz_model_1.Quiz.findByIdAndDelete(id);
        return !!result;
    },
    submitQuizResponse: async (responseData, userId) => {
        const quiz = await quiz_model_1.Quiz.findById(responseData.quiz);
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        const score = quiz.questions.reduce((total, question, index) => {
            return total + (question.correctAnswer === responseData.answers[index] ? 1 : 0);
        }, 0);
        const response = await quiz_model_1.Response.create({
            quiz: responseData.quiz,
            user: userId,
            answers: responseData.answers,
            score,
        });
        return response;
    },
    getUserResponses: async (userId) => {
        return await quiz_model_1.Response.find({ user: userId }).populate('quiz');
    },
};
exports.default = exports.quizService;
