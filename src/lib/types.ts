export const ROLES = ['student', 'faculty', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ['pending', 'active', 'suspended'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const QUESTION_TYPES = ['mcq', 'multi', 'boolean', 'short'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUIZ_STATUSES = ['draft', 'published', 'closed'] as const;
export type QuizStatus = (typeof QUIZ_STATUSES)[number];

export const ATTEMPT_STATUSES = ['in_progress', 'submitted', 'expired'] as const;
export type AttemptStatus = (typeof ATTEMPT_STATUSES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'Single choice',
  multi: 'Multiple choice',
  boolean: 'True / False',
  short: 'Short answer',
};
