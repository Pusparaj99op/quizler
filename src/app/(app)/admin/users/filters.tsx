'use client';

import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/field';
import { ROLES, USER_STATUSES } from '@/lib/types';

/** A plain GET form, so filters live in the URL and stay shareable and bookmarkable. */
export function UserFilters({ q, role, status }: { q: string; role: string; status: string }) {
  return (
    <form method="get" action="/admin/users" className="flex flex-wrap items-end gap-2">
      <div className="min-w-48 flex-1">
        <label htmlFor="q" className="mb-1.5 block text-sm font-medium">
          Search
        </label>
        <Input id="q" name="q" defaultValue={q} placeholder="Name, email or roll number" />
      </div>

      <div>
        <label htmlFor="role" className="mb-1.5 block text-sm font-medium">
          Role
        </label>
        <Select id="role" name="role" defaultValue={role} className="capitalize">
          <option value="">Any</option>
          {ROLES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
          Status
        </label>
        <Select id="status" name="status" defaultValue={status} className="capitalize">
          <option value="">Any</option>
          {USER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>

      <Button type="submit" variant="secondary">
        Filter
      </Button>
    </form>
  );
}
