import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/course.model';
import { Quiz } from '@/models/quiz.model';
import { PageHeader } from '@/components/layout/app-shell';
import { Card, EmptyState } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Courses' };

export default async function FacultyCoursesPage() {
  const user = await requireRole('faculty', 'admin');

  await connectDB();
  const courses = await Course.find(user.role === 'admin' ? {} : { faculty: user.id })
    .populate<{ department: { name: string; code: string } | null }>('department', 'name code')
    .sort({ code: 1 })
    .lean();

  const quizCounts = await Quiz.aggregate<{ _id: string; total: number }>([
    { $match: { course: { $in: courses.map((course) => course._id) } } },
    { $group: { _id: '$course', total: { $sum: 1 } } },
  ]);
  const byCourse = new Map(quizCounts.map((row) => [String(row._id), row.total]));

  return (
    <>
      <PageHeader
        title="Courses"
        description="Courses you teach. Quizzes attached to a course are visible to everyone enrolled."
      />

      {courses.length === 0 ? (
        <EmptyState title="You are not assigned to a course yet">
          An administrator creates courses and assigns faculty. Until then you can still create
          quizzes and share them with a join code.
        </EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((course) => (
            <Card key={String(course._id)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{course.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {course.code}
                    {course.department ? ` - ${course.department.name}` : ''}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted">
                {course.students.length} student(s) - {byCourse.get(String(course._id)) ?? 0}{' '}
                quiz(zes)
              </p>
            </Card>
          ))}
        </div>
      )}

      {user.role === 'admin' ? (
        <p className="mt-6 text-sm text-muted">
          Manage courses and enrolment in{' '}
          <Link href="/admin/courses" className="font-medium text-accent">
            the admin panel
          </Link>
          .
        </p>
      ) : null}
    </>
  );
}
