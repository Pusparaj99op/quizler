'use client';

import { useActionState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import type { AdminActionState } from '@/actions/admin.actions';
import { Button } from '@/components/ui/button';

type AdminAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

function Submit({ label, variant }: { label: string; variant?: 'primary' | 'secondary' | 'danger' }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant={variant ?? 'secondary'} disabled={pending}>
      {pending ? 'Working...' : label}
    </Button>
  );
}

function Feedback({ state }: { state: AdminActionState }) {
  if (state.error) {
    return (
      <span role="alert" className="text-xs text-danger">
        {state.error}
      </span>
    );
  }
  if (state.success) {
    return <span className="text-xs text-success">{state.success}</span>;
  }
  return null;
}

/**
 * A one-button form carrying fixed hidden fields. Every admin mutation is a form post
 * so it works without JavaScript and re-validates on the server.
 */
export function ActionForm({
  action,
  fields,
  label,
  variant,
  className,
}: {
  action: AdminAction;
  fields: Record<string, string>;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}) {
  const [state, formAction] = useActionState<AdminActionState, FormData>(action, {});

  return (
    <form action={formAction} className={className ?? 'inline-flex flex-col items-start gap-1'}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Submit label={label} variant={variant} />
      <Feedback state={state} />
    </form>
  );
}

/** A `select` that submits the moment it changes, for inline role switching. */
export function SelectForm({
  action,
  fields,
  name,
  value,
  options,
  label,
}: {
  action: AdminAction;
  fields: Record<string, string>;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  label: string;
}) {
  const [state, formAction] = useActionState<AdminActionState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-1">
      {Object.entries(fields).map(([field, fieldValue]) => (
        <input key={field} type="hidden" name={field} value={fieldValue} />
      ))}
      <div className="flex items-center gap-1.5">
        <select
          name={name}
          defaultValue={value}
          aria-label={label}
          className="rounded-lg border border-border bg-surface px-2 py-1 text-xs capitalize"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Submit label="Apply" />
      </div>
      <Feedback state={state} />
    </form>
  );
}

/** A multi-input create form, e.g. new department or course. */
export function CreateForm({
  action,
  submitLabel,
  children,
}: {
  action: AdminAction;
  submitLabel: string;
  children: ReactNode;
}) {
  const [state, formAction] = useActionState<AdminActionState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-3">
      {children}
      <div className="flex items-center gap-3">
        <Submit label={submitLabel} variant="primary" />
        <Feedback state={state} />
      </div>
    </form>
  );
}
