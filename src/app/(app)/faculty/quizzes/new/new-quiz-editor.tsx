'use client';

import { useState } from 'react';
import type { QuizActionState } from '@/actions/quiz.actions';
import { QuizEditor, emptyQuiz, type CourseOption } from '@/components/quiz-editor';

/**
 * `emptyQuiz()` generates question keys from a counter, so it has to run on the client
 * once rather than during the server render (which would mismatch on hydration).
 */
export function NewQuizEditor({
  action,
  courses,
}: {
  action: (state: QuizActionState, formData: FormData) => Promise<QuizActionState>;
  courses: CourseOption[];
}) {
  const [initial] = useState(emptyQuiz);
  return (
    <QuizEditor action={action} initial={initial} courses={courses} submitLabel="Create draft" />
  );
}
