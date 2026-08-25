import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  const { next } = await searchParams;

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-1 text-sm text-muted">Use your college email address.</p>
      <LoginForm next={next} />
      <p className="mt-4 text-sm text-muted">
        No account?{' '}
        <Link href="/register" className="font-medium text-accent">
          Create one
        </Link>
      </p>
    </div>
  );
}
