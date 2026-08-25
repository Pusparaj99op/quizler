'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { joinByCodeAction, type ActionResult } from '@/actions/attempt.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Joining...' : 'Join'}
    </Button>
  );
}

export function JoinForm() {
  const [state, formAction] = useActionState<ActionResult, FormData>(joinByCodeAction, {});

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <Input
          name="joinCode"
          placeholder="ABC123"
          aria-label="Quiz join code"
          maxLength={6}
          required
          className="font-mono uppercase tracking-widest"
        />
        <Submit />
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
