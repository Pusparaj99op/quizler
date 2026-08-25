import { connectDB } from '@/lib/db';
import { Course } from '@/models/course.model';
import type { SessionUser } from '@/lib/guards';
import type { CourseOption } from '@/components/quiz-editor';

/** Courses a user may attach a quiz to: their own, or all of them for an admin. */
export async function coursesForUser(user: SessionUser): Promise<CourseOption[]> {
  await connectDB();

  const filter = user.role === 'admin' ? {} : { faculty: user.id };
  const courses = await Course.find(filter).sort({ code: 1 }).lean();

  return courses.map((course) => ({
    id: String(course._id),
    name: course.name,
    code: course.code,
  }));
}
