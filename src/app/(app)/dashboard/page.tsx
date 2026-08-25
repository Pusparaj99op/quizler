import type { Metadata } from 'next';
import { requireUser } from '@/lib/guards';
import { attemptsForStudent, quizzesForStudent } from '@/lib/queries';
import { PageHeader } from '@/components/layout/app-shell';
import { QuizCard } from '@/components/quiz-card';
import { Card, EmptyState, SectionHeading, Stat } from '@/components/ui/card';
import { formatPercent } from '@/lib/format';
import { JoinForm } from './join-form';

export const metadata: Metadata = { title: 'Overview' };

export default async function DashboardPage() {
  const user = await requireUser();
  const [quizzes, attempts] = await Promise.all([
    quizzesForStudent(user.id),
    attemptsForStudent(user.id),
  ]);

  const open = quizzes.filter((quiz) => quiz.availability === 'open');
  const upcoming = quizzes.filter((quiz) => quiz.availability === 'upcoming');
  const average =
    attempts.length === 0
      ? 0
      : attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length;

  return (
    <>
      <PageHeader title={`Hello, ${user.name.split(' ')[0] || 'there'}`} description="Your quizzes at a glance." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Open now" value={open.length} />
        <Stat label="Completed" value={attempts.length} />
        <Stat label="Average score" value={formatPercent(average)} hint="Across submitted attempts" />
      </div>

      <Card className="mb-8">
        <SectionHeading
          title="Join with a code"
          description="Your instructor will read out a six-character code."
        />
        <JoinForm />
      </Card>

      <section className="mb-8">
        <SectionHeading title="Open quizzes" description="Available to attempt right now." />
        {open.length === 0 ? (
          <EmptyState title="Nothing open at the moment">
            Quizzes appear here once your instructor publishes them, or join one with a code above.
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {open.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </section>

      {upcoming.length > 0 ? (
        <section>
          <SectionHeading title="Coming up" description="Scheduled but not open yet." />
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
