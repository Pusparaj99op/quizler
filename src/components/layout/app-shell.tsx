import type { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { navFor } from './nav';
import type { SessionUser } from '@/lib/guards';

export function AppShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  return (
    <>
      <Header user={user} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:flex-row">
        <aside className="md:w-52 md:shrink-0">
          <Sidebar items={navFor(user.role)} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
