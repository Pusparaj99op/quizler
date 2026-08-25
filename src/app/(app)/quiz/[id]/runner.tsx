'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { saveAnswerAction, submitAttemptAction } from '@/actions/attempt.actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/field';
import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';
import type { QuestionType } from '@/lib/types';

/** Correct answers are deliberately absent - the server never sends them mid-attempt. */
export interface RunnerQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  points: number;
}

export interface RunnerProps {
  attemptId: string;
  quizTitle: string;
  questions: RunnerQuestion[];
  initialAnswers: Record<string, string[]>;
  /** Server-issued deadline in epoch milliseconds. */
  expiresAt: number;
}

const AUTOSAVE_DELAY_MS = 700;

export function QuizRunner({
  attemptId,
  quizTitle,
  questions,
  initialAnswers,
  expiresAt,
}: RunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string[]>>(initialAnswers);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.round((expiresAt - Date.now()) / 1000))
  );
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [submitting, startSubmit] = useTransition();

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const submitted = useRef(false);

  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    startSubmit(() => {
      void submitAttemptAction(attemptId);
    });
  }, [attemptId]);

  // The countdown is display only; it re-derives from the server deadline each tick so a
  // backgrounded tab cannot drift, and auto-submits once the deadline passes.
  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) submit();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, submit]);

  // Drop any autosave still waiting when the runner unmounts.
  useEffect(() => {
    const pending = timers;
    return () => Object.values(pending.current).forEach(clearTimeout);
  }, []);

  const persist = useCallback(
    (questionId: string, values: string[]) => {
      clearTimeout(timers.current[questionId]);
      setSaveState('saving');
      timers.current[questionId] = setTimeout(async () => {
        const result = await saveAnswerAction(attemptId, questionId, values);
        setSaveState(result.error ? 'error' : 'saved');
      }, AUTOSAVE_DELAY_MS);
    },
    [attemptId]
  );

  const setAnswer = useCallback(
    (questionId: string, values: string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: values }));
      persist(questionId, values);
    },
    [persist]
  );

  const question = questions[index];
  const answeredCount = useMemo(
    () => questions.filter((q) => (answers[q.id] ?? []).some((v) => v.trim() !== '')).length,
    [questions, answers]
  );

  if (!question) {
    return <Card>This quiz has no questions yet. Ask your instructor to add some.</Card>;
  }

  const current = answers[question.id] ?? [];
  const choices = question.type === 'boolean' ? ['true', 'false'] : question.options;
  const isMulti = question.type === 'multi';

  const toggle = (value: string) => {
    if (isMulti) {
      setAnswer(
        question.id,
        current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      );
    } else {
      setAnswer(question.id, [value]);
    }
  };

  const saveHint =
    saveState === 'saving'
      ? ' - saving...'
      : saveState === 'saved'
        ? ' - saved'
        : saveState === 'error'
          ? ' - could not save'
          : '';

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight">{quizTitle}</h1>
            <p className="text-xs text-muted">
              {answeredCount} of {questions.length} answered
              {saveHint}
            </p>
          </div>
          <div
            role="timer"
            aria-live="off"
            className={cn(
              'rounded-lg px-3 py-1.5 font-mono text-lg tabular-nums',
              remaining <= 60 ? 'bg-danger-soft text-danger' : 'bg-surface-muted'
            )}
          >
            {formatDuration(remaining)}
          </div>
        </div>
      </div>

      <nav aria-label="Questions" className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          const done = (answers[q.id] ?? []).some((v) => v.trim() !== '');
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index ? 'true' : undefined}
              className={cn(
                'h-8 w-8 rounded-lg border text-xs font-medium tabular-nums',
                i === index
                  ? 'border-accent bg-accent text-accent-foreground'
                  : done
                    ? 'border-success/40 bg-success-soft text-success'
                    : 'border-border text-muted hover:bg-surface-muted'
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Question {index + 1} of {questions.length}
          </p>
          <p className="text-xs text-muted">
            {question.points} point{question.points === 1 ? '' : 's'}
          </p>
        </div>

        <p className="text-base font-medium">{question.text}</p>

        {question.type === 'short' ? (
          <Input
            aria-label="Your answer"
            value={current[0] ?? ''}
            onChange={(event) => setAnswer(question.id, [event.target.value])}
            placeholder="Type your answer"
          />
        ) : (
          <fieldset className="space-y-2">
            <legend className="sr-only">
              {isMulti ? 'Select all that apply' : 'Select one answer'}
            </legend>
            {choices.map((choice) => {
              const selected = current.includes(choice);
              return (
                <label
                  key={choice}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm',
                    selected
                      ? 'border-accent bg-accent-soft'
                      : 'border-border hover:bg-surface-muted'
                  )}
                >
                  <input
                    type={isMulti ? 'checkbox' : 'radio'}
                    name={question.id}
                    checked={selected}
                    onChange={() => toggle(choice)}
                    className="accent-[var(--accent)]"
                  />
                  <span className={question.type === 'boolean' ? 'capitalize' : undefined}>
                    {choice}
                  </span>
                </label>
              );
            })}
          </fieldset>
        )}

        {isMulti ? <p className="text-xs text-muted">Select all that apply.</p> : null}
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Previous
        </Button>

        {index === questions.length - 1 ? (
          <Button type="button" onClick={submit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit quiz'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          >
            Next
          </Button>
        )}
      </div>

      {index !== questions.length - 1 ? (
        <p className="text-center">
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="text-sm text-muted underline underline-offset-4 hover:text-foreground"
          >
            Submit now without answering the rest
          </button>
        </p>
      ) : null}
    </div>
  );
}
