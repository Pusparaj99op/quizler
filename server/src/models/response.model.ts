import mongoose, { Document, Schema } from 'mongoose';

export interface IResponse extends Document {
    quizId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    answers: Record<string, any>; // This can be adjusted based on the answer structure
    score: number;
    submittedAt: Date;
}

const ResponseSchema: Schema = new Schema({
    quizId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Quiz'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    answers: {
        type: Object,
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

export const Response = mongoose.model<IResponse>('Response', ResponseSchema);