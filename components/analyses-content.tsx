"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpDown, FileText, RefreshCw, Search } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import {
  deadlineInfo,
  deadlineToneClass,
  formatType,
  matchTone,
  statusMeta,
} from "@/lib/analysis-ui";

type Analysis = {
  id: number;
  title: string;
  type: string;
  organization: string | null;
  match: number;
  status: "eligible" | "not_eligible" | "needs_review" | string;
  deadline: string | null;
  createdAt: string;
};

type StatusFilter = "all" | "eligible" | "needs_review" | "not_eligible";
type SortKey = "newest" | "deadline" | "match";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "eligible", label: "Eligible" },
  { value: "needs_review", label: "Needs review" },
  { value: "not_eligible", label: "Not eligible" },
];

const ROW_GRID =
  "sm:grid-cols-[minmax(0,1.6fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]";

export function AnalysesContent() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/analyses", { signal });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);

      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error("Unexpected response shape");

      setAnalyses(data as Analysis[]);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      console.error(err);
      setError("We couldn't load your analyses. Check your connection and try again.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      all: analyses.length,
      eligible: 0,
      needs_review: 0,
      not_eligible: 0,
    };
    for (const a of analyses) {
      if (a.status === "eligible") base.eligible += 1;
      else if (a.status === "not_eligible") base.not_eligible += 1;
      else base.needs_review += 1;
    }
    return base;
  }, [analyses]);

  const closingSoon = useMemo(
    () =>
      analyses.filter((a) => {
        const tone = deadlineInfo(a.deadline).tone;
        return tone === "urgent" || tone === "soon";
      }).length,
    [analyses],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = analyses.filter((a) => {
      const bucket =
        a.status === "eligible" || a.status === "not_eligible"
          ? a.status
          : "needs_review";
      if (statusFilter !== "all" && bucket !== statusFilter) return false;
      if (!q) return true;
      return [a.title, a.organization ?? "", formatType(a.type)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    const now = Date.now();
    // Upcoming deadlines first (soonest on top), then no deadline, then passed.
    const deadlineRank = (a: Analysis) => {
      const info = deadlineInfo(a.deadline, now);
      if (info.tone === "none") return [1, 0] as const;
      if (info.tone === "passed") return [2, -(info.time ?? 0)] as const;
      return [0, info.time ?? 0] as const;
    };

    return [...list].sort((a, b) => {
      if (sort === "match") return b.match - a.match;
      if (sort === "deadline") {
        const [ra, ta] = deadlineRank(a);
        const [rb, tb] = deadlineRank(b);
        return ra - rb || ta - tb;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [analyses, query, statusFilter, sort]);

  const filtersActive = query.trim() !== "" || statusFilter !== "all";

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 py-9 lg:px-10 lg:py-11">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <PageHeader
            eyebrow="Your workspace"
            title="My analyses"
            description="Every opportunity you've reviewed, with what's left to do."
          />

          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            + Analyze document
          </Link>
        </div>

        {!loading && !error && analyses.length > 0 && (
          <dl className="mt-8 grid grid-cols-3 gap-3">
            <Stat label="Analyzed" value={counts.all} />
            <Stat label="Eligible" value={counts.eligible} />
            <Stat
              label="Closing within 7 days"
              value={closingSoon}
              highlight={closingSoon > 0}
            />
          </dl>
        )}

        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search opportunities"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, organization or type"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <select
              aria-label="Sort analyses"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-auto"
            >
              <option value="newest">Newest first</option>
              <option value="deadline">Deadline soonest</option>
              <option value="match">Best match</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => {
            const active = statusFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {f.label}
                <span className={`ml-1.5 tabular-nums ${active ? "text-blue-100" : "text-slate-400"}`}>
                  {counts[f.value]}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div
            className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white"
            aria-busy="true"
            aria-label="Loading your analyses"
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-0">
                <div className="size-9 rounded-lg bg-slate-100 motion-safe:animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-slate-100 motion-safe:animate-pulse" />
                  <div className="h-3 w-1/5 rounded bg-slate-100 motion-safe:animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => load()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3.5 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-500">
              <FileText className="size-5" />
            </div>

            {filtersActive ? (
              <>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  No analyses match your search
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different search or status.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("all");
                  }}
                  className="mt-5 inline-flex rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear search and filters
                </button>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  You haven&apos;t analyzed anything yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Upload a job, scholarship or grant document to see if you qualify and what to do next.
                </p>
                <Link
                  href="/analyze"
                  className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Analyze your first document
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="mt-5 text-xs text-slate-400" aria-live="polite">
              Showing {visible.length} of {analyses.length}
            </p>

            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div
                className={`hidden gap-4 border-b border-slate-100 px-5 py-3 text-xs font-semibold text-slate-400 sm:grid ${ROW_GRID}`}
              >
                <span>Opportunity</span>
                <span>Type</span>
                <span>Match</span>
                <span>Status</span>
                <span>Deadline</span>
              </div>

              {visible.map((a) => {
                const status = statusMeta(a.status);
                const deadline = deadlineInfo(a.deadline);
                const tone = matchTone(a.match);
                const width = Math.max(0, Math.min(100, a.match));

                return (
                  <Link
                    key={a.id}
                    href={`/analyses/${a.id}`}
                    className={`grid gap-3 border-b border-slate-100 px-5 py-4 transition last:border-0 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 sm:items-center sm:gap-4 ${ROW_GRID}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{a.title}</p>
                        {a.organization && (
                          <p className="mt-0.5 truncate text-xs text-slate-400">{a.organization}</p>
                        )}
                      </div>
                    </div>

                    {/* On phones these sit in one wrapped row under the title; on wider screens they become grid columns. */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-12 sm:contents sm:pl-0">
                      <span className="truncate text-xs text-slate-500">{formatType(a.type)}</span>

                      <div className="flex items-center gap-2">
                        <span className={`w-10 text-sm font-bold tabular-nums ${tone.text}`}>{a.match}%</span>
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${width}%` }} />
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}
                      >
                        {status.label}
                      </span>

                      <div className="text-sm">
                        <p className="text-slate-600">{deadline.date}</p>
                        {deadline.label && (
                          <p className={`text-xs font-medium ${deadlineToneClass[deadline.tone]}`}>
                            {deadline.label}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"
      }`}
    >
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</dd>
    </div>
  );
}