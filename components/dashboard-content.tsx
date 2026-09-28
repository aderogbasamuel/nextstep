"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppShell, PageHeader } from "@/components/app-shell";
import {
  deadlineInfo,
  deadlineToneClass,
  formatType,
  statusBucket,
  statusMeta,
} from "@/lib/analysis-ui";

type Analysis = {
  id: number;
  title: string;
  type: string;
  organization: string | null;
  match: number;
  status: string;
  deadline: string | null;
  createdAt: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(date: string) {
  const created = new Date(date);
  const diff = Date.now() - created.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / DAY_MS);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return created.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardContent({ name }: { name: string }) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Rendered on the client only, so the greeting follows the viewer's local time.
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

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
      console.error("Failed to fetch dashboard analyses:", err);
      setError("We couldn't load your analyses.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  // Upcoming deadlines within 30 days, skipping opportunities the user isn't eligible for.
  const upcoming = useMemo(() => {
    const now = Date.now();
    return analyses
      .filter((a) => statusBucket(a.status) !== "not_eligible")
      .map((a) => ({ analysis: a, info: deadlineInfo(a.deadline, now) }))
      .filter(
        (x) =>
          x.info.time !== null &&
          x.info.tone !== "none" &&
          x.info.tone !== "passed" &&
          x.info.time - now <= 30 * DAY_MS,
      )
      .sort((a, b) => (a.info.time ?? 0) - (b.info.time ?? 0));
  }, [analyses]);

  const stats = useMemo(() => {
    let eligible = 0;
    let needsReview = 0;
    for (const a of analyses) {
      const bucket = statusBucket(a.status);
      if (bucket === "eligible") eligible += 1;
      else if (bucket === "needs_review") needsReview += 1;
    }
    return { total: analyses.length, eligible, needsReview };
  }, [analyses]);

  const closingThisWeek = upcoming.filter(
    (x) => x.info.tone === "urgent" || x.info.tone === "soon",
  ).length;

  const recent = useMemo(
    () =>
      [...analyses]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [analyses],
  );

  const firstName = name.trim().split(" ")[0] || "there";
  const showValues = !loading && !error;

  const statCards: {
    label: string;
    value: number;
    Icon: LucideIcon;
    detail: string;
  }[] = [
    { label: "Analyses", value: stats.total, Icon: FileText, detail: "All opportunities" },
    {
      label: "Eligible",
      value: stats.eligible,
      Icon: CheckCircle2,
      detail:
        stats.total > 0
          ? `${Math.round((stats.eligible / stats.total) * 100)}% of analyses`
          : "No analyses yet",
    },
    { label: "Needs review", value: stats.needsReview, Icon: Clock3, detail: "Worth a closer look" },
    { label: "Deadlines", value: upcoming.length, Icon: CalendarDays, detail: "Next 30 days" },
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 py-9 lg:px-10 lg:py-11">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <PageHeader
            eyebrow="Your workspace"
            title={`${greeting}, ${firstName}`}
            description={
              showValues && closingThisWeek > 0
                ? `${closingThisWeek} ${closingThisWeek === 1 ? "deadline is" : "deadlines are"} coming up in the next 7 days.`
                : "Here's where your applications stand."
            }
          />

          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="size-4" />
            Analyze document
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ label, value, Icon, detail }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className="grid size-8 place-items-center rounded-lg bg-slate-50 text-slate-500">
                  <Icon className="size-4" />
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight tabular-nums">
                {showValues ? value : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-400">{detail}</p>
            </div>
          ))}
        </div>

        {/* Coming up */}
        {showValues && upcoming.length > 0 && (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5">
              <h2 className="font-semibold">Coming up</h2>
              <p className="mt-1 text-xs text-slate-400">
                Deadlines in the next 30 days, soonest first.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {upcoming.slice(0, 3).map(({ analysis, info }) => (
                <Link
                  key={analysis.id}
                  href={`/analyses/${analysis.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {analysis.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {analysis.organization ? `${analysis.organization} · ` : ""}
                      {info.date}
                    </p>
                  </div>

                  <span className={`shrink-0 text-sm font-semibold ${deadlineToneClass[info.tone]}`}>
                    {info.label}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent analyses */}
        <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <h2 className="font-semibold">Recent analyses</h2>
              <p className="mt-1 text-xs text-slate-400">
                Your latest opportunity reviews.
              </p>
            </div>

            <Link
              href="/analyses"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div aria-busy="true" aria-label="Loading your analyses" className="divide-y divide-slate-100">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="size-10 rounded-lg bg-slate-100 motion-safe:animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-slate-100 motion-safe:animate-pulse" />
                    <div className="h-3 w-1/5 rounded bg-slate-100 motion-safe:animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="px-5 py-10 text-center">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => load()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw className="size-4" />
                Try again
              </button>
            </div>
          ) : recent.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <FileText className="size-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-900">
                No analyses yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Analyze a job, scholarship or grant to see it here.
              </p>

              <Link
                href="/analyze"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="size-4" />
                Analyze opportunity
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((item) => {
                const status = statusMeta(item.status);
                return (
                  <Link
                    href={`/analyses/${item.id}`}
                    key={item.id}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <FileText className="size-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatType(item.type)} · {timeAgo(item.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}
                    >
                      {status.label}
                    </span>

                    <span className="hidden w-10 text-right text-sm font-bold tabular-nums sm:block">
                      {item.match}%
                    </span>

                    <ArrowUpRight className="size-4 shrink-0 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}