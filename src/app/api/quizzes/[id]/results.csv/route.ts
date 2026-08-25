import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import { Quiz } from '@/models/quiz.model';
import { Attempt } from '@/models/attempt.model';

/**
 * Escapes a CSV cell. The leading-quote guard stops spreadsheet apps from evaluating
 * a name like `=cmd()` as a formula.
 */
function cell(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Route handlers are not covered by middleware's matcher, so authorize here.
  const session = await auth();
  const user = session?.user;
  if (!user || user.status !== 'active' || user.role === 'student') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await connectDB();
  const quiz = await Quiz.findById(id).lean();
  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (user.role !== 'admin' && String(quiz.createdBy) !== user.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const attempts = await Attempt.find({ quiz: quiz._id, status: { $ne: 'in_progress' } })
    .populate<{ student: { name: string; email: string; rollNumber?: string } | null }>(
      'student',
      'name email rollNumber'
    )
    .sort({ score: -1 })
    .lean();

  const rows = [
    ['Name', 'Email', 'Roll number', 'Score', 'Max score', 'Percentage', 'Status', 'Submitted at'],
    ...attempts.map((attempt) => [
      attempt.student?.name ?? 'Deleted user',
      attempt.student?.email ?? '',
      attempt.student?.rollNumber ?? '',
      attempt.score,
      attempt.maxScore,
      attempt.maxScore === 0
        ? 0
        : Math.round((attempt.score / attempt.maxScore) * 1000) / 10,
      attempt.status,
      attempt.submittedAt?.toISOString() ?? '',
    ]),
  ];

  const csv = rows.map((row) => row.map(cell).join(',')).join('\r\n');
  const filename = `${quiz.joinCode}-results.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
