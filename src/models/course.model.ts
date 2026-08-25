import mongoose, { Schema, Model } from 'mongoose';

export interface ICourse {
  name: string;
  code: string;
  department: mongoose.Types.ObjectId;
  faculty: mongoose.Types.ObjectId[];
  students: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    faculty: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

courseSchema.index({ students: 1 });

export const Course: Model<ICourse> =
  (mongoose.models.Course as Model<ICourse>) ||
  mongoose.model<ICourse>('Course', courseSchema);
