import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/guards';
import { attemptsForStudent } from '@/lib/queries';
import { PageHeader } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Card, EmptyState } from '@/components/ui/card';
import { formatDateTime, formatPercent } from '@/lib/format';

export const metadata: Metadata = { title: 'My attempts' };

export default async function HistoryPage() {
  const user = await requireUser();
  const attempts = await attemptsForStudent(user.id);

  if (attempts.length === 0) {
    return (
      <>
        <PageHeader title="My attempts" />
        <EmptyState title="You have not completed a quiz yet">
          <Link href="/dashboard" className="font-medium text-accent">
            Back to overview
          </Link>
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <PageHeader title="My attempts" description={`${attempts.length} completed attempt(s).`} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Quiz</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{attempt.quizTitle}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(attempt.submittedAt)}</td>
                <td className="px-4 py-3 tabular-nums">
                  {attempt.showResults ? (
                    <>
                      {attempt.score} / {attempt.maxScore}{' '}
                      <span className="text-muted">({formatPercent(attempt.percentage)})</span>
                    </>
                  ) : (
                    <span className="text-muted">Held back</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={attempt.status === 'expired' ? 'warning' : 'success'}>
                    {attempt.status === 'expired' ? 'Timed out' : 'Submitted'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/results/${attempt.id}`} className="text-sm font-medium text-accent">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
