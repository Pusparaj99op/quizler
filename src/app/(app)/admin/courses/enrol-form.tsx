'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { AdminActionState } from '@/actions/admin.actions';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/field';

export interface Candidate {
  id: string;
  name: string;
  email: string;
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" disabled={pending}>
      {pending ? 'Adding...' : 'Add'}
    </Button>
  );
}

/** Adds one person to a course roster. Hidden entirely when nobody is left to add. */
export function EnrolForm({
  action,
  courseId,
  list,
  candidates,
}: {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  courseId: string;
  list: 'faculty' | 'students';
  candidates: Candidate[];
}) {
  const [state, formAction] = useActionState<AdminActionState, FormData>(action, {});

  if (candidates.length === 0) {
    return <p className="text-xs text-muted">No eligible {list} left to add.</p>;
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="list" value={list} />
      <input type="hidden" name="operation" value="add" />
      <Select
        name="userId"
        defaultValue=""
        required
        aria-label={`Add ${list} to the course`}
        className="max-w-72"
      >
        <option value="" disabled>
          Choose someone to add
        </option>
        {candidates.map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {candidate.name} ({candidate.email})
          </option>
        ))}
      </Select>
      <Submit />
      {state.error ? <span className="text-xs text-danger">{state.error}</span> : null}
    </form>
  );
}
