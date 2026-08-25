import { describe, it, expect } from 'vitest';
import { gradeAttempt, gradeQuestion, type GradableQuestion } from '../scoring';

const q = (over: Partial<GradableQuestion> & { id: string }): GradableQuestion => ({
  type: 'mcq',
  correctAnswers: ['a'],
  points: 1,
  ...over,
});

describe('gradeQuestion', () => {
  it('awards full points for a correct single choice', () => {
    expect(gradeQuestion(q({ id: '1' }), ['a']).earned).toBe(1);
  });

  it('awards nothing for a wrong single choice', () => {
    const r = gradeQuestion(q({ id: '1' }), ['b']);
    expect(r.earned).toBe(0);
    expect(r.isCorrect).toBe(false);
  });

  it('marks unanswered questions as unanswered and scores zero', () => {
    const r = gradeQuestion(q({ id: '1', points: 5 }), []);
    expect(r.earned).toBe(0);
    expect(r.isAnswered).toBe(false);
  });

  it('treats whitespace-only input as unanswered', () => {
    expect(gradeQuestion(q({ id: '1', type: 'short' }), ['   ']).isAnswered).toBe(false);
  });

  it('matches short answers case-insensitively and accepts any listed answer', () => {
    const question = q({ id: '1', type: 'short', correctAnswers: ['Paris', 'paris, france'] });
    expect(gradeQuestion(question, ['  PARIS ']).earned).toBe(1);
    expect(gradeQuestion(question, ['Paris, France']).earned).toBe(1);
    expect(gradeQuestion(question, ['Lyon']).earned).toBe(0);
  });

  it('grades true/false', () => {
    const question = q({ id: '1', type: 'boolean', correctAnswers: ['true'] });
    expect(gradeQuestion(question, ['true']).earned).toBe(1);
    expect(gradeQuestion(question, ['false']).earned).toBe(0);
  });

  describe('multi-select partial credit', () => {
    const question = q({ id: '1', type: 'multi', correctAnswers: ['a', 'b'], points: 4 });

    it('gives full points for an exact match regardless of order', () => {
      const r = gradeQuestion(question, ['b', 'a']);
      expect(r.earned).toBe(4);
      expect(r.isCorrect).toBe(true);
    });

    it('gives half for one of two correct', () => {
      const r = gradeQuestion(question, ['a']);
      expect(r.earned).toBe(2);
      expect(r.isCorrect).toBe(false);
    });

    it('cancels a correct pick with a wrong one', () => {
      expect(gradeQuestion(question, ['a', 'c']).earned).toBe(0);
    });

    it('never goes negative when everything is selected', () => {
      expect(gradeQuestion(question, ['a', 'b', 'c', 'd']).earned).toBe(0);
    });
  });
});

describe('gradeAttempt', () => {
  const questions = [
    q({ id: '1', points: 2 }),
    q({ id: '2', type: 'multi', correctAnswers: ['x', 'y'], points: 4 }),
    q({ id: '3', type: 'short', correctAnswers: ['ok'], points: 1 }),
  ];

  it('totals earned and possible points', () => {
    const out = gradeAttempt(questions, [
      { questionId: '1', values: ['a'] },
      { questionId: '2', values: ['x'] },
      { questionId: '3', values: ['ok'] },
    ]);
    expect(out.maxScore).toBe(7);
    expect(out.score).toBe(5);
    expect(out.percentage).toBe(71.4);
  });

  it('scores an empty submission as zero without dropping questions', () => {
    const out = gradeAttempt(questions, []);
    expect(out.score).toBe(0);
    expect(out.maxScore).toBe(7);
    expect(out.results).toHaveLength(3);
    expect(out.results.every((r) => !r.isAnswered)).toBe(true);
  });

  it('ignores answers for questions that no longer exist', () => {
    const out = gradeAttempt(questions, [{ questionId: 'gone', values: ['a'] }]);
    expect(out.score).toBe(0);
    expect(out.results).toHaveLength(3);
  });

  it('reports 0% rather than NaN for a quiz worth nothing', () => {
    expect(gradeAttempt([], []).percentage).toBe(0);
  });
});
