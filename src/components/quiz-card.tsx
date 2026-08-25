import Link from 'next/link';
import { Badge, type Tone } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/lib/format';
import { AVAILABILITY_LABEL, type Availability } from '@/lib/quiz-window';

const TONE: Record<Availability, Tone> = {
  open: 'success',
  upcoming: 'accent',
  closed: 'warning',
  draft: 'neutral',
};

export interface QuizSummary {
  id: string;
  title: string;
  description: string;
  courseName?: string;
  questionCount: number;
  durationMinutes: number;
  totalPoints: number;
  opensAt: string | null;
  closesAt: string | null;
  availability: Availability;
  attemptsUsed: number;
  maxAttempts: number;
  inProgress: boolean;
}

export function QuizCard({ quiz }: { quiz: QuizSummary }) {
  const attemptsLeft = quiz.maxAttempts - quiz.attemptsUsed;
  const canStart = quiz.availability === 'open' && (quiz.inProgress || attemptsLeft > 0);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{quiz.title}</h3>
          {quiz.courseName ? (
            <p className="mt-0.5 text-xs text-muted">{quiz.courseName}</p>
          ) : null}
        </div>
        <Badge tone={TONE[quiz.availability]}>{AVAILABILITY_LABEL[quiz.availability]}</Badge>
      </div>

      {quiz.description ? (
        <p className="line-clamp-2 text-sm text-muted">{quiz.description}</p>
      ) : null}

      <dl className="grid grid-cols-3 gap-2 text-xs text-muted">
        <div>
          <dt>Questions</dt>
          <dd className="font-medium text-foreground">{quiz.questionCount}</dd>
        </div>
        <div>
          <dt>Time limit</dt>
          <dd className="font-medium text-foreground">{quiz.durationMinutes} min</dd>
        </div>
        <div>
          <dt>Points</dt>
          <dd className="font-medium text-foreground">{quiz.totalPoints}</dd>
        </div>
      </dl>

      {quiz.opensAt || quiz.closesAt ? (
        <p className="text-xs text-muted">
          {quiz.opensAt ? `Opens ${formatDateTime(quiz.opensAt)}. ` : ''}
          {quiz.closesAt ? `Closes ${formatDateTime(quiz.closesAt)}.` : ''}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <span className="text-xs text-muted">
          {quiz.inProgress
            ? 'Attempt in progress'
            : `${attemptsLeft} of ${quiz.maxAttempts} attempt(s) left`}
        </span>
        {canStart ? (
          <Link
            href={`/quiz/${quiz.id}`}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
          >
            {quiz.inProgress ? 'Resume' : 'Start'}
          </Link>
        ) : (
          <span className="text-xs text-muted">Unavailable</span>
        )}
      </div>
    </Card>
  );
}
