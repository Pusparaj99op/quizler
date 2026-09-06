import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, USER_STATUSES, type Role, type UserStatus } from '@/lib/types';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  provider: 'credentials' | 'google';
  role: Role;
  status: UserStatus;
  rollNumber?: string;
  department?: mongoose.Types.ObjectId;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = Model<IUser, object, IUserMethods>;
export type UserDoc = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Google-authenticated accounts have no local password.
      required: [
        function (this: UserDoc) {
          return this.provider === 'credentials';
        },
        'Password is required',
      ],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, enum: ['credentials', 'google'], default: 'credentials', required: true },
    role: { type: String, enum: ROLES, default: 'student', required: true },
    // Faculty accounts are created as `pending` and must be approved by an admin.
    status: { type: String, enum: USER_STATUSES, default: 'active', required: true },
    rollNumber: { type: String, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    image: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (this: UserDoc) {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.method('comparePassword', function (this: UserDoc, candidate: string) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
});

export const User: UserModel =
  (mongoose.models.User as UserModel) ||
  mongoose.model<IUser, UserModel>('User', userSchema);
