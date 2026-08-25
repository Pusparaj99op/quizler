'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import { requireUser } from '@/lib/guards';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { gradeAttempt, type GradableQuestion } from '@/lib/scoring';
import { availability } from '@/lib/quiz-window';

export interface ActionResult {
  error?: string;
}

const toGradable = (questions: { _id: mongoose.Types.ObjectId; type: string; correctAnswers: string[]; points: number }[]): GradableQuestion[] =>
  questions.map((question) => ({
    id: question._id.toString(),
    type: question.type as GradableQuestion['type'],
    correctAnswers: question.correctAnswers,
    points: question.points,
  }));

/**
 * Finds a live attempt or creates one. The deadline is written here, on the server,
 * so a client cannot extend its own time by tampering with the countdown.
 */
export async function startAttemptAction(quizId: string): Promise<ActionResult> {
  const user = await requireUser();

  if (!mongoose.isValidObjectId(quizId)) return { error: 'Quiz not found' };

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return { error: 'Quiz not found' };

  if (availability(quiz) !== 'open') {
    return { error: 'This quiz is not open for attempts right now.' };
  }

  const existing = await Attempt.findOne({
    quiz: quiz._id,
    student: user.id,
    status: 'in_progress',
  });
  if (existing) redirect(`/quiz/${quizId}`);

  const used = await Attempt.countDocuments({
    quiz: quiz._id,
    student: user.id,
    status: { $ne: 'in_progress' },
  });
  if (used >= quiz.maxAttempts) {
    return { error: `You have used all ${quiz.maxAttempts} attempt(s) for this quiz.` };
  }

  const startedAt = new Date();
  let expiresAt = new Date(startedAt.getTime() + quiz.durationMinutes * 60_000);
  // A late start must never let an attempt run past the quiz's own closing time.
  if (quiz.closesAt && quiz.closesAt < expiresAt) expiresAt = quiz.closesAt;

  await Attempt.create({
    quiz: quiz._id,
    student: user.id,
    answers: [],
    maxScore: quiz.questions.reduce((sum, question) => sum + question.points, 0),
    startedAt,
    expiresAt,
    status: 'in_progress',
  });

  redirect(`/quiz/${quizId}`);
}

/** Autosave. Silently no-ops on an expired attempt; submission handles the grading. */
export async function saveAnswerAction(
  attemptId: string,
  questionId: string,
  values: string[]
): Promise<ActionResult> {
  const user = await requireUser();

  if (!mongoose.isValidObjectId(attemptId)) return { error: 'Attempt not found' };

  const attempt = await Attempt.findOne({
    _id: attemptId,
    student: user.id,
    status: 'in_progress',
  });
  if (!attempt) return { error: 'This attempt is no longer open.' };
  if (attempt.expiresAt.getTime() <= Date.now()) return { error: 'Time is up.' };

  const existing = attempt.answers.find((answer) => answer.questionId === questionId);
  if (existing) {
    existing.values = values;
  } else {
    attempt.answers.push({ questionId, values });
  }

  await attempt.save();
  return {};
}

/**
 * Grades and closes an attempt. `expired` is set by the client when its timer runs
 * out, but the server clamps to its own deadline either way.
 */
export async function submitAttemptAction(attemptId: string): Promise<ActionResult> {
  const user = await requireUser();

  if (!mongoose.isValidObjectId(attemptId)) return { error: 'Attempt not found' };

  const attempt = await Attempt.findOne({ _id: attemptId, student: user.id });
  if (!attempt) return { error: 'Attempt not found' };

  if (attempt.status !== 'in_progress') {
    redirect(`/results/${attemptId}`);
  }

  const quiz = await Quiz.findById(attempt.quiz);
  if (!quiz) return { error: 'The quiz this attempt belongs to no longer exists.' };

  // Grace period absorbs clock skew and the round trip; beyond it the attempt is late.
  const late = Date.now() > attempt.expiresAt.getTime() + 5_000;

  const breakdown = gradeAttempt(
    toGradable(quiz.questions),
    attempt.answers.map((answer) => ({
      questionId: answer.questionId,
      values: answer.values,
    }))
  );

  attempt.score = breakdown.score;
  attempt.maxScore = breakdown.maxScore;
  attempt.status = late ? 'expired' : 'submitted';
  attempt.submittedAt = new Date();
  await attempt.save();

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/history');
  redirect(`/results/${attemptId}`);
}

/** Resolves a six-character join code to a quiz and starts the attempt. */
export async function joinByCodeAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireUser();

  const code = String(formData.get('joinCode') ?? '').trim().toUpperCase();
  if (!code) return { error: 'Enter a join code.' };

  const quiz = await Quiz.findOne({ joinCode: code });
  if (!quiz) return { error: 'No quiz found with that code.' };

  return startAttemptAction(quiz._id.toString());
}

/** Form-shaped wrapper around `startAttemptAction` for use with `useActionState`. */
export async function startAttemptFormAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  return startAttemptAction(String(formData.get('quizId') ?? ''));
}
