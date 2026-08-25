'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';
import { requireRole, canManageQuiz, type SessionUser } from '@/lib/guards';
import { Quiz, generateUniqueJoinCode } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { quizSchema, type QuizInput } from '@/lib/validation';

export interface QuizActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

/** Loads a quiz the caller is allowed to edit, or returns why they cannot. */
async function loadOwnedQuiz(user: SessionUser, quizId: string) {
  if (!mongoose.isValidObjectId(quizId)) return { error: 'Quiz not found' } as const;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return { error: 'Quiz not found' } as const;
  if (!canManageQuiz(user, quiz.createdBy.toString())) {
    return { error: 'You do not have access to this quiz.' } as const;
  }
  return { quiz } as const;
}

/**
 * The editor posts the whole quiz as one JSON payload rather than as many form fields,
 * because questions are a nested, reorderable list.
 */
function parsePayload(formData: FormData) {
  const raw = formData.get('payload');
  if (typeof raw !== 'string') {
    return { error: 'Nothing to save.' } as const;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { error: 'The quiz could not be read. Please reload and try again.' } as const;
  }

  const parsed = quizSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || 'form';
      fieldErrors[key] ??= issue.message;
    }
    return { error: 'Fix the highlighted problems before saving.', fieldErrors } as const;
  }

  return { data: parsed.data } as const;
}

function toDocument(data: QuizInput) {
  return {
    title: data.title,
    description: data.description,
    course: data.course ? new mongoose.Types.ObjectId(data.course) : undefined,
    durationMinutes: data.durationMinutes,
    maxAttempts: data.maxAttempts,
    shuffleQuestions: data.shuffleQuestions,
    showResultsImmediately: data.showResultsImmediately,
    opensAt: data.opensAt ? new Date(data.opensAt) : undefined,
    closesAt: data.closesAt ? new Date(data.closesAt) : undefined,
    questions: data.questions.map((question) => ({
      type: question.type,
      text: question.text,
      options: question.type === 'short' ? [] : question.options.filter(Boolean),
      correctAnswers: question.correctAnswers.filter(Boolean),
      points: question.points,
      explanation: question.explanation || undefined,
    })),
  };
}

export async function createQuizAction(
  _prev: QuizActionState,
  formData: FormData
): Promise<QuizActionState> {
  const user = await requireRole('faculty', 'admin');

  const parsed = parsePayload(formData);
  if ('error' in parsed) return parsed;

  const quiz = await Quiz.create({
    ...toDocument(parsed.data),
    createdBy: user.id,
    status: 'draft',
    joinCode: await generateUniqueJoinCode(),
  });

  revalidatePath('/faculty');
  redirect(`/faculty/quizzes/${quiz._id}/edit`);
}

export async function updateQuizAction(
  _prev: QuizActionState,
  formData: FormData
): Promise<QuizActionState> {
  const user = await requireRole('faculty', 'admin');
  const quizId = String(formData.get('quizId') ?? '');

  const found = await loadOwnedQuiz(user, quizId);
  if ('error' in found) return { error: found.error };

  const parsed = parsePayload(formData);
  if ('error' in parsed) return parsed;

  found.quiz.set(toDocument(parsed.data));
  await found.quiz.save();

  revalidatePath('/faculty');
  revalidatePath(`/faculty/quizzes/${quizId}/edit`);
  return {};
}

/** Publish / close / reopen. Publishing is refused for a quiz with no questions. */
export async function setQuizStatusAction(
  _prev: QuizActionState,
  formData: FormData
): Promise<QuizActionState> {
  const user = await requireRole('faculty', 'admin');
  const quizId = String(formData.get('quizId') ?? '');
  const status = String(formData.get('status') ?? '');

  if (!['draft', 'published', 'closed'].includes(status)) {
    return { error: 'Unknown status.' };
  }

  const found = await loadOwnedQuiz(user, quizId);
  if ('error' in found) return { error: found.error };

  if (status === 'published' && found.quiz.questions.length === 0) {
    return { error: 'Add at least one question before publishing.' };
  }

  found.quiz.status = status as 'draft' | 'published' | 'closed';
  await found.quiz.save();

  revalidatePath('/faculty');
  revalidatePath('/admin/quizzes');
  revalidatePath(`/faculty/quizzes/${quizId}/edit`);
  return {};
}

export async function deleteQuizAction(
  _prev: QuizActionState,
  formData: FormData
): Promise<QuizActionState> {
  const user = await requireRole('faculty', 'admin');
  const quizId = String(formData.get('quizId') ?? '');

  const found = await loadOwnedQuiz(user, quizId);
  if ('error' in found) return { error: found.error };

  const attempts = await Attempt.countDocuments({ quiz: found.quiz._id });
  if (attempts > 0) {
    // Deleting would orphan student results, so closing is the only way out.
    return {
      error: `This quiz has ${attempts} attempt(s) and cannot be deleted. Close it instead.`,
    };
  }

  await found.quiz.deleteOne();

  revalidatePath('/faculty');
  redirect('/faculty');
}
