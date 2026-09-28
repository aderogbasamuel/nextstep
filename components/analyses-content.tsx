"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Clock, FileText, RefreshCw, Search } from "lucide-react";

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
  "sm:grid-cols-[minmax(0,1.8fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]";

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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-11">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <PageHeader
            eyebrow="Your workspace"
            title="My analyses"
            description="Every opportunity you've reviewed, with what's left to do."
          />

          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            + Analyze document
          </Link>
        </div>

        {/* --- STAT CARDS SECTION --- */}
        {!loading && !error && analyses.length > 0 && (
          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Analyzed" value={counts.all} icon={<FileText className="size-4 text-slate-500" />} />
            <Stat label="Eligible" value={counts.eligible} icon={<span className="size-2 rounded-full bg-emerald-500" />} />
            <Stat
              label="Closing within 7 days"
              value={closingSoon}
              highlight={closingSoon > 0}
              icon={<Clock className={`size-4 ${closingSoon > 0 ? "text-amber-600" : "text-slate-400"}`} />}
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

            {/* --- RESPONSIVE CARDS / ROW LIST --- */}
            <div className="mt-2 space-y-3 sm:space-y-0 sm:overflow-hidden sm:rounded-xl sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm">
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
                    className={`group block rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 sm:grid sm:items-center sm:gap-4 sm:rounded-none sm:border-x-0 sm:border-t-0 sm:border-b sm:border-slate-100 sm:p-5 sm:shadow-none sm:last:border-b-0 sm:hover:bg-slate-50/80 ${ROW_GRID}`}
                  >
                    {/* Header/Title block */}
                    <div className="flex items-start gap-3.5 sm:min-w-0 sm:items-center">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 sm:size-9">
                        <FileText className="size-5 sm:size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                          {a.title}
                        </p>
                        {a.organization && (
                          <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-slate-400">
                            {a.organization}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta info layout (mobile stacks nicely, desktop uses grid) */}
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-3 sm:mt-0 sm:border-0 sm:pt-0 sm:contents">
                      {/* Type */}
                      <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:bg-transparent sm:p-0 sm:font-normal sm:text-slate-500 truncate">
                        {formatType(a.type)}
                      </span>

                      {/* Match bar */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold tabular-nums sm:w-10 sm:text-sm ${tone.text}`}>
                          {a.match}%
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100 sm:w-14" aria-hidden="true">
                          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${width}%` }} />
                        </div>
                      </div>

                      {/* Status badge */}
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* Deadline */}
                      <div className="w-full text-xs sm:w-auto sm:text-sm">
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
  icon,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all ${
        highlight
          ? "border-amber-200 bg-amber-50/50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
        {icon && <div>{icon}</div>}
      </div>
      <dd className="mt-2 text-2xl font-extrabold tabular-nums text-slate-900 sm:text-3xl">
        {value}
      </dd>
    </div>
  );
}