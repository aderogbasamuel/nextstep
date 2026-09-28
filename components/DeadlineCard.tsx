"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CalendarPlus } from "lucide-react";

import { downloadDeadlineIcs } from "@/lib/calendar";
import {
  formatDeadline,
  getRemaining,
  parseDeadline,
  remainingLabel,
} from "@/lib/deadline";

type Props = {
  analysisId: number;
  title: string;
  organization: string | null;
  /** ISO string or "YYYY-MM-DD" from the database, or null if none was extracted. */
  deadline: string | null;
};

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default function DeadlineCard({
  analysisId,
  title,
  organization,
  deadline,
}: Props) {
  // null until mounted, so server and client render the same markup (no hydration mismatch).
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!deadline) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 text-slate-600">
          <CalendarDays className="size-5" />
          <p className="text-sm font-semibold">Application deadline</p>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          No deadline was found in this document. Check the original source
          before you plan your steps.
        </p>
      </section>
    );
  }

  const target = parseDeadline(deadline);
  const remaining = now === null ? null : getRemaining(target, now);
  const passed = now !== null && remaining === null;
  const urgent = remaining !== null && remaining.totalMs < THREE_DAYS_MS;

  const tone = passed
    ? {
        card: "border-slate-200 bg-slate-50",
        text: "text-slate-700",
        strong: "text-slate-900",
        tile: "bg-white text-slate-500",
        button: "border-slate-300 text-slate-700 hover:bg-white",
      }
    : urgent
      ? {
          card: "border-red-200 bg-red-50",
          text: "text-red-800",
          strong: "text-red-950",
          tile: "bg-white text-red-700",
          button: "border-red-300 text-red-800 hover:bg-white",
        }
      : {
          card: "border-amber-200 bg-amber-50",
          text: "text-amber-800",
          strong: "text-amber-950",
          tile: "bg-white text-amber-700",
          button: "border-amber-300 text-amber-900 hover:bg-white",
        };

  const tiles: { label: string; value: number | null }[] = [
    { label: "Days", value: remaining?.days ?? null },
    { label: "Hours", value: remaining?.hours ?? null },
    { label: "Min", value: remaining?.minutes ?? null },
    { label: "Sec", value: remaining?.seconds ?? null },
  ];

  return (
    <section className={`rounded-xl border p-6 ${tone.card}`}>
      <div className={`flex items-center gap-2 ${tone.text}`}>
        <CalendarDays className="size-5" />
        <p className="text-sm font-semibold">Application deadline</p>
      </div>

      <p className={`mt-4 text-2xl font-bold ${tone.strong}`}>
        {formatDeadline(target)}
      </p>

      {passed ? (
        <p className={`mt-2 text-sm font-medium ${tone.text}`}>
          Deadline passed
        </p>
      ) : (
        <>
          {/* Screen readers get one stable label instead of a ticking clock. */}
          <p className="sr-only">
            {now === null ? "" : remainingLabel(target, now)}
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
            {tiles.map((t) => (
              <div
                key={t.label}
                className={`rounded-lg px-1 py-2 text-center ${tone.tile}`}
              >
                <p className="text-xl font-bold tabular-nums leading-none">
                  {t.value === null ? "--" : String(t.value).padStart(2, "0")}
                </p>
                <p className="mt-1 text-[11px] font-medium">{t.label}</p>
              </div>
            ))}
          </div>
          {urgent && (
            <p className={`mt-3 text-xs font-medium ${tone.text}`}>
              Less than 3 days left. Finish the open steps first.
            </p>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() =>
          downloadDeadlineIcs({
            analysisId,
            title,
            organization,
            deadline: target,
            url: window.location.href,
          })
        }
        className={`mt-5 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${tone.button}`}
      >
        <CalendarPlus className="size-4" />
        Add to calendar
      </button>
    </section>
  );
}