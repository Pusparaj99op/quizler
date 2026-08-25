import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { Course } from '@/models/course.model';
import { Department } from '@/models/department.model';
import { PageHeader } from '@/components/layout/app-shell';
import { Card, SectionHeading, Stat } from '@/components/ui/card';
import { Badge, USER_STATUS_TONE } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Admin overview' };

export default async function AdminPage() {
  await requireRole('admin');
  await connectDB();

  const [students, faculty, pending, departments, courses, quizzes, published, attempts] =
    await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'faculty' }),
      User.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(5).lean(),
      Department.countDocuments(),
      Course.countDocuments(),
      Quiz.countDocuments(),
      Quiz.countDocuments({ status: 'published' }),
      Attempt.countDocuments({ status: { $ne: 'in_progress' } }),
    ]);

  return (
    <>
      <PageHeader title="Admin overview" description="The institution at a glance." />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Students" value={students} />
        <Stat label="Faculty" value={faculty} />
        <Stat label="Departments" value={departments} hint={`${courses} course(s)`} />
        <Stat label="Quizzes" value={quizzes} hint={`${published} published`} />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Stat label="Submitted attempts" value={attempts} />
        <Stat label="Awaiting approval" value={pending.length} hint="Faculty sign-ups" />
      </div>

      <Card>
        <SectionHeading
          title="Pending approvals"
          description="Faculty cannot sign in until an administrator approves them."
          action={
            <ButtonLink href="/admin/users" variant="secondary" size="sm">
              Manage users
            </ButtonLink>
          }
        />
        {pending.length === 0 ? (
          <p className="text-sm text-muted">Nothing waiting for approval.</p>
        ) : (
          <ul className="divide-y divide-border">
            {pending.map((user) => (
              <li key={String(user._id)} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
                <Badge tone={USER_STATUS_TONE[user.status]} className="capitalize">
                  {user.role}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="mt-6 text-sm text-muted">
        Jump to{' '}
        <Link href="/admin/departments" className="font-medium text-accent">
          departments
        </Link>
        ,{' '}
        <Link href="/admin/courses" className="font-medium text-accent">
          courses
        </Link>{' '}
        or{' '}
        <Link href="/admin/quizzes" className="font-medium text-accent">
          all quizzes
        </Link>
        .
      </p>
    </>
  );
}
