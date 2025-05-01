// Simple validators without external dependency

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password (at least 6 characters)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Validate required field
export const isRequired = (value: string): boolean => {
  return value.trim() !== '';
};

// Validate quiz data
export const validateQuizData = (quizData: any): string[] => {
  const errors: string[] = [];
  
  if (!isRequired(quizData.title)) {
    errors.push('Title is required');
  }
  
  if (!isRequired(quizData.description)) {
    errors.push('Description is required');
  }
  
  if (!quizData.questions || quizData.questions.length === 0) {
    errors.push('At least one question is required');
  } else {
    quizData.questions.forEach((question: any, index: number) => {
      if (!isRequired(question.text)) {
        errors.push(`Question ${index + 1}: Text is required`);
      }
      
      if (!question.options || question.options.length < 2) {
        errors.push(`Question ${index + 1}: At least 2 options are required`);
      }
      
      if (!isRequired(question.correctAnswer)) {
        errors.push(`Question ${index + 1}: Correct answer is required`);
      }
    });
  }
  
  return errors;
};