import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { requireRole, canManageQuiz } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { coursesForUser } from '@/lib/courses';
import { updateQuizAction } from '@/actions/quiz.actions';
import { PageHeader } from '@/components/layout/app-shell';
import { QuizEditor, type EditorQuiz } from '@/components/quiz-editor';
import { Badge, QUIZ_STATUS_TONE } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusForm } from '../../../status-form';

export const metadata: Metadata = { title: 'Edit quiz' };

/** `datetime-local` needs `YYYY-MM-DDTHH:mm`, and the value is treated as local time. */
function toLocalInput(value: Date | null | undefined): string {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 16);
}

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireRole('faculty', 'admin');

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const quiz = await Quiz.findById(id).lean();
  if (!quiz) notFound();
  if (!canManageQuiz(user, String(quiz.createdBy))) notFound();

  const [courses, attempts] = await Promise.all([
    coursesForUser(user),
    Attempt.countDocuments({ quiz: quiz._id, status: { $ne: 'in_progress' } }),
  ]);

  const initial: EditorQuiz = {
    title: quiz.title,
    description: quiz.description,
    course: quiz.course ? String(quiz.course) : '',
    durationMinutes: quiz.durationMinutes,
    maxAttempts: quiz.maxAttempts,
    shuffleQuestions: quiz.shuffleQuestions,
    showResultsImmediately: quiz.showResultsImmediately,
    opensAt: toLocalInput(quiz.opensAt),
    closesAt: toLocalInput(quiz.closesAt),
    questions: quiz.questions.map((question) => ({
      key: question._id.toString(),
      type: question.type,
      text: question.text,
      options: question.options,
      correctAnswers: question.correctAnswers,
      points: question.points,
      explanation: question.explanation ?? '',
    })),
  };

  return (
    <>
      <PageHeader
        title="Edit quiz"
        description={`Join code ${quiz.joinCode}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={QUIZ_STATUS_TONE[quiz.status]} className="capitalize">
              {quiz.status}
            </Badge>
            <ButtonLink href={`/faculty/quizzes/${id}/results`} variant="secondary" size="sm">
              Results
            </ButtonLink>
            {quiz.status === 'published' ? (
              <StatusForm quizId={id} status="closed" label="Close" />
            ) : (
              <StatusForm quizId={id} status="published" label="Publish" />
            )}
          </div>
        }
      />

      {attempts > 0 ? (
        <Card className="mb-6 border-warning/30 bg-warning-soft">
          <p className="text-sm text-warning">
            {attempts} student(s) have already submitted this quiz. Changing questions or points
            will re-grade nothing that is already submitted - past results keep the score they
            were given.
          </p>
        </Card>
      ) : null}

      <QuizEditor
        action={updateQuizAction}
        initial={initial}
        quizId={id}
        courses={courses}
        submitLabel="Save changes"
      />
    </>
  );
}
