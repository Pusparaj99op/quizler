"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// Simple logger to avoid the winston dependency
exports.logger = {
    info: (message) => {
        console.log(`[INFO] ${message}`);
    },
    error: (message) => {
        console.error(`[ERROR] ${message}`);
    },
    warn: (message) => {
        console.warn(`[WARN] ${message}`);
    },
    debug: (message) => {
        console.debug(`[DEBUG] ${message}`);
    }
};
