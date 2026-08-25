'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { setQuizStatusAction, deleteQuizAction, type QuizActionState } from '@/actions/quiz.actions';
import { Button } from '@/components/ui/button';
import type { QuizStatus } from '@/lib/types';

function Submit({ label, variant }: { label: string; variant?: 'secondary' | 'danger' }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant={variant ?? 'secondary'} disabled={pending}>
      {pending ? 'Working...' : label}
    </Button>
  );
}

/** Publish, close or reopen a quiz from a list row. */
export function StatusForm({
  quizId,
  status,
  label,
}: {
  quizId: string;
  status: QuizStatus;
  label: string;
}) {
  const [state, formAction] = useActionState<QuizActionState, FormData>(setQuizStatusAction, {});

  return (
    <form action={formAction} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="quizId" value={quizId} />
      <input type="hidden" name="status" value={status} />
      <Submit label={label} />
      {state.error ? <span className="text-xs text-danger">{state.error}</span> : null}
    </form>
  );
}

export function DeleteQuizForm({ quizId }: { quizId: string }) {
  const [state, formAction] = useActionState<QuizActionState, FormData>(deleteQuizAction, {});

  return (
    <form action={formAction} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="quizId" value={quizId} />
      <Submit label="Delete" variant="danger" />
      {state.error ? <span className="max-w-56 text-xs text-danger">{state.error}</span> : null}
    </form>
  );
}
