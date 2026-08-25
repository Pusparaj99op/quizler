import type { DefaultSession } from 'next-auth';
import type { Role, UserStatus } from '@/lib/types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: UserStatus;
      department?: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
    status: UserStatus;
    department?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    status: UserStatus;
    department?: string;
  }
}
