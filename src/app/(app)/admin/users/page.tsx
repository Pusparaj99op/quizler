import type { Metadata } from 'next';
import { requireRole } from '@/lib/guards';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { setUserRoleAction, setUserStatusAction } from '@/actions/admin.actions';
import { PageHeader } from '@/components/layout/app-shell';
import { ActionForm, SelectForm } from '@/components/admin-forms';
import { Badge, USER_STATUS_TONE } from '@/components/ui/badge';
import { Card, EmptyState } from '@/components/ui/card';
import { ROLES, USER_STATUSES } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { UserFilters } from './filters';

export const metadata: Metadata = { title: 'Users' };

const PAGE_SIZE = 25;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string; page?: string }>;
}) {
  const admin = await requireRole('admin');
  const { q, role, status, page } = await searchParams;

  await connectDB();

  // Built loosely and narrowed by the guards below; every value is whitelisted.
  const filter: Record<string, unknown> = {};
  if (q) {
    // Escaped so a search for "a.b" cannot be read as a regex.
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: { $regex: safe, $options: 'i' } },
      { email: { $regex: safe, $options: 'i' } },
      { rollNumber: { $regex: safe, $options: 'i' } },
    ];
  }
  if (role && ROLES.includes(role as (typeof ROLES)[number])) filter.role = role;
  if (status && USER_STATUSES.includes(status as (typeof USER_STATUSES)[number])) {
    filter.status = status;
  }

  const current = Math.max(1, Number(page) || 1);
  const [users, total] = await Promise.all([
    User.find(filter)
      .populate<{ department: { code: string } | null }>('department', 'code')
      .sort({ createdAt: -1 })
      .skip((current - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    User.countDocuments(filter),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Users"
        description={`${total} account(s). Approve faculty, change roles, suspend access.`}
      />

      <Card className="mb-4">
        <UserFilters q={q ?? ''} role={role ?? ''} status={status ?? ''} />
      </Card>

      {users.length === 0 ? (
        <EmptyState title="No users match those filters" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[52rem] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userId = String(user._id);
                const isSelf = userId === admin.id;

                return (
                  <tr key={userId} className="border-b border-border align-top last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {user.name}
                        {isSelf ? <span className="ml-2 text-xs text-muted">(you)</span> : null}
                      </p>
                      <p className="text-xs text-muted">{user.email}</p>
                      {user.rollNumber ? (
                        <p className="text-xs text-muted">Roll {user.rollNumber}</p>
                      ) : null}
                      <p className="text-xs text-muted">Joined {formatDateTime(user.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{user.department?.code ?? '-'}</td>
                    <td className="px-4 py-3">
                      <Badge tone={USER_STATUS_TONE[user.status]} className="capitalize">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="text-xs capitalize text-muted">{user.role}</span>
                      ) : (
                        <SelectForm
                          action={setUserRoleAction}
                          fields={{ userId }}
                          name="role"
                          value={user.role}
                          label={`Role for ${user.name}`}
                          options={ROLES.map((value) => ({ value, label: value }))}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="text-xs text-muted">-</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.status !== 'active' ? (
                            <ActionForm
                              action={setUserStatusAction}
                              fields={{ userId, status: 'active' }}
                              label={user.status === 'pending' ? 'Approve' : 'Reinstate'}
                              variant="primary"
                            />
                          ) : (
                            <ActionForm
                              action={setUserStatusAction}
                              fields={{ userId, status: 'suspended' }}
                              label="Suspend"
                              variant="danger"
                            />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {pages > 1 ? (
        <nav className="mt-4 flex items-center justify-center gap-2 text-sm" aria-label="Pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((number) => {
            const query = new URLSearchParams();
            if (q) query.set('q', q);
            if (role) query.set('role', role);
            if (status) query.set('status', status);
            query.set('page', String(number));
            return (
              <a
                key={number}
                href={`/admin/users?${query}`}
                aria-current={number === current ? 'page' : undefined}
                className={
                  number === current
                    ? 'rounded-lg bg-accent px-3 py-1.5 font-medium text-accent-foreground'
                    : 'rounded-lg px-3 py-1.5 text-muted hover:bg-surface-muted'
                }
              >
                {number}
              </a>
            );
          })}
        </nav>
      ) : null}
    </>
  );
}
