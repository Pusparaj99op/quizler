'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { requireRole } from '@/lib/guards';
import { User } from '@/models/user.model';
import { Department } from '@/models/department.model';
import { Course } from '@/models/course.model';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';
import { gradeAttempt } from '@/lib/scoring';
import { courseSchema, departmentSchema, roleSchema } from '@/lib/validation';
import { USER_STATUSES, type UserStatus } from '@/lib/types';

export interface AdminActionState {
  error?: string;
  success?: string;
}

export async function setUserStatusAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await requireRole('admin');

  const userId = String(formData.get('userId') ?? '');
  const status = String(formData.get('status') ?? '');

  if (!mongoose.isValidObjectId(userId)) return { error: 'User not found.' };
  if (!USER_STATUSES.includes(status as UserStatus)) return { error: 'Unknown status.' };

  // Without this an admin could suspend themselves and lock everyone out of the panel.
  if (userId === admin.id) return { error: 'You cannot change your own status.' };

  const result = await User.updateOne({ _id: userId }, { $set: { status } });
  if (result.matchedCount === 0) return { error: 'User not found.' };

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  return { success: `Status set to ${status}.` };
}

export async function setUserRoleAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await requireRole('admin');

  const userId = String(formData.get('userId') ?? '');
  const parsed = roleSchema.safeParse(formData.get('role'));

  if (!mongoose.isValidObjectId(userId)) return { error: 'User not found.' };
  if (!parsed.success) return { error: 'Unknown role.' };
  if (userId === admin.id) return { error: 'You cannot change your own role.' };

  // Demoting the last admin would leave the institution with no one who can manage it.
  if (parsed.data !== 'admin') {
    const target = await User.findById(userId).select('role');
    if (target?.role === 'admin') {
      const admins = await User.countDocuments({ role: 'admin', status: 'active' });
      if (admins <= 1) return { error: 'There must be at least one active administrator.' };
    }
  }

  const result = await User.updateOne({ _id: userId }, { $set: { role: parsed.data } });
  if (result.matchedCount === 0) return { error: 'User not found.' };

  revalidatePath('/admin/users');
  return { success: `Role set to ${parsed.data}.` };
}

export async function createDepartmentAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireRole('admin');

  const parsed = departmentSchema.safeParse({
    name: formData.get('name'),
    code: formData.get('code'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid department.' };

  if (await Department.exists({ code: parsed.data.code })) {
    return { error: `A department with the code ${parsed.data.code} already exists.` };
  }

  await Department.create(parsed.data);
  revalidatePath('/admin/departments');
  return { success: `Created ${parsed.data.code}.` };
}

export async function deleteDepartmentAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireRole('admin');

  const departmentId = String(formData.get('departmentId') ?? '');
  if (!mongoose.isValidObjectId(departmentId)) return { error: 'Department not found.' };

  const courses = await Course.countDocuments({ department: departmentId });
  if (courses > 0) {
    return { error: `Move or delete the ${courses} course(s) in this department first.` };
  }

  await User.updateMany({ department: departmentId }, { $unset: { department: '' } });
  await Department.deleteOne({ _id: departmentId });

  revalidatePath('/admin/departments');
  return { success: 'Department deleted.' };
}

export async function createCourseAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireRole('admin');

  const parsed = courseSchema.safeParse({
    name: formData.get('name'),
    code: formData.get('code'),
    department: formData.get('department'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid course.' };

  if (!mongoose.isValidObjectId(parsed.data.department)) {
    return { error: 'Choose a department.' };
  }
  if (await Course.exists({ code: parsed.data.code })) {
    return { error: `A course with the code ${parsed.data.code} already exists.` };
  }

  await Course.create(parsed.data);
  revalidatePath('/admin/courses');
  return { success: `Created ${parsed.data.code}.` };
}

/** Adds or removes one member from a course roster. */
export async function updateCourseMemberAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireRole('admin');

  const courseId = String(formData.get('courseId') ?? '');
  const userId = String(formData.get('userId') ?? '');
  const list = String(formData.get('list') ?? '');
  const operation = String(formData.get('operation') ?? '');

  if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
    return { error: 'Course or user not found.' };
  }
  if (!['students', 'faculty'].includes(list)) return { error: 'Unknown roster.' };
  if (!['add', 'remove'].includes(operation)) return { error: 'Unknown operation.' };

  const update =
    operation === 'add' ? { $addToSet: { [list]: userId } } : { $pull: { [list]: userId } };

  const result = await Course.updateOne({ _id: courseId }, update);
  if (result.matchedCount === 0) return { error: 'Course not found.' };

  revalidatePath('/admin/courses');
  return { success: operation === 'add' ? 'Added to the course.' : 'Removed from the course.' };
}

/** Admin override: close a quiz that ran long, whoever owns it. */
export async function forceCloseQuizAction(
  _prev: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireRole('admin');

  const quizId = String(formData.get('quizId') ?? '');
  if (!mongoose.isValidObjectId(quizId)) return { error: 'Quiz not found.' };

  const quiz = await Quiz.findById(quizId);
  if (!quiz) return { error: 'Quiz not found.' };

  quiz.status = 'closed';
  await quiz.save();

  // Attempts still open would otherwise sit in progress forever, so grade them as they
  // stand rather than leaving students with an unscored submission.
  const gradable = quiz.questions.map((question) => ({
    id: question._id.toString(),
    type: question.type,
    correctAnswers: question.correctAnswers,
    points: question.points,
  }));

  const open = await Attempt.find({ quiz: quiz._id, status: 'in_progress' });
  for (const attempt of open) {
    const breakdown = gradeAttempt(
      gradable,
      attempt.answers.map((answer) => ({
        questionId: answer.questionId,
        values: answer.values,
      }))
    );
    attempt.score = breakdown.score;
    attempt.maxScore = breakdown.maxScore;
    attempt.status = 'expired';
    attempt.submittedAt = new Date();
    await attempt.save();
  }

  revalidatePath('/admin/quizzes');
  return { success: 'Quiz closed.' };
}
