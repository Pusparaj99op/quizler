import type { QuestionType } from './types';

export interface GradableQuestion {
  id: string;
  type: QuestionType;
  correctAnswers: string[];
  points: number;
}

export interface SubmittedAnswer {
  questionId: string;
  values: string[];
}

export interface QuestionResult {
  questionId: string;
  given: string[];
  correct: string[];
  earned: number;
  possible: number;
  isCorrect: boolean;
  isAnswered: boolean;
}

export interface ScoreBreakdown {
  score: number;
  maxScore: number;
  percentage: number;
  results: QuestionResult[];
}

const normalize = (value: string) => value.trim().toLowerCase();

const sameSet = (a: string[], b: string[]) => {
  const left = new Set(a.map(normalize));
  const right = new Set(b.map(normalize));
  if (left.size !== right.size) return false;
  for (const value of left) if (!right.has(value)) return false;
  return true;
};

/**
 * Grades one question. `multi` awards partial credit: each correct selection earns an
 * equal share of the points and each wrong selection cancels one out, floored at zero,
 * so guessing every option scores nothing.
 */
export function gradeQuestion(question: GradableQuestion, given: string[]): QuestionResult {
  const answered = given.some((value) => value.trim() !== '');
  const base: Omit<QuestionResult, 'earned' | 'isCorrect'> = {
    questionId: question.id,
    given,
    correct: question.correctAnswers,
    possible: question.points,
    isAnswered: answered,
  };

  if (!answered) {
    return { ...base, earned: 0, isCorrect: false };
  }

  if (question.type === 'multi') {
    const correct = new Set(question.correctAnswers.map(normalize));
    const selected = given.map(normalize);
    const hits = selected.filter((value) => correct.has(value)).length;
    const misses = selected.filter((value) => !correct.has(value)).length;
    const perOption = correct.size === 0 ? 0 : question.points / correct.size;
    const earned = Math.max(0, (hits - misses) * perOption);
    return {
      ...base,
      earned: Math.round(earned * 100) / 100,
      isCorrect: hits === correct.size && misses === 0,
    };
  }

  // mcq, boolean and short are all-or-nothing; `short` accepts any listed answer.
  const isCorrect =
    question.type === 'short'
      ? question.correctAnswers.some((answer) => normalize(answer) === normalize(given[0] ?? ''))
      : sameSet(given, question.correctAnswers);

  return { ...base, earned: isCorrect ? question.points : 0, isCorrect };
}

export function gradeAttempt(
  questions: GradableQuestion[],
  answers: SubmittedAnswer[]
): ScoreBreakdown {
  const byId = new Map(answers.map((answer) => [answer.questionId, answer.values]));

  const results = questions.map((question) =>
    gradeQuestion(question, byId.get(question.id) ?? [])
  );

  const score = Math.round(results.reduce((sum, r) => sum + r.earned, 0) * 100) / 100;
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  return {
    score,
    maxScore,
    percentage: maxScore === 0 ? 0 : Math.round((score / maxScore) * 1000) / 10,
    results,
  };
}
