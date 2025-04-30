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
    correctAnswer?: string | string[]; // single or multiple answers
    mediaUrl?: string; // URL for images, videos, etc.
    timeLimit?: number; // in seconds
}

export interface Option {
    id: string;
    questionId: string;
    optionText: string;
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
    SEQUENCING = 'SEQUENCING',
    // Add more types as needed
}