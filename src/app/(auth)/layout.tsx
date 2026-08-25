import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        {children}
      </main>
    </>
  );
}
