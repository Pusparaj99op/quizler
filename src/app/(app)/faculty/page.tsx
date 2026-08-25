import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { PageHeader } from '@/components/layout/app-shell';
import { Badge, QUIZ_STATUS_TONE } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, EmptyState, Stat } from '@/components/ui/card';
import { formatDateTime } from '@/lib/format';
import { StatusForm, DeleteQuizForm } from './status-form';

export const metadata: Metadata = { title: 'My quizzes' };

export default async function FacultyPage() {
  const user = await requireRole('faculty', 'admin');

  await connectDB();
  // Admins get a view of their own authored quizzes here; /admin/quizzes covers the rest.
  const quizzes = await Quiz.find({ createdBy: user.id })
    .populate<{ course: { name: string; code: string } | null }>('course', 'name code')
    .sort({ updatedAt: -1 })
    .lean();

  const counts = await Attempt.aggregate<{ _id: string; total: number }>([
    { $match: { quiz: { $in: quizzes.map((quiz) => quiz._id) }, status: { $ne: 'in_progress' } } },
    { $group: { _id: '$quiz', total: { $sum: 1 } } },
  ]);
  const attemptsByQuiz = new Map(counts.map((row) => [String(row._id), row.total]));

  const published = quizzes.filter((quiz) => quiz.status === 'published').length;
  const totalAttempts = counts.reduce((sum, row) => sum + row.total, 0);

  return (
    <>
      <PageHeader
        title="My quizzes"
        description="Author, publish and review the quizzes you own."
        action={<ButtonLink href="/faculty/quizzes/new">New quiz</ButtonLink>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Total quizzes" value={quizzes.length} />
        <Stat label="Published" value={published} />
        <Stat label="Attempts received" value={totalAttempts} />
      </div>

      {quizzes.length === 0 ? (
        <EmptyState title="You have not created a quiz yet">
          <Link href="/faculty/quizzes/new" className="font-medium text-accent">
            Create your first quiz
          </Link>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => {
            const attempts = attemptsByQuiz.get(String(quiz._id)) ?? 0;
            return (
              <Card key={String(quiz._id)} className="flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/faculty/quizzes/${quiz._id}/edit`}
                      className="font-medium hover:text-accent"
                    >
                      {quiz.title}
                    </Link>
                    <Badge tone={QUIZ_STATUS_TONE[quiz.status]} className="capitalize">
                      {quiz.status}
                    </Badge>
                    {quiz.status === 'published' ? (
                      <span className="rounded bg-surface-muted px-2 py-0.5 font-mono text-xs tracking-widest">
                        {quiz.joinCode}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {quiz.course ? `${quiz.course.code} - ` : ''}
                    {quiz.questions.length} question(s) - {quiz.durationMinutes} min - {attempts}{' '}
                    attempt(s)
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    Updated {formatDateTime(quiz.updatedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-start gap-2">
                  <ButtonLink
                    href={`/faculty/quizzes/${quiz._id}/results`}
                    variant="secondary"
                    size="sm"
                  >
                    Results
                  </ButtonLink>
                  <ButtonLink
                    href={`/faculty/quizzes/${quiz._id}/edit`}
                    variant="secondary"
                    size="sm"
                  >
                    Edit
                  </ButtonLink>
                  {quiz.status === 'published' ? (
                    <StatusForm quizId={String(quiz._id)} status="closed" label="Close" />
                  ) : (
                    <StatusForm quizId={String(quiz._id)} status="published" label="Publish" />
                  )}
                  {attempts === 0 ? <DeleteQuizForm quizId={String(quiz._id)} /> : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
