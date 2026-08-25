import type { Metadata } from 'next';
import { requireRole } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Course } from '@/models/course.model';
import { Department } from '@/models/department.model';
import { User } from '@/models/user.model';
import { createCourseAction, updateCourseMemberAction } from '@/actions/admin.actions';
import { PageHeader } from '@/components/layout/app-shell';
import { ActionForm, CreateForm } from '@/components/admin-forms';
import { Card, EmptyState, SectionHeading } from '@/components/ui/card';
import { Field, Input, Select } from '@/components/ui/field';
import { EnrolForm } from './enrol-form';

export const metadata: Metadata = { title: 'Courses' };

export default async function AdminCoursesPage() {
  await requireRole('admin');
  await connectDB();

  const [courses, departments, people] = await Promise.all([
    Course.find()
      .populate<{ department: { name: string; code: string } | null }>('department', 'name code')
      .populate<{ faculty: { _id: string; name: string; email: string }[] }>(
        'faculty',
        'name email'
      )
      .populate<{ students: { _id: string; name: string; email: string }[] }>(
        'students',
        'name email'
      )
      .sort({ code: 1 })
      .lean(),
    Department.find().sort({ code: 1 }).lean(),
    User.find({ status: 'active', role: { $in: ['student', 'faculty'] } })
      .select('name email role')
      .sort({ name: 1 })
      .lean(),
  ]);

  const candidates = people.map((person) => ({
    id: String(person._id),
    name: person.name,
    email: person.email,
    role: person.role as 'student' | 'faculty',
  }));

  return (
    <>
      <PageHeader
        title="Courses"
        description="Assign faculty and enrol students. Quizzes attached to a course reach everyone enrolled."
      />

      <Card className="mb-6">
        <SectionHeading title="Add a course" />
        <CreateForm action={createCourseAction} submitLabel="Create course">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Name">
              <Input name="name" required placeholder="Data Structures" />
            </Field>
            <Field label="Code">
              <Input name="code" required maxLength={16} className="uppercase" placeholder="CS201" />
            </Field>
            <Field label="Department">
              <Select name="department" required defaultValue="">
                <option value="" disabled>
                  Choose a department
                </option>
                {departments.map((department) => (
                  <option key={String(department._id)} value={String(department._id)}>
                    {department.code} - {department.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </CreateForm>
        {departments.length === 0 ? (
          <p className="mt-3 text-sm text-warning">Create a department first.</p>
        ) : null}
      </Card>

      {courses.length === 0 ? (
        <EmptyState title="No courses yet" />
      ) : (
        <div className="space-y-4">
          {courses.map((course) => {
            const courseId = String(course._id);
            const enrolled = new Set([
              ...course.faculty.map((person) => String(person._id)),
              ...course.students.map((person) => String(person._id)),
            ]);

            return (
              <Card key={courseId} className="space-y-4">
                <div>
                  <h3 className="font-medium">
                    {course.code} - {course.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">
                    {course.department?.name ?? 'No department'}
                  </p>
                </div>

                {(['faculty', 'students'] as const).map((list) => {
                  const members = course[list];
                  return (
                    <div key={list}>
                      <p className="mb-2 text-sm font-medium capitalize">
                        {list} ({members.length})
                      </p>
                      {members.length === 0 ? (
                        <p className="text-sm text-muted">Nobody assigned yet.</p>
                      ) : (
                        <ul className="flex flex-wrap gap-2">
                          {members.map((person) => (
                            <li
                              key={String(person._id)}
                              className="flex items-center gap-2 rounded-lg bg-surface-muted px-2.5 py-1.5 text-sm"
                            >
                              <span>{person.name}</span>
                              <ActionForm
                                action={updateCourseMemberAction}
                                fields={{
                                  courseId,
                                  userId: String(person._id),
                                  list,
                                  operation: 'remove',
                                }}
                                label="Remove"
                                className="inline-flex"
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-2">
                        <EnrolForm
                          action={updateCourseMemberAction}
                          courseId={courseId}
                          list={list}
                          candidates={candidates.filter(
                            (person) =>
                              !enrolled.has(person.id) &&
                              (list === 'faculty'
                                ? person.role === 'faculty'
                                : person.role === 'student')
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
