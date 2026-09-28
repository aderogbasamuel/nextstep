/**
 * Parse a deadline coming from the database or the API.
 *
 * Gemini returns a date like "2026-09-30", and saving it into a timestamp column
 * turns it into midnight UTC. That is really "the whole of Sept 30", so any
 * date-only value or exact-midnight-UTC timestamp is treated as 11:59:59 PM
 * local time on that calendar date. This keeps the countdown from ending a day
 * early and stops the date shifting for viewers west of UTC.
 * Timestamps with a real time of day are parsed as-is.
 */
export function parseDeadline(value: string | Date): Date {
  if (typeof value === "string") {
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnly) {
      const [, y, m, d] = dateOnly;
      return new Date(Number(y), Number(m) - 1, Number(d), 23, 59, 59);
    }
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return date;

  const isUtcMidnight =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0;

  if (isUtcMidnight) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
    );
  }

  return date;
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