"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// Register a new user
router.post('/register', auth_controller_1.register);
// Login user
router.post('/login', auth_controller_1.login);
// Get user profile (protected route)
router.get('/profile', auth_middleware_1.default, auth_controller_1.getUserProfile);
exports.default = router;
