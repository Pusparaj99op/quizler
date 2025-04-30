import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    mediaUrl?: string;
}

export interface IQuiz extends Document {
    title: string;
    description: string;
    questions: IQuestion[];
    duration: number; // in seconds
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    explanation: { type: String },
    mediaUrl: { type: String }
});

const QuizSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    duration: { type: Number, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);