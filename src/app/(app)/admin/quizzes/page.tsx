import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { forceCloseQuizAction } from '@/actions/admin.actions';
import { PageHeader } from '@/components/layout/app-shell';
import { ActionForm } from '@/components/admin-forms';
import { Badge, QUIZ_STATUS_TONE } from '@/components/ui/badge';
import { Card, EmptyState } from '@/components/ui/card';
import { formatDateTime } from '@/lib/format';
import { availability, AVAILABILITY_LABEL } from '@/lib/quiz-window';

export const metadata: Metadata = { title: 'All quizzes' };

export default async function AdminQuizzesPage() {
  await requireRole('admin');
  await connectDB();

  const quizzes = await Quiz.find()
    .populate<{ createdBy: { name: string; email: string } | null }>('createdBy', 'name email')
    .populate<{ course: { code: string } | null }>('course', 'code')
    .sort({ updatedAt: -1 })
    .lean();

  const counts = await Attempt.aggregate<{ _id: string; total: number }>([
    { $match: { status: { $ne: 'in_progress' } } },
    { $group: { _id: '$quiz', total: { $sum: 1 } } },
  ]);
  const attemptsByQuiz = new Map(counts.map((row) => [String(row._id), row.total]));

  return (
    <>
      <PageHeader
        title="All quizzes"
        description="Every quiz in the institution, whoever created it."
      />

      {quizzes.length === 0 ? (
        <EmptyState title="No quizzes have been created yet" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[52rem] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Quiz</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Attempts</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => {
                const quizId = String(quiz._id);
                const state = availability(quiz);
                return (
                  <tr key={quizId} className="border-b border-border align-top last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-xs text-muted">
                        {quiz.course ? `${quiz.course.code} - ` : ''}
                        {quiz.questions.length} question(s) - code{' '}
                        <span className="font-mono">{quiz.joinCode}</span>
                      </p>
                      <p className="text-xs text-muted">
                        Updated {formatDateTime(quiz.updatedAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{quiz.createdBy?.name ?? 'Deleted user'}</p>
                      <p className="text-xs text-muted">{quiz.createdBy?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={QUIZ_STATUS_TONE[quiz.status]} className="capitalize">
                        {quiz.status}
                      </Badge>
                      <p className="mt-1 text-xs text-muted">{AVAILABILITY_LABEL[state]}</p>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{attemptsByQuiz.get(quizId) ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-2">
                        <Link
                          href={`/faculty/quizzes/${quizId}/results`}
                          className="text-sm font-medium text-accent"
                        >
                          Results
                        </Link>
                        {quiz.status === 'published' ? (
                          <ActionForm
                            action={forceCloseQuizAction}
                            fields={{ quizId }}
                            label="Force close"
                            variant="danger"
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
