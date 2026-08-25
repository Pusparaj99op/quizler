import mongoose, { Schema, Model } from 'mongoose';
import { QUESTION_TYPES, QUIZ_STATUSES, type QuestionType, type QuizStatus } from '@/lib/types';

export interface IQuestion {
  _id: mongoose.Types.ObjectId;
  type: QuestionType;
  text: string;
  /** Empty for `short` answers. */
  options: string[];
  /**
   * For mcq/multi/boolean these are option values; for `short` they are the accepted
   * answers, matched case-insensitively after trimming.
   */
  correctAnswers: string[];
  points: number;
  explanation?: string;
}

export interface IQuiz {
  title: string;
  description: string;
  questions: IQuestion[];
  createdBy: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  joinCode: string;
  status: QuizStatus;
  durationMinutes: number;
  opensAt?: Date;
  closesAt?: Date;
  shuffleQuestions: boolean;
  maxAttempts: number;
  showResultsImmediately: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  type: { type: String, enum: QUESTION_TYPES, required: true },
  text: { type: String, required: true, trim: true },
  options: { type: [String], default: [] },
  correctAnswers: { type: [String], default: [] },
  points: { type: Number, default: 1, min: 0 },
  explanation: { type: String, trim: true },
});

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    questions: { type: [questionSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    joinCode: { type: String, required: true, unique: true, uppercase: true },
    status: { type: String, enum: QUIZ_STATUSES, default: 'draft', required: true },
    durationMinutes: { type: Number, default: 30, min: 1 },
    opensAt: { type: Date },
    closesAt: { type: Date },
    shuffleQuestions: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1, min: 1 },
    showResultsImmediately: { type: Boolean, default: true },
  },
  { timestamps: true }
);

quizSchema.index({ createdBy: 1, status: 1 });
quizSchema.index({ course: 1, status: 1 });

export const Quiz: Model<IQuiz> =
  (mongoose.models.Quiz as Model<IQuiz>) ||
  mongoose.model<IQuiz>('Quiz', quizSchema);

/** Ambiguous characters (0/O, 1/I) are excluded so codes can be read aloud in class. */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateJoinCode(length = 6): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

/** Retries on the unique index rather than trusting a single random draw. */
export async function generateUniqueJoinCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateJoinCode();
    const clash = await Quiz.exists({ joinCode: code });
    if (!clash) return code;
  }
  throw new Error('Could not allocate a unique join code');
}
