// Simple date formatter without date-fns dependency
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format score as percentage
export const formatScore = (score: number, total: number): string => {
  const percentage = (score / total) * 100;
  return `${percentage.toFixed(0)}%`;
};