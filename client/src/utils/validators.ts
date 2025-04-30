import { isEmail } from 'validator';

export const validateEmail = (email: string): boolean => {
    return isEmail(email);
};

export const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
};

export const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
};

export const validateQuizTitle = (title: string): boolean => {
    return title.length > 0 && title.length <= 100;
};

export const validateQuestionText = (text: string): boolean => {
    return text.length > 0 && text.length <= 500;
};

export const validateAnswerOptions = (options: string[]): boolean => {
    return options.length >= 2 && options.every(option => option.length > 0 && option.length <= 200);
};