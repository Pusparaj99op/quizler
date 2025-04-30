import { format } from 'date-fns';

/**
 * Formats a date to a readable string.
 * @param date - The date to format.
 * @param dateFormat - The format string (default: 'MMMM dd, yyyy').
 * @returns The formatted date string.
 */
export const formatDate = (date: Date, dateFormat: string = 'MMMM dd, yyyy'): string => {
    return format(date, dateFormat);
};

/**
 * Formats a score to a percentage string.
 * @param score - The score to format.
 * @param total - The total possible score.
 * @returns The formatted percentage string.
 */
export const formatScore = (score: number, total: number): string => {
    if (total === 0) return '0%';
    const percentage = (score / total) * 100;
    return `${percentage.toFixed(2)}%`;
};

/**
 * Formats a time duration in seconds to a readable string.
 * @param seconds - The duration in seconds.
 * @returns The formatted time string (e.g., '2 minutes 30 seconds').
 */
export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
};