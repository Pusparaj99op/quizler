'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { Department } from '@/models/department.model';
import { registerSchema } from '@/lib/validation';

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: string;
}

const firstIssues = (issues: { path: PropertyKey[]; message: string }[]) => {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] ??= issue.message;
  }
  return out;
};

export async function registerAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    rollNumber: formData.get('rollNumber'),
    department: formData.get('department'),
  });

  if (!parsed.success) {
    return { fieldErrors: firstIssues(parsed.error.issues) };
  }

  const { name, email, password, role, rollNumber, department } = parsed.data;

  try {
    await connectDB();

    if (await User.exists({ email })) {
      return { fieldErrors: { email: 'An account with this email already exists' } };
    }

    const departmentDoc = department ? await Department.findById(department) : null;

    await User.create({
      name,
      email,
      password,
      role,
      // Faculty need an admin to vouch for them before they can author quizzes.
      status: role === 'faculty' ? 'pending' : 'active',
      rollNumber: rollNumber || undefined,
      department: departmentDoc?._id,
    });
  } catch {
    return { error: 'Could not create the account. Please try again.' };
  }

  if (role === 'faculty') {
    return {
      success:
        'Account created. An administrator must approve your faculty access before you can sign in.',
    };
  }

  await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  return {};
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const next = String(formData.get('next') || '/dashboard');

  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: next.startsWith('/') ? next : '/dashboard',
    });
    return {};
  } catch (error) {
    // A successful `signIn` throws a redirect error, which is not an AuthError, so it
    // falls through to the rethrow below and Next.js performs the redirect.
    if (error instanceof AuthError) {
      return { error: 'Incorrect email or password, or your account is not yet active.' };
    }
    throw error;
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
