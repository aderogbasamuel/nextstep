import { getRemaining, parseDeadline, remainingLabel } from "@/lib/deadline";

/** One place for how a stored analysis status is shown, so the list and detail pages always agree. */
export function statusMeta(status: string) {
  switch (status) {
    case "eligible":
      return {
        label: "Eligible",
        badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
      };
    case "not_eligible":
      return {
        label: "Not eligible",
        badge: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
      };
    default:
      return {
        label: "Needs review",
        badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
      };
  }
}

export function formatType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function matchTone(match: number) {
  if (match >= 75) return { bar: "bg-blue-600", text: "text-slate-900" };
  if (match >= 50) return { bar: "bg-amber-500", text: "text-slate-900" };
  return { bar: "bg-red-400", text: "text-slate-900" };
}

export type DeadlineTone = "none" | "passed" | "urgent" | "soon" | "ok";

const DAY_MS = 24 * 60 * 60 * 1000;

export function deadlineInfo(value: string | null, now: number = Date.now()) {
  if (!value) {
    return { tone: "none" as DeadlineTone, date: "No deadline", label: "", time: null };
  }

  const target = parseDeadline(value);
  const date = target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const remaining = getRemaining(target, now);

  if (!remaining) {
    return { tone: "passed" as DeadlineTone, date, label: "Passed", time: target.getTime() };
  }

  const tone: DeadlineTone =
    remaining.totalMs < 3 * DAY_MS ? "urgent" : remaining.totalMs < 7 * DAY_MS ? "soon" : "ok";

  return { tone, date, label: remainingLabel(target, now), time: target.getTime() };
}

export const deadlineToneClass: Record<DeadlineTone, string> = {
  none: "text-slate-400",
  passed: "text-slate-400",
  urgent: "text-red-600",
  soon: "text-amber-600",
  ok: "text-slate-500",
};

export type StatusBucket = "eligible" | "needs_review" | "not_eligible";

/** Unknown or legacy statuses count as "needs review", on every page. */
export function statusBucket(status: string): StatusBucket {
  return status === "eligible" || status === "not_eligible"
    ? status
    : "needs_review";
}