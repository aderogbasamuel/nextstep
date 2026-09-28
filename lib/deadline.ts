/**
 * Parse a deadline coming from the database.
 * - "2026-09-30" (date only) -> 11:59:59 PM local time that day, so the
 *   countdown doesn't hit zero at midnight and the date never shifts a day
 *   for viewers in other time zones.
 * - Full timestamps are parsed as-is.
 */
export function parseDeadline(value: string | Date): Date {
  if (value instanceof Date) return value;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, y, m, d] = dateOnly;
    return new Date(Number(y), Number(m) - 1, Number(d), 23, 59, 59);
  }
  return new Date(value);
}

export function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

/** Returns null once the deadline has passed. */
export function getRemaining(target: Date, now: number = Date.now()): Remaining | null {
  const totalMs = target.getTime() - now;
  if (totalMs <= 0) return null;
  const s = Math.floor(totalMs / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    totalMs,
  };
}

/** Short human label, e.g. "3 days left", "Due today", "Deadline passed". */
export function remainingLabel(target: Date, now: number = Date.now()): string {
  const r = getRemaining(target, now);
  if (!r) return "Deadline passed";
  if (r.days === 0) return "Due today";
  if (r.days === 1) return "1 day left";
  return `${r.days} days left`;
}