import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

/**
 * A first line of defence only — it keeps signed-out users off private pages and
 * gives a fast redirect. Every mutation re-checks the session server-side via
 * `src/lib/guards.ts`, because the proxy is not an authorization boundary.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  const redirect = (to: string) => NextResponse.redirect(new URL(to, req.nextUrl));

  if (!user) {
    const login = new URL('/login', req.nextUrl);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  if (user.status !== 'active') return redirect('/pending');

  if (pathname.startsWith('/admin') && user.role !== 'admin') {
    return redirect('/dashboard');
  }

  if (pathname.startsWith('/faculty') && user.role === 'student') {
    return redirect('/dashboard');
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/quiz/:path*', '/results/:path*', '/faculty/:path*', '/admin/:path*'],
};
