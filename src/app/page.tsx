import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Header } from '@/components/layout/header';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AUDIENCES = [
  {
    role: 'Students',
    summary: 'Join a quiz with a six-character code, answer against a server-enforced timer, and see your score the moment you submit.',
    points: ['Join by code or from your enrolled courses', 'Autosaved answers survive a refresh', 'Per-question feedback and full attempt history'],
  },
  {
    role: 'Faculty',
    summary: 'Author quizzes from a question bank of four types, schedule when they open, and read the results without exporting anything by hand.',
    points: ['Single choice, multi-select, true/false and short answer', 'Scheduling, attempt limits and shuffling', 'Per-question difficulty stats and CSV export'],
  },
  {
    role: 'Administrators',
    summary: 'Run the platform for the whole institution: departments, courses, faculty approvals and oversight of every quiz.',
    points: ['Approve or suspend accounts', 'Manage departments and courses', 'Force-close a quiz that ran long'],
  },
];

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <section className="py-16 sm:py-24">
          <p className="text-sm font-medium text-accent">For colleges and universities</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Run every quiz on campus from one place.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Quizler gives faculty a proper authoring tool, students a quiz runner that grades
            itself, and administrators a view of the whole institution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/register">Create an account</ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              Sign in
            </ButtonLink>
          </div>
        </section>

        <section className="grid gap-4 pb-20 md:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <Card key={audience.role}>
              <h2 className="text-base font-semibold">{audience.role}</h2>
              <p className="mt-2 text-sm text-muted">{audience.summary}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {audience.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </section>
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        Quizler - college quiz platform
      </footer>
    </>
  );
}
