import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

/**
 * Edge-safe half of the auth setup: no database driver here, because `src/proxy.ts`
 * runs on the edge runtime where Mongoose cannot load. Only JWT-shaped data is touched.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.status = user.status;
        token.department = user.department;
      }
      // Lets a server action push fresh claims after a profile change.
      if (trigger === 'update' && session?.user) {
        const patch = session.user as Partial<Pick<JWT, 'role' | 'status'>>;
        token.role = patch.role ?? token.role;
        token.status = patch.status ?? token.status;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.department = token.department;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
