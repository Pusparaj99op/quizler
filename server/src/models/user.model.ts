import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'super_admin' | 'institution_admin' | 'teacher' | 'student' | 'parent' | 'audience';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['super_admin', 'institution_admin', 'teacher', 'student', 'parent', 'audience'],
        default: 'student',
    },
}, {
    timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);