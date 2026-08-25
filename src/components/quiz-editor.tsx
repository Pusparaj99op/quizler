'use client';

import { useActionState, useCallback, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import type { QuizActionState } from '@/actions/quiz.actions';
import { Button } from '@/components/ui/button';
import { Card, SectionHeading } from '@/components/ui/card';
import { Field, FormError, Input, Select, Textarea } from '@/components/ui/field';
import { cn } from '@/lib/cn';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS, type QuestionType } from '@/lib/types';

export interface EditorQuestion {
  key: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswers: string[];
  points: number;
  explanation: string;
}

export interface EditorQuiz {
  title: string;
  description: string;
  course: string;
  durationMinutes: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  opensAt: string;
  closesAt: string;
  questions: EditorQuestion[];
}

export interface CourseOption {
  id: string;
  name: string;
  code: string;
}

let keyCounter = 0;
const nextKey = () => `q${Date.now().toString(36)}-${keyCounter++}`;

export function blankQuestion(type: QuestionType = 'mcq'): EditorQuestion {
  return {
    key: nextKey(),
    type,
    text: '',
    options: type === 'short' ? [] : type === 'boolean' ? ['true', 'false'] : ['', ''],
    correctAnswers: [],
    points: 1,
    explanation: '',
  };
}

export const emptyQuiz = (): EditorQuiz => ({
  title: '',
  description: '',
  course: '',
  durationMinutes: 30,
  maxAttempts: 1,
  shuffleQuestions: false,
  showResultsImmediately: true,
  opensAt: '',
  closesAt: '',
  questions: [blankQuestion()],
});

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : label}
    </Button>
  );
}

