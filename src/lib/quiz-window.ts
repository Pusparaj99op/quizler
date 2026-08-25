import type { QuizStatus } from './types';

export interface QuizWindow {
  status: QuizStatus;
  opensAt?: Date | string | null;
  closesAt?: Date | string | null;
}

export type Availability = 'open' | 'upcoming' | 'closed' | 'draft';

/** Whether a student may start or continue an attempt right now. */
export function availability(quiz: QuizWindow, now = new Date()): Availability {
  if (quiz.status === 'draft') return 'draft';
  if (quiz.status === 'closed') return 'closed';
  if (quiz.opensAt && new Date(quiz.opensAt) > now) return 'upcoming';
  if (quiz.closesAt && new Date(quiz.closesAt) < now) return 'closed';
  return 'open';
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  open: 'Open now',
  upcoming: 'Not open yet',
  closed: 'Closed',
  draft: 'Draft',
};
