import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { Course } from '@/models/course.model';
import { availability } from '@/lib/quiz-window';
import { iso } from '@/lib/serialize';
import type { QuizSummary } from '@/components/quiz-card';

/**
 * Quizzes a student may see: anything attached to a course they are enrolled in,
 * plus any quiz they already have an attempt on (so a join-by-code quiz stays visible).
 */
export async function quizzesForStudent(studentId: string): Promise<QuizSummary[]> {
  await connectDB();

  const courseIds = await Course.find({ students: studentId }).distinct('_id');
  const attempts = await Attempt.find({ student: studentId }).select('quiz status').lean();

  const attemptedQuizIds = [...new Set(attempts.map((a) => String(a.quiz)))];

  const quizzes = await Quiz.find({
    status: { $ne: 'draft' },
    $or: [
      { course: { $in: courseIds } },
      { _id: { $in: attemptedQuizIds.map((qid) => new mongoose.Types.ObjectId(qid)) } },
    ],
  })
    .populate<{ course: { name: string } | null }>('course', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return quizzes.map((quiz) => {
    const own = attempts.filter((a) => String(a.quiz) === String(quiz._id));
    return {
      id: String(quiz._id),
      title: quiz.title,
      description: quiz.description,
      courseName: quiz.course?.name,
      questionCount: quiz.questions.length,
      durationMinutes: quiz.durationMinutes,
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      opensAt: iso(quiz.opensAt),
      closesAt: iso(quiz.closesAt),
      availability: availability(quiz),
      attemptsUsed: own.filter((a) => a.status !== 'in_progress').length,
      maxAttempts: quiz.maxAttempts,
      inProgress: own.some((a) => a.status === 'in_progress'),
    };
  });
}

export interface AttemptRow {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: string;
  submittedAt: string | null;
  showResults: boolean;
}

export async function attemptsForStudent(studentId: string): Promise<AttemptRow[]> {
  await connectDB();

  const attempts = await Attempt.find({ student: studentId, status: { $ne: 'in_progress' } })
    .populate<{ quiz: { _id: mongoose.Types.ObjectId; title: string; showResultsImmediately: boolean } | null }>(
      'quiz',
      'title showResultsImmediately'
    )
    .sort({ submittedAt: -1 })
    .lean();

  return attempts.map((attempt) => ({
    id: String(attempt._id),
    quizId: String(attempt.quiz?._id ?? ''),
    quizTitle: attempt.quiz?.title ?? 'Deleted quiz',
    score: attempt.score,
    maxScore: attempt.maxScore,
    percentage: attempt.maxScore === 0 ? 0 : (attempt.score / attempt.maxScore) * 100,
    status: attempt.status,
    submittedAt: iso(attempt.submittedAt),
    showResults: attempt.quiz?.showResultsImmediately ?? false,
  }));
}
