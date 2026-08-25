import type { ReactNode } from 'react';
import { requireUser } from '@/lib/guards';
import { AppShell } from '@/components/layout/app-shell';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return <AppShell user={user}>{children}</AppShell>;
}