function QuestionEditor({
  question,
  index,
  total,
  error,
  onChange,
  onMove,
  onDuplicate,
  onRemove,
}: {
  question: EditorQuestion;
  index: number;
  total: number;
  error?: string;
  onChange: (patch: Partial<EditorQuestion>) => void;
  onMove: (delta: number) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const isMulti = question.type === 'multi';
  const isShort = question.type === 'short';
  const choices = question.type === 'boolean' ? ['true', 'false'] : question.options;

  const changeType = (type: QuestionType) => {
    onChange({
      type,
      options: type === 'short' ? [] : type === 'boolean' ? ['true', 'false'] : ['', ''],
      // The old answers refer to options that no longer exist.
      correctAnswers: [],
    });
  };

  const setOption = (optionIndex: number, value: string) => {
    const options = [...question.options];
    const previous = options[optionIndex];
    options[optionIndex] = value;
    onChange({
      options,
      // Keep the answer pointing at the renamed option instead of silently unmarking it.
      correctAnswers: question.correctAnswers.map((answer) =>
        answer === previous ? value : answer
      ),
    });
  };

  const toggleCorrect = (value: string) => {
    if (isMulti) {
      onChange({
        correctAnswers: question.correctAnswers.includes(value)
          ? question.correctAnswers.filter((answer) => answer !== value)
          : [...question.correctAnswers, value],
      });
    } else {
      onChange({ correctAnswers: [value] });
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Question {index + 1}
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label={`Move question ${index + 1} up`}
          >
            Up
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label={`Move question ${index + 1} down`}
          >
            Down
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDuplicate}>
            Duplicate
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={total === 1}
            className="text-danger"
          >
            Remove
          </Button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <Field label="Question type">
          <Select
            value={question.type}
            onChange={(event) => changeType(event.target.value as QuestionType)}
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {QUESTION_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Points">
          <Input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={question.points}
            onChange={(event) => onChange({ points: Number(event.target.value) })}
          />
        </Field>
      </div>

      <Field label="Question">
        <Textarea
          value={question.text}
          onChange={(event) => onChange({ text: event.target.value })}
          placeholder="What is the time complexity of binary search?"
        />
      </Field>

      {isShort ? (
        <Field
          label="Accepted answers"
          hint="One per line. Matching ignores case and surrounding spaces."
        >
          <Textarea
            value={question.correctAnswers.join('\n')}
            onChange={(event) =>
              onChange({
                correctAnswers: event.target.value.split('\n').map((line) => line.trim()),
              })
            }
            placeholder={'O(log n)\nlog n'}
          />
        </Field>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Options{' '}
            <span className="font-normal text-muted">
              - {isMulti ? 'tick every correct answer' : 'tick the correct answer'}
            </span>
          </p>

          {choices.map((option, optionIndex) => {
            const checked = question.correctAnswers.includes(option) && option !== '';
            return (
              <div key={optionIndex} className="flex items-center gap-2">
                <input
                  type={isMulti ? 'checkbox' : 'radio'}
                  name={`correct-${question.key}`}
                  checked={checked}
                  disabled={option === ''}
                  onChange={() => toggleCorrect(option)}
                  aria-label={`Mark option ${optionIndex + 1} correct`}
                  className="accent-[var(--accent)]"
                />
                {question.type === 'boolean' ? (
                  <span className="flex-1 rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm capitalize">
                    {option}
                  </span>
                ) : (
                  <>
                    <Input
                      value={option}
                      onChange={(event) => setOption(optionIndex, event.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      aria-label={`Option ${optionIndex + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={question.options.length <= 2}
                      onClick={() =>
                        onChange({
                          options: question.options.filter((_, i) => i !== optionIndex),
                          correctAnswers: question.correctAnswers.filter((a) => a !== option),
                        })
                      }
                      aria-label={`Remove option ${optionIndex + 1}`}
                    >
                      Remove
                    </Button>
                  </>
                )}
              </div>
            );
          })}

          {question.type !== 'boolean' ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onChange({ options: [...question.options, ''] })}
            >
              Add option
            </Button>
          ) : null}
        </div>
      )}

      <Field label="Explanation" hint="Shown to students on the results page. Optional.">
        <Input
          value={question.explanation}
          onChange={(event) => onChange({ explanation: event.target.value })}
        />
      </Field>
    </Card>
  );
}

export function QuizEditor({
  action,
  initial,
  quizId,
  courses,
  submitLabel,
}: {
  action: (state: QuizActionState, formData: FormData) => Promise<QuizActionState>;
  initial: EditorQuiz;
  quizId?: string;
  courses: CourseOption[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<QuizActionState, FormData>(action, {});
  const [quiz, setQuiz] = useState<EditorQuiz>(initial);

  const set = useCallback(
    <K extends keyof EditorQuiz>(key: K, value: EditorQuiz[K]) =>
      setQuiz((prev) => ({ ...prev, [key]: value })),
    []
  );

  const setQuestion = useCallback((index: number, patch: Partial<EditorQuestion>) => {
    setQuiz((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], ...patch };
      return { ...prev, questions };
    });
  }, []);

  const moveQuestion = useCallback((index: number, delta: number) => {
    setQuiz((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.questions.length) return prev;
      const questions = [...prev.questions];
      [questions[index], questions[target]] = [questions[target], questions[index]];
      return { ...prev, questions };
    });
  }, []);

  const totalPoints = useMemo(
    () => quiz.questions.reduce((sum, question) => sum + (Number(question.points) || 0), 0),
    [quiz.questions]
  );

  // The payload drops the client-only `key` and is validated again server-side.
  const payload = JSON.stringify({
    ...quiz,
    questions: quiz.questions.map((question) => ({
      type: question.type,
      text: question.text,
      options: question.options,
      correctAnswers: question.correctAnswers,
      points: question.points,
      explanation: question.explanation,
    })),
  });

  const fieldErrors = state.fieldErrors ?? {};
  const questionError = (index: number) =>
    Object.entries(fieldErrors).find(([path]) => path.startsWith(`questions.${index}.`))?.[1];

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="payload" value={payload} />
      {quizId ? <input type="hidden" name="quizId" value={quizId} /> : null}

      <FormError>{state.error}</FormError>

      <Card className="space-y-4">
        <SectionHeading title="Details" />

        <Field label="Title">
          <Input
            value={quiz.title}
            onChange={(event) => set('title', event.target.value)}
            placeholder="Data Structures - Unit 2"
            required
          />
          {fieldErrors.title ? (
            <span className="block text-xs text-danger">{fieldErrors.title}</span>
          ) : null}
        </Field>

        <Field label="Description">
          <Textarea
            value={quiz.description}
            onChange={(event) => set('description', event.target.value)}
            placeholder="Covers trees, heaps and hashing."
          />
        </Field>

        <Field label="Course">
          <Select value={quiz.course} onChange={(event) => set('course', event.target.value)}>
            <option value="">No course (join by code only)</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card className="space-y-4">
        <SectionHeading title="Rules" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Time limit (minutes)">
            <Input
              type="number"
              min={1}
              max={600}
              value={quiz.durationMinutes}
              onChange={(event) => set('durationMinutes', Number(event.target.value))}
            />
          </Field>
          <Field label="Attempts allowed">
            <Input
              type="number"
              min={1}
              max={10}
              value={quiz.maxAttempts}
              onChange={(event) => set('maxAttempts', Number(event.target.value))}
            />
          </Field>
          <Field label="Opens at" hint="Leave blank to open as soon as it is published.">
            <Input
              type="datetime-local"
              value={quiz.opensAt}
              onChange={(event) => set('opensAt', event.target.value)}
            />
          </Field>
          <Field label="Closes at" hint="Leave blank for no closing time.">
            <Input
              type="datetime-local"
              value={quiz.closesAt}
              onChange={(event) => set('closesAt', event.target.value)}
            />
          </Field>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={quiz.shuffleQuestions}
              onChange={(event) => set('shuffleQuestions', event.target.checked)}
              className="accent-[var(--accent)]"
            />
            Shuffle question order for each student
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={quiz.showResultsImmediately}
              onChange={(event) => set('showResultsImmediately', event.target.checked)}
              className="accent-[var(--accent)]"
            />
            Show students their score and answers straight after submitting
          </label>
        </div>
      </Card>

      <section className="space-y-4">
        <SectionHeading
          title="Questions"
          description={`${quiz.questions.length} question(s), ${totalPoints} point(s) total.`}
        />

        {quiz.questions.map((question, index) => (
          <QuestionEditor
            key={question.key}
            question={question}
            index={index}
            total={quiz.questions.length}
            error={questionError(index)}
            onChange={(patch) => setQuestion(index, patch)}
            onMove={(delta) => moveQuestion(index, delta)}
            onDuplicate={() =>
              setQuiz((prev) => {
                const questions = [...prev.questions];
                questions.splice(index + 1, 0, { ...question, key: nextKey() });
                return { ...prev, questions };
              })
            }
            onRemove={() =>
              setQuiz((prev) => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== index),
              }))
            }
          />
        ))}

        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setQuiz((prev) => ({ ...prev, questions: [...prev.questions, blankQuestion(type)] }))
              }
            >
              Add {QUESTION_TYPE_LABELS[type].toLowerCase()}
            </Button>
          ))}
        </div>
      </section>

      <div
        className={cn(
          'sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-border',
          'bg-background/95 px-4 py-3 backdrop-blur'
        )}
      >
        <p className="text-sm text-muted">
          {quiz.questions.length} question(s) - {totalPoints} point(s)
        </p>
        <SaveButton label={submitLabel} />
      </div>
    </form>
  );
}
