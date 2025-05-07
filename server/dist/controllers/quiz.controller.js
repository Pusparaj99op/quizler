"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserResponses = exports.submitQuiz = exports.deleteQuiz = exports.updateQuiz = exports.getQuizById = exports.getQuizzes = exports.createQuiz = void 0;
const quiz_service_1 = require("../services/quiz.service");
const createQuiz = async (req, res) => {
    try {
        // @ts-ignore - req.user is added by auth middleware
        const quiz = await quiz_service_1.quizService.createQuiz(req.body, req.user.id);
        res.status(201).json(quiz);
    }
    catch (error) {
        console.error(`Error creating quiz: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createQuiz = createQuiz;
const getQuizzes = async (req, res) => {
    try {
        // @ts-ignore - req.user is added by auth middleware
        const quizzes = await quiz_service_1.quizService.getQuizzes(req.query.all ? undefined : req.user.id);
        res.json(quizzes);
    }
    catch (error) {
        console.error(`Error getting quizzes: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getQuizzes = getQuizzes;
const getQuizById = async (req, res) => {
    try {
        const quiz = await quiz_service_1.quizService.getQuizById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    }
    catch (error) {
        console.error(`Error getting quiz by id: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getQuizById = getQuizById;
const updateQuiz = async (req, res) => {
    try {
        const quiz = await quiz_service_1.quizService.updateQuiz(req.params.id, req.body);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    }
    catch (error) {
        console.error(`Error updating quiz: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateQuiz = updateQuiz;
const deleteQuiz = async (req, res) => {
    try {
        const success = await quiz_service_1.quizService.deleteQuiz(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json({ message: 'Quiz deleted successfully' });
    }
    catch (error) {
        console.error(`Error deleting quiz: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteQuiz = deleteQuiz;
const submitQuiz = async (req, res) => {
    try {
        // @ts-ignore - req.user is added by auth middleware
        const response = await quiz_service_1.quizService.submitQuizResponse(req.body, req.user.id);
        res.status(201).json(response);
    }
    catch (error) {
        console.error(`Error submitting quiz response: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.submitQuiz = submitQuiz;
const getUserResponses = async (req, res) => {
    try {
        // @ts-ignore - req.user is added by auth middleware
        const responses = await quiz_service_1.quizService.getUserResponses(req.user.id);
        res.json(responses);
    }
    catch (error) {
        console.error(`Error getting user responses: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserResponses = getUserResponses;
