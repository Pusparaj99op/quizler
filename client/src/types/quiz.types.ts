export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  duration: number; // in seconds
  isPublished: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: QuestionType;
  options?: Option[];
  correctAnswer: string | string[]; // single or multiple correct answers
  mediaUrl?: string; // URL for any associated media
  timeLimit?: number; // time limit for this question in seconds
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
  SHORT_ANSWER = 'SHORT_ANSWER',
  CODE_EXECUTION = 'CODE_EXECUTION',
  DIAGRAM_ANNOTATION = 'DIAGRAM_ANNOTATION',
  // Add more question types as needed
}

export interface QuizResponse {
  quizId: string;
  userId: string;
  answers: Answer[];
  score: number;
  submittedAt: Date;
}

export interface Answer {
  questionId: string;
  selectedOptions: string[]; // selected option IDs
  responseText?: string; // for text-based answers
}