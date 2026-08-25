import mongoose, { Schema, Model } from 'mongoose';

export interface IDepartment {
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  },
  { timestamps: true }
);

export const Department: Model<IDepartment> =
  (mongoose.models.Department as Model<IDepartment>) ||
  mongoose.model<IDepartment>('Department', departmentSchema);
