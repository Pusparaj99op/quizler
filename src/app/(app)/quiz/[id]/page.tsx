import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import mongoose from 'mongoose';
import { requireUser } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { availability, AVAILABILITY_LABEL } from '@/lib/quiz-window';
import { formatDateTime } from '@/lib/format';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { StartForm } from './start-form';
import { QuizRunner, type RunnerQuestion } from './runner';

export const metadata: Metadata = { title: 'Quiz' };

/** Fisher-Yates with a per-attempt seed, so a refresh keeps the same order. */
function shuffle<T>(items: T[], seed: string): T[] {
  const out = [...items];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const next = () => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return hash / 0x100000000;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Kept out of the component body so the react-hooks purity rule stays satisfied. */
function hasExpired(deadline: Date): boolean {
  return deadline.getTime() <= Date.now();
}

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const quiz = await Quiz.findById(id)
    .populate<{ course: { name: string } | null }>('course', 'name')
    .lean();
  if (!quiz) notFound();

  const attempt = await Attempt.findOne({
    quiz: quiz._id,
    student: user.id,
    status: 'in_progress',
  }).lean();

  // An attempt already past its deadline is finalised by the submit action, not shown.
  if (attempt && hasExpired(attempt.expiresAt)) {
    redirect(`/results/${attempt._id}`);
  }

  if (attempt) {
    const questions: RunnerQuestion[] = quiz.questions.map((question) => ({
      id: question._id.toString(),
      type: question.type,
      text: question.text,
      options: question.options,
      points: question.points,
    }));

    const initialAnswers: Record<string, string[]> = {};
    for (const answer of attempt.answers) initialAnswers[answer.questionId] = answer.values;

    return (
      <QuizRunner
        attemptId={String(attempt._id)}
        quizTitle={quiz.title}
        questions={
          quiz.shuffleQuestions ? shuffle(questions, String(attempt._id)) : questions
        }
        initialAnswers={initialAnswers}
        expiresAt={attempt.expiresAt.getTime()}
      />
    );
  }

  const state = availability(quiz);
  const used = await Attempt.countDocuments({
    quiz: quiz._id,
    student: user.id,
    status: { $ne: 'in_progress' },
  });
  const attemptsLeft = quiz.maxAttempts - used;
  const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{quiz.title}</h1>
            {quiz.course ? <p className="mt-1 text-sm text-muted">{quiz.course.name}</p> : null}
          </div>
          <Badge tone={state === 'open' ? 'success' : 'warning'}>
            {AVAILABILITY_LABEL[state]}
          </Badge>
        </div>

        {quiz.description ? <p className="text-sm text-muted">{quiz.description}</p> : null}

        <dl className="grid grid-cols-2 gap-4 border-y border-border py-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted">Questions</dt>
            <dd className="font-medium">{quiz.questions.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Time limit</dt>
            <dd className="font-medium">{quiz.durationMinutes} min</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Total points</dt>
            <dd className="font-medium">{totalPoints}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Attempts left</dt>
            <dd className="font-medium">
              {attemptsLeft} of {quiz.maxAttempts}
            </dd>
          </div>
        </dl>

        {quiz.opensAt || quiz.closesAt ? (
          <p className="text-sm text-muted">
            {quiz.opensAt ? `Opens ${formatDateTime(quiz.opensAt)}. ` : ''}
            {quiz.closesAt ? `Closes ${formatDateTime(quiz.closesAt)}.` : ''}
          </p>
        ) : null}

        <p className="rounded-lg bg-surface-muted px-3 py-2.5 text-sm text-muted">
          The timer starts the moment you begin and runs on the server, so closing the tab
          does not pause it. Answers save automatically as you go.
        </p>

        {state === 'open' && attemptsLeft > 0 ? (
          <StartForm quizId={String(quiz._id)} label="Start attempt" />
        ) : (
          <p className="text-sm text-muted">
            {attemptsLeft <= 0
              ? 'You have used all of your attempts for this quiz.'
              : 'This quiz is not open for attempts right now.'}{' '}
            <Link href="/dashboard" className="font-medium text-accent">
              Back to overview
            </Link>
          </p>
        )}
      </Card>

      <p className="mt-4 text-center">
        <ButtonLink href="/dashboard" variant="ghost" size="sm">
          Back to overview
        </ButtonLink>
      </p>
    </div>
  );
}
