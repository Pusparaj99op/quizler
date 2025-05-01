import { Document } from 'mongoose';

export interface IQuestion {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResponse extends Document {
  quiz: string;
  user: string;
  answers: string[];
  score: number;
  createdAt: Date;
}

export interface QuizData {
  title: string;
  description: string;
  questions: IQuestion[];
}

export interface QuizResponse {
  quiz: string;
  answers: string[];
}