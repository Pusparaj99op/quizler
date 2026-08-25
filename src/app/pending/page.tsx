import type { Metadata } from 'next';
import { signOutAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = { title: 'Awaiting approval' };

export default function PendingPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h1 className="text-xl font-semibold tracking-tight">Your account is not active yet</h1>
          <p className="mt-2 text-sm text-muted">
            Faculty accounts are reviewed by an administrator before they can create quizzes. If
            your account was suspended, contact your department administrator.
          </p>
          <form action={signOutAction} className="mt-6">
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
