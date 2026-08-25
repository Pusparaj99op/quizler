import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Department } from '@/models/department.model';
import { RegisterForm } from './register-form';

export const metadata: Metadata = { title: 'Create account' };

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  await connectDB();
  const departments = await Department.find().sort({ name: 1 }).lean();

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-muted">
        Faculty accounts need an administrator to approve them before first sign-in.
      </p>
      <RegisterForm
        allowedDomain={process.env.ALLOWED_EMAIL_DOMAIN ?? ''}
        departments={departments.map((d) => ({ id: String(d._id), name: d.name, code: d.code }))}
      />
      <p className="mt-4 text-sm text-muted">
        Already registered?{' '}
        <Link href="/login" className="font-medium text-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}
