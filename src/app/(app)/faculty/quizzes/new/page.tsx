import type { Metadata } from 'next';
import { requireRole } from '@/lib/guards';
import { coursesForUser } from '@/lib/courses';
import { createQuizAction } from '@/actions/quiz.actions';
import { PageHeader } from '@/components/layout/app-shell';
import { NewQuizEditor } from './new-quiz-editor';

export const metadata: Metadata = { title: 'New quiz' };

export default async function NewQuizPage() {
  const user = await requireRole('faculty', 'admin');
  const courses = await coursesForUser(user);

  return (
    <>
      <PageHeader
        title="New quiz"
        description="Saved as a draft. You can publish it once the questions are ready."
      />
      <NewQuizEditor action={createQuizAction} courses={courses} />
    </>
  );
}
