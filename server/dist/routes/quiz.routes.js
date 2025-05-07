"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_controller_1 = require("../controllers/quiz.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.use(auth_middleware_1.default);
// Quiz routes
router.post('/', quiz_controller_1.createQuiz);
router.get('/', quiz_controller_1.getQuizzes);
router.get('/:id', quiz_controller_1.getQuizById);
router.put('/:id', quiz_controller_1.updateQuiz);
router.delete('/:id', quiz_controller_1.deleteQuiz);
// Quiz response routes
router.post('/submit', quiz_controller_1.submitQuiz);
router.get('/responses/user', quiz_controller_1.getUserResponses);
exports.default = router;
