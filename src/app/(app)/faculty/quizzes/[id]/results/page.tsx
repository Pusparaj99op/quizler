import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { requireRole, canManageQuiz } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { gradeAttempt } from '@/lib/scoring';
import { QUESTION_TYPE_LABELS } from '@/lib/types';
import { formatDateTime, formatPercent } from '@/lib/format';
import { PageHeader } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, EmptyState, SectionHeading, Stat } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Quiz results' };

export default async function QuizResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireRole('faculty', 'admin');

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const quiz = await Quiz.findById(id).lean();
  if (!quiz) notFound();
  if (!canManageQuiz(user, String(quiz.createdBy))) notFound();

  const attempts = await Attempt.find({ quiz: quiz._id, status: { $ne: 'in_progress' } })
    .populate<{ student: { name: string; email: string; rollNumber?: string } | null }>(
      'student',
      'name email rollNumber'
    )
    .sort({ score: -1 })
    .lean();

  const gradable = quiz.questions.map((question) => ({
    id: question._id.toString(),
    type: question.type,
    correctAnswers: question.correctAnswers,
    points: question.points,
  }));

  // Per-question difficulty: how many submitted attempts got each question fully right.
  const correctPerQuestion = new Map<string, number>();
  for (const attempt of attempts) {
    const breakdown = gradeAttempt(
      gradable,
      attempt.answers.map((answer) => ({
        questionId: answer.questionId,
        values: answer.values,
      }))
    );
    for (const result of breakdown.results) {
      if (result.isCorrect) {
        correctPerQuestion.set(
          result.questionId,
          (correctPerQuestion.get(result.questionId) ?? 0) + 1
        );
      }
    }
  }

  const scores = attempts.map((attempt) =>
    attempt.maxScore === 0 ? 0 : (attempt.score / attempt.maxScore) * 100
  );
  const average = scores.length === 0 ? 0 : scores.reduce((a, b) => a + b, 0) / scores.length;
  const highest = scores.length === 0 ? 0 : Math.max(...scores);
  const lowest = scores.length === 0 ? 0 : Math.min(...scores);

  return (
    <>
      <PageHeader
        title={quiz.title}
        description={`${attempts.length} submitted attempt(s).`}
        action={
          <div className="flex gap-2">
            <ButtonLink href={`/faculty/quizzes/${id}/edit`} variant="secondary" size="sm">
              Edit quiz
            </ButtonLink>
            {attempts.length > 0 ? (
              <a
                href={`/api/quizzes/${id}/results.csv`}
                download
                className="inline-flex h-8 items-center rounded-lg bg-accent px-3 text-sm font-medium text-accent-foreground"
              >
                Export CSV
              </a>
            ) : null}
          </div>
        }
      />

      {attempts.length === 0 ? (
        <EmptyState title="No submissions yet">
          Students will appear here as soon as they submit. Share the join code{' '}
          <span className="font-mono tracking-widest">{quiz.joinCode}</span>.
        </EmptyState>
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-4">
            <Stat label="Submissions" value={attempts.length} />
            <Stat label="Average" value={formatPercent(average)} />
            <Stat label="Highest" value={formatPercent(highest)} />
            <Stat label="Lowest" value={formatPercent(lowest)} />
          </div>

          <section className="mb-8">
            <SectionHeading
              title="Per-question difficulty"
              description="Share of submissions that answered each question fully correctly."
            />
            <div className="space-y-2">
              {quiz.questions.map((question, index) => {
                const correct = correctPerQuestion.get(question._id.toString()) ?? 0;
                const share = attempts.length === 0 ? 0 : (correct / attempts.length) * 100;
                return (
                  <Card key={question._id.toString()} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted">
                          Q{index + 1} - {QUESTION_TYPE_LABELS[question.type]}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-medium">{question.text}</p>
                      </div>
                      <Badge tone={share >= 70 ? 'success' : share >= 40 ? 'warning' : 'danger'}>
                        {formatPercent(share)}
                      </Badge>
                    </div>
                    <div
                      className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted"
                      role="img"
                      aria-label={`${formatPercent(share)} correct`}
                    >
                      <div className="h-full rounded-full bg-accent" style={{ width: `${share}%` }} />
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <SectionHeading title="Submissions" />
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[40rem] text-sm">
                <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Roll no.</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => {
                    const percentage =
                      attempt.maxScore === 0 ? 0 : (attempt.score / attempt.maxScore) * 100;
                    return (
                      <tr key={String(attempt._id)} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium">{attempt.student?.name ?? 'Deleted user'}</p>
                          <p className="text-xs text-muted">{attempt.student?.email}</p>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {attempt.student?.rollNumber ?? '-'}
                        </td>
                        <td className="px-4 py-3 tabular-nums">
                          {attempt.score} / {attempt.maxScore}{' '}
                          <span className="text-muted">({formatPercent(percentage)})</span>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {formatDateTime(attempt.submittedAt)}
                          {attempt.status === 'expired' ? (
                            <Badge tone="warning" className="ml-2">
                              Timed out
                            </Badge>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/results/${attempt._id}`}
                            className="text-sm font-medium text-accent"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </section>
        </>
      )}
    </>
  );
}
