"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = __importDefault(require("./config/env"));
const logger_1 = require("./utils/logger");
// Connect to database
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/quizzes', quiz_routes_1.default);
// Serve static assets in production
if (env_1.default.NODE_ENV === 'production') {
    // Set static folder
    const clientBuildPath = path_1.default.resolve(__dirname, '../../client/dist');
    app.use(express_1.default.static(clientBuildPath));
    // Serve the index.html file for any route not matching API routes
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(clientBuildPath, 'index.html'));
    });
    logger_1.logger.info(`Serving static files from ${clientBuildPath}`);
}
// Error handler
app.use(error_middleware_1.default);
// Start server
const PORT = process.env.PORT || 5001; // Explicitly set to 5001 to avoid conflicts
app.listen(PORT, () => {
    logger_1.logger.info(`Server running in ${env_1.default.NODE_ENV} mode on port ${PORT}`);
});
