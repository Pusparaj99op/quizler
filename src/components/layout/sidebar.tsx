'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import type { NavItem } from './nav';

export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' || href === '/faculty' || href === '/admin'
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <nav aria-label="Main" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? 'page' : undefined}
          className={cn(
            'whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors',
            isActive(item.href)
              ? 'bg-accent-soft font-medium text-accent'
              : 'text-muted hover:bg-surface-muted hover:text-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
