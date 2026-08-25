const DATE_TIME = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

/** Formatted in UTC so the server render and the client hydration agree. */
export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return '-';
  return `${DATE_TIME.format(new Date(value))} UTC`;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}
