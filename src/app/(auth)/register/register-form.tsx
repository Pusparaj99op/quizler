'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerAction, type FormState } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Field, FormError, Input, Select } from '@/components/ui/field';

export interface DepartmentOption {
  id: string;
  name: string;
  code: string;
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating account...' : 'Create account'}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="block text-xs text-danger">{message}</span>;
}

export function RegisterForm({
  allowedDomain,
  departments,
}: {
  allowedDomain: string;
  departments: DepartmentOption[];
}) {
  const [state, formAction] = useActionState<FormState, FormData>(registerAction, {});
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const errors = state.fieldErrors ?? {};

  if (state.success) {
    return (
      <p className="mt-6 rounded-lg border border-success/30 bg-success-soft px-3 py-3 text-sm text-success">
        {state.success}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <FormError>{state.error}</FormError>

      <Field label="I am a">
        <Select
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as 'student' | 'faculty')}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </Select>
      </Field>

      <Field label="Full name">
        <Input name="name" required autoComplete="name" />
        <FieldError message={errors.name} />
      </Field>

      <Field
        label="College email"
        hint={allowedDomain ? `Must end in @${allowedDomain}` : undefined}
      >
        <Input name="email" type="email" required autoComplete="email" />
        <FieldError message={errors.email} />
      </Field>

      {role === 'student' ? (
        <Field label="Roll number">
          <Input name="rollNumber" autoComplete="off" />
          <FieldError message={errors.rollNumber} />
        </Field>
      ) : null}

      <Field label="Department">
        <Select name="department" defaultValue="">
          <option value="">Not sure yet</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.code} - {department.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Password" hint="At least 8 characters">
        <Input name="password" type="password" required autoComplete="new-password" minLength={8} />
        <FieldError message={errors.password} />
      </Field>

      <Submit />
    </form>
  );
}
