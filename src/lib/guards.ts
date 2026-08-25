import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import type { Role } from '@/lib/types';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
}

/**
 * The single authorization boundary. Call this at the top of every protected page,
 * server action and route handler — never rely on `middleware.ts` alone.
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id || user.status !== 'active') {
    redirect('/login');
  }

  await connectDB();

  return {
    id: user.id,
    name: user.name ?? '',
    email: user.email ?? '',
    role: user.role,
    department: user.department,
  };
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect('/dashboard');
  }
  return user;
}

/** Faculty own their quizzes; admins may act on any of them. */
export function canManageQuiz(user: SessionUser, createdBy: string): boolean {
  return user.role === 'admin' || user.id === createdBy;
}
