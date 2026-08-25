import mongoose, { Schema, Model } from 'mongoose';
import { ATTEMPT_STATUSES, type AttemptStatus } from '@/lib/types';

export interface IAnswer {
  questionId: string;
  /** Always an array so `multi` and single-answer types share one shape. */
  values: string[];
}

export interface IAttempt {
  quiz: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  maxScore: number;
  status: AttemptStatus;
  startedAt: Date;
  /** Server-anchored deadline; the client timer is display only. */
  expiresAt: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionId: { type: String, required: true },
    values: { type: [String], default: [] },
  },
  { _id: false }
);

const attemptSchema = new Schema<IAttempt>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    status: { type: String, enum: ATTEMPT_STATUSES, default: 'in_progress', required: true },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

attemptSchema.index({ quiz: 1, student: 1 });
attemptSchema.index({ student: 1, status: 1 });

export const Attempt: Model<IAttempt> =
  (mongoose.models.Attempt as Model<IAttempt>) ||
  mongoose.model<IAttempt>('Attempt', attemptSchema);
