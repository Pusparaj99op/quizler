import type { Metadata } from 'next';
import { requireRole } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { Department } from '@/models/department.model';
import { Course } from '@/models/course.model';
import { User } from '@/models/user.model';
import { createDepartmentAction, deleteDepartmentAction } from '@/actions/admin.actions';
import { PageHeader } from '@/components/layout/app-shell';
import { ActionForm, CreateForm } from '@/components/admin-forms';
import { Card, EmptyState, SectionHeading } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';

export const metadata: Metadata = { title: 'Departments' };

export default async function AdminDepartmentsPage() {
  await requireRole('admin');
  await connectDB();

  const departments = await Department.find().sort({ code: 1 }).lean();
  const ids = departments.map((department) => department._id);

  const [courseCounts, userCounts] = await Promise.all([
    Course.aggregate<{ _id: string; total: number }>([
      { $match: { department: { $in: ids } } },
      { $group: { _id: '$department', total: { $sum: 1 } } },
    ]),
    User.aggregate<{ _id: string; total: number }>([
      { $match: { department: { $in: ids } } },
      { $group: { _id: '$department', total: { $sum: 1 } } },
    ]),
  ]);

  const courses = new Map(courseCounts.map((row) => [String(row._id), row.total]));
  const users = new Map(userCounts.map((row) => [String(row._id), row.total]));

  return (
    <>
      <PageHeader title="Departments" description="The top-level grouping for courses and staff." />

      <Card className="mb-6">
        <SectionHeading title="Add a department" />
        <CreateForm action={createDepartmentAction} submitLabel="Create department">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <Input name="name" required placeholder="Computer Science and Engineering" />
            </Field>
            <Field label="Code" hint="Short, unique, e.g. CSE">
              <Input name="code" required maxLength={12} className="uppercase" placeholder="CSE" />
            </Field>
          </div>
        </CreateForm>
      </Card>

      {departments.length === 0 ? (
        <EmptyState title="No departments yet">
          Create one above so courses and staff can be grouped under it.
        </EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {departments.map((department) => {
            const departmentId = String(department._id);
            return (
              <Card key={departmentId} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{department.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{department.code}</p>
                  <p className="mt-2 text-sm text-muted">
                    {courses.get(departmentId) ?? 0} course(s) - {users.get(departmentId) ?? 0}{' '}
                    member(s)
                  </p>
                </div>
                <ActionForm
                  action={deleteDepartmentAction}
                  fields={{ departmentId }}
                  label="Delete"
                  variant="danger"
                  className="inline-flex max-w-40 flex-col items-end gap-1 text-right"
                />
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
