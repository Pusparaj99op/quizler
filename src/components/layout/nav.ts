import type { Role } from '@/lib/types';

export interface NavItem {
  href: string;
  label: string;
  roles: Role[];
}

/**
 * The single source of truth for navigation. Every entry points at a route that
 * actually exists, and the sidebar filters purely on role.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Overview', roles: ['student', 'faculty', 'admin'] },
  { href: '/dashboard/history', label: 'My attempts', roles: ['student', 'faculty', 'admin'] },
  { href: '/faculty', label: 'My quizzes', roles: ['faculty', 'admin'] },
  { href: '/faculty/courses', label: 'Courses', roles: ['faculty', 'admin'] },
  { href: '/admin', label: 'Admin overview', roles: ['admin'] },
  { href: '/admin/users', label: 'Users', roles: ['admin'] },
  { href: '/admin/departments', label: 'Departments', roles: ['admin'] },
  { href: '/admin/quizzes', label: 'All quizzes', roles: ['admin'] },
];

export function navFor(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
