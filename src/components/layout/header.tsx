import Link from 'next/link';
import { signOutAction } from '@/actions/auth.actions';
import { Badge } from '@/components/ui/badge';
import type { SessionUser } from '@/lib/guards';

export function Header({ user }: { user?: SessionUser | null }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={user ? '/dashboard' : '/'} className="font-semibold tracking-tight">
          Quizler
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{user.email}</span>
            <Badge tone="accent" className="capitalize">
              {user.role}
            </Badge>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface-muted hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link href="/login" className="rounded-lg px-3 py-1.5 text-muted hover:text-foreground">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-accent px-3 py-1.5 font-medium text-accent-foreground"
            >
              Create account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
