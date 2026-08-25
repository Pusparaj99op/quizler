import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { loginSchema } from '@/lib/validation';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        await connectDB();
        // `password` is `select: false` on the schema, so ask for it explicitly.
        const user = await User.findOne({ email: parsed.data.email }).select('+password');
        if (!user) return null;

        const ok = await user.comparePassword(parsed.data.password);
        if (!ok) return null;

        // Suspended and unapproved accounts must not receive a session at all.
        if (user.status !== 'active') return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          status: user.status,
          department: user.department?.toString(),
        };
      },
    }),
  ],
});
