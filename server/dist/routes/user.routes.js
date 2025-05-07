"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.use(auth_middleware_1.default);
// Admin routes
router.get('/', user_controller_1.getAllUsers);
router.post('/', user_controller_1.createUser);
// User specific routes
router.get('/:id', user_controller_1.getUserById);
router.put('/:id', user_controller_1.updateUser);
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
