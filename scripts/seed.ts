/**
 * Seeds a development database with an admin, two departments, a course and one
 * published quiz. Safe to re-run: every write is an upsert keyed on a natural id.
 *
 *   npm run seed
 *
 * Credentials come from the environment so no password is ever committed:
 *   SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import { User } from '../src/models/user.model';
import { Department } from '../src/models/department.model';
import { Course } from '../src/models/course.model';
import { Quiz, generateUniqueJoinCode } from '../src/models/quiz.model';

const DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN?.trim() || 'college.edu';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL?.trim() || `admin@${DOMAIN}`;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD?.trim();
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD?.trim() || ADMIN_PASSWORD;

/**
 * `User.create` runs the password-hashing pre-save hook; `updateOne` would not, so
 * existing users are loaded and saved rather than patched in place.
 */
async function upsertUser(input: {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'admin';
  status?: 'active' | 'pending';
  rollNumber?: string;
  department?: mongoose.Types.ObjectId;
}) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    existing.name = input.name;
    existing.role = input.role;
    existing.status = input.status ?? 'active';
    existing.rollNumber = input.rollNumber;
    existing.department = input.department;
    await existing.save();
    return existing;
  }
  return User.create({ ...input, status: input.status ?? 'active' });
}

async function main() {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error(
      'Set SEED_ADMIN_PASSWORD in .env.local to at least 8 characters before seeding.'
    );
  }

  await connectDB();
  console.log(`Seeding ${mongoose.connection.name}...`);

  const [cse, ece] = await Promise.all([
    Department.findOneAndUpdate(
      { code: 'CSE' },
      { name: 'Computer Science and Engineering', code: 'CSE' },
      { upsert: true, new: true }
    ),
    Department.findOneAndUpdate(
      { code: 'ECE' },
      { name: 'Electronics and Communication', code: 'ECE' },
      { upsert: true, new: true }
    ),
  ]);

  const admin = await upsertUser({
    name: 'Platform Administrator',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    department: cse._id,
  });

  const faculty = await upsertUser({
    name: 'Dr. Anita Rao',
    email: `anita.rao@${DOMAIN}`,
    password: DEMO_PASSWORD!,
    role: 'faculty',
    department: cse._id,
  });

  const pendingFaculty = await upsertUser({
    name: 'Dr. Vikram Shah',
    email: `vikram.shah@${DOMAIN}`,
    password: DEMO_PASSWORD!,
    role: 'faculty',
    status: 'pending',
    department: ece._id,
  });

  const students = await Promise.all(
    [
      { name: 'Aarav Menon', roll: 'CSE21001' },
      { name: 'Priya Nair', roll: 'CSE21002' },
      { name: 'Rohit Verma', roll: 'CSE21003' },
    ].map((student, index) =>
      upsertUser({
        name: student.name,
        email: `student${index + 1}@${DOMAIN}`,
        password: DEMO_PASSWORD!,
        role: 'student',
        rollNumber: student.roll,
        department: cse._id,
      })
    )
  );

  const course = await Course.findOneAndUpdate(
    { code: 'CS201' },
    {
      name: 'Data Structures',
      code: 'CS201',
      department: cse._id,
      faculty: [faculty._id],
      students: students.map((student) => student._id),
    },
    { upsert: true, new: true }
  );

  const existingQuiz = await Quiz.findOne({ title: 'Data Structures - Unit 2' });
  const quiz =
    existingQuiz ??
    (await Quiz.create({
      title: 'Data Structures - Unit 2',
      description: 'Trees, heaps and hashing. One question of each supported type.',
      createdBy: faculty._id,
      course: course._id,
      joinCode: await generateUniqueJoinCode(),
      status: 'published',
      durationMinutes: 20,
      maxAttempts: 2,
      showResultsImmediately: true,
      questions: [
        {
          type: 'mcq',
          text: 'What is the worst-case time complexity of searching a balanced BST?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswers: ['O(log n)'],
          points: 2,
          explanation: 'A balanced tree halves the search space at every step.',
        },
        {
          type: 'multi',
          text: 'Which of these are self-balancing binary search trees?',
          options: ['AVL tree', 'Red-black tree', 'Binary heap', 'Splay tree'],
          correctAnswers: ['AVL tree', 'Red-black tree', 'Splay tree'],
          points: 3,
          explanation: 'A binary heap is not a search tree - it only maintains heap order.',
        },
        {
          type: 'boolean',
          text: 'A min-heap guarantees that an in-order traversal returns sorted values.',
          options: ['true', 'false'],
          correctAnswers: ['false'],
          points: 1,
          explanation: 'Heap order only constrains parent and child, not siblings.',
        },
        {
          type: 'short',
          text: 'Name the collision-resolution strategy that stores collided keys in a linked list.',
          options: [],
          correctAnswers: ['separate chaining', 'chaining'],
          points: 2,
        },
      ],
    }));

  console.log('\nSeed complete.');
  console.log(`  Admin           ${admin.email}`);
  console.log(`  Faculty         ${faculty.email} (active)`);
  console.log(`  Faculty         ${pendingFaculty.email} (pending approval)`);
  console.log(`  Students        ${students.map((s) => s.email).join(', ')}`);
  console.log(`  Course          ${course.code}`);
  console.log(`  Quiz            "${quiz.title}" - join code ${quiz.joinCode}`);
  console.log('\nDemo accounts share SEED_DEMO_PASSWORD (falls back to SEED_ADMIN_PASSWORD).');

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
