import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from '@/auth.config';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { loginSchema } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') return true;
      if (!profile?.email || !profile.sub) return false;

      // Google can return unverified emails (e.g. some Workspace/legacy flows).
      // Never link or create an account from an unverified address — an attacker
      // could otherwise claim someone else's email and take over their account.
      const emailVerified = (profile as { email_verified?: boolean }).email_verified;
      if (emailVerified !== true) return false;

      const googleId: string = profile.sub;
      const email: string = profile.email;

      await connectDB();

      let dbUser = await User.findOne({ googleId });

      if (!dbUser) {
        const existingByEmail = await User.findOne({ email });
        if (existingByEmail) {
          // An existing credentials account owns this email. Do not silently
          // link a new OAuth identity to it — require the user to sign in with
          // their password first and link Google from an authenticated session.
          return false;
        }

        dbUser = await User.create({
          name: profile.name ?? email,
          email,
          googleId,
          provider: 'google',
          image: (profile as { picture?: string }).picture,
          status: 'active',
        });
      }

      // Suspended and unapproved accounts must not receive a session at all.
      if (dbUser.status !== 'active') return false;

      // Mutate the OAuth profile user so the `jwt` callback sees our internal
      // id/role/status, keeping session shape identical to the credentials flow.
      user.id = dbUser._id.toString();
      user.role = dbUser.role;
      user.status = dbUser.status;
      user.department = dbUser.department?.toString();

      return true;
    },
  },
  providers: [
    Google,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        // Defense in depth: `loginAction` already rate-limits the UI path, but this
        // guards direct calls to the NextAuth credentials callback endpoint too.
        const ip = await getClientIp();
        if (!checkRateLimit(`authorize:ip:${ip}`, 20, 15 * 60 * 1000)) return null;

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
