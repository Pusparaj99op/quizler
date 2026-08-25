import { z } from 'zod';
import { QUESTION_TYPES, ROLES } from './types';

const allowedDomain = () => process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase() ?? '';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address')
  .superRefine((email, ctx) => {
    // Read the env var at parse time so the message names the configured domain.
    const domain = allowedDomain();
    if (domain !== '' && !email.endsWith(`@${domain}`)) {
      ctx.addIssue({
        code: 'custom',
        message: `Use your college email address (@${domain})`,
      });
    }
  });

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  // Admins are never self-registered; they are seeded or promoted by another admin.
  role: z.enum(['student', 'faculty']),
  rollNumber: z.string().trim().max(32).optional().or(z.literal('')),
  department: z.string().trim().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const questionSchema = z
  .object({
    id: z.string().optional(),
    type: z.enum(QUESTION_TYPES),
    text: z.string().trim().min(1, 'Question text is required'),
    options: z.array(z.string().trim()).default([]),
    correctAnswers: z.array(z.string().trim()).default([]),
    points: z.coerce.number().min(0).max(100).default(1),
    explanation: z.string().trim().max(1000).optional().or(z.literal('')),
  })
  .superRefine((question, ctx) => {
    const fail = (message: string, path: string) =>
      ctx.addIssue({ code: 'custom', message, path: [path] });

    if (question.type === 'short') {
      if (question.correctAnswers.filter(Boolean).length === 0) {
        fail('Add at least one accepted answer', 'correctAnswers');
      }
      return;
    }

    const options = question.options.filter(Boolean);
    if (question.type === 'boolean') {
      // Options are fixed for true/false; nothing to validate beyond the answer.
    } else if (options.length < 2) {
      fail('Add at least two options', 'options');
    }

    const chosen = question.correctAnswers.filter(Boolean);
    if (chosen.length === 0) {
      fail('Mark the correct answer', 'correctAnswers');
    }
    if (question.type !== 'multi' && chosen.length > 1) {
      fail('This question type allows only one correct answer', 'correctAnswers');
    }
    const valid = question.type === 'boolean' ? ['true', 'false'] : options;
    if (chosen.some((answer) => !valid.includes(answer))) {
      fail('Correct answers must be one of the options', 'correctAnswers');
    }
  });

export const quizSchema = z.object({
  title: z.string().trim().min(3, 'Title is required').max(140),
  description: z.string().trim().max(2000).default(''),
  course: z.string().trim().optional().or(z.literal('')),
  durationMinutes: z.coerce.number().int().min(1).max(600).default(30),
  maxAttempts: z.coerce.number().int().min(1).max(10).default(1),
  shuffleQuestions: z.coerce.boolean().default(false),
  showResultsImmediately: z.coerce.boolean().default(true),
  opensAt: z.string().optional().or(z.literal('')),
  closesAt: z.string().optional().or(z.literal('')),
  questions: z.array(questionSchema).default([]),
});

export const departmentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  code: z.string().trim().min(2).max(12).toUpperCase(),
});

export const courseSchema = z.object({
  name: z.string().trim().min(2).max(140),
  code: z.string().trim().min(2).max(16).toUpperCase(),
  department: z.string().trim().min(1, 'Choose a department'),
});

export const roleSchema = z.enum(ROLES);

export type RegisterInput = z.infer<typeof registerSchema>;
export type QuizInput = z.infer<typeof quizSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
