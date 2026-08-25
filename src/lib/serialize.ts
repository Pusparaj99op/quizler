/**
 * Mongoose lean() documents still contain ObjectId and Date instances, which cannot
 * cross the server/client boundary. These helpers narrow them to plain values.
 */
export function id(value: unknown): string {
  return String(value);
}

export function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
