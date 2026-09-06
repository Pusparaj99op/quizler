import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { googleSignInAction } from '@/actions/auth.actions';
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
      <div className="my-4 flex items-center gap-3 text-xs text-muted">
        <div className="h-px flex-1 bg-border" />
        <span>OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <form action={googleSignInAction}>
        <input type="hidden" name="next" value={next ?? ''} />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50"
        >
          Continue with Google
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        No account?{' '}
        <Link href="/register" className="font-medium text-accent">
          Create one
        </Link>
      </p>
    </div>
  );
}
