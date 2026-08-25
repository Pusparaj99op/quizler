'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { startAttemptFormAction, type ActionResult } from '@/actions/attempt.actions';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/field';

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Starting...' : label}
    </Button>
  );
}

export function StartForm({ quizId, label }: { quizId: string; label: string }) {
  const [state, formAction] = useActionState<ActionResult, FormData>(startAttemptFormAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="quizId" value={quizId} />
      <FormError>{state.error}</FormError>
      <Submit label={label} />
    </form>
  );
}
