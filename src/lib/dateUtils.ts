/**
 * Returns YYYY-MM-DD in the browser's local timezone.
 * Uses Swedish locale ('sv') which natively formats as ISO date.
 */
export function toLocalDateString(date: Date = new Date()): string {
  return date.toLocaleDateString('sv')
}
