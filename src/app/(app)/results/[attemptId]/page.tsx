import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { requireUser, canManageQuiz } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Attempt } from '@/models/attempt.model';
import { Quiz } from '@/models/quiz.model';
import { gradeAttempt } from '@/lib/scoring';
import { QUESTION_TYPE_LABELS } from '@/lib/types';
import { formatDateTime, formatPercent } from '@/lib/format';
import { PageHeader } from '@/components/layout/app-shell';
import { Card, Stat } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Results' };

const displayAnswer = (values: string[]) =>
  values.filter((value) => value.trim() !== '').join(', ') || 'No answer';

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const user = await requireUser();

  if (!mongoose.isValidObjectId(attemptId)) notFound();

  await connectDB();
  const attempt = await Attempt.findById(attemptId).lean();
  if (!attempt) notFound();

  const quiz = await Quiz.findById(attempt.quiz).lean();
  if (!quiz) notFound();

  // A student sees only their own attempt; the quiz owner and admins see any of them.
  const isOwnAttempt = String(attempt.student) === user.id;
  const isReviewer = canManageQuiz(user, String(quiz.createdBy));
  if (!isOwnAttempt && !isReviewer) notFound();

  if (attempt.status === 'in_progress') {
    return (
      <>
        <PageHeader title="Attempt still in progress" />
        <Card className="space-y-4">
          <p className="text-sm text-muted">This attempt has not been submitted yet.</p>
          <ButtonLink href={`/quiz/${quiz._id}`}>Resume the attempt</ButtonLink>
        </Card>
      </>
    );
  }

  // The quiz owner always sees the breakdown; students only when results are released.
  const showBreakdown = isReviewer || quiz.showResultsImmediately;

  const breakdown = gradeAttempt(
    quiz.questions.map((question) => ({
      id: question._id.toString(),
      type: question.type,
      correctAnswers: question.correctAnswers,
      points: question.points,
    })),
    attempt.answers.map((answer) => ({ questionId: answer.questionId, values: answer.values }))
  );

  const byId = new Map(quiz.questions.map((question) => [question._id.toString(), question]));
  const percentage = attempt.maxScore === 0 ? 0 : (attempt.score / attempt.maxScore) * 100;

  return (
    <>
      <PageHeader
        title={quiz.title}
        description={`Submitted ${formatDateTime(attempt.submittedAt)}`}
        action={
          <ButtonLink href="/dashboard/history" variant="secondary" size="sm">
            All attempts
          </ButtonLink>
        }
      />

      {attempt.status === 'expired' ? (
        <p className="mb-4 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-sm text-warning">
          This attempt was submitted after the deadline and was graded as it stood when time
          ran out.
        </p>
      ) : null}

      {showBreakdown ? (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Score" value={`${attempt.score} / ${attempt.maxScore}`} />
            <Stat label="Percentage" value={formatPercent(percentage)} />
            <Stat
              label="Correct"
              value={`${breakdown.results.filter((r) => r.isCorrect).length} / ${breakdown.results.length}`}
            />
          </div>

          <div className="space-y-3">
            {breakdown.results.map((result, index) => {
              const question = byId.get(result.questionId);
              if (!question) return null;

              return (
                <Card key={result.questionId} className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        Question {index + 1} - {QUESTION_TYPE_LABELS[question.type]}
                      </p>
                      <p className="mt-1 font-medium">{question.text}</p>
                    </div>
                    <Badge
                      tone={
                        result.isCorrect ? 'success' : result.earned > 0 ? 'warning' : 'danger'
                      }
                    >
                      {result.earned} / {result.possible}
                    </Badge>
                  </div>

                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-lg bg-surface-muted px-3 py-2">
                      <dt className="text-xs text-muted">Your answer</dt>
                      <dd className={result.isAnswered ? '' : 'text-muted'}>
                        {displayAnswer(result.given)}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-success-soft px-3 py-2">
                      <dt className="text-xs text-success">Correct answer</dt>
                      <dd className="text-success">{result.correct.join(', ')}</dd>
                    </div>
                  </dl>

                  {question.explanation ? (
                    <p className="text-sm text-muted">{question.explanation}</p>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card>
          <p className="text-sm text-muted">
            Your answers were recorded. Your instructor has chosen to release results later.
          </p>
        </Card>
      )}
    </>
  );
}
