"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell, PageHeader, StatusBadge } from "@/components/app-shell";

type Analysis = {
  id: number;
  userId: string;
  title: string;
  type: string;
  organization: string | null;
  match: number;
  status: string;
  deadline: string | null;
  createdAt: string;
};

export function DashboardContent({ name }: { name: string }) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const response = await fetch("/api/analyses");

        if (!response.ok) {
          throw new Error("Failed to fetch analyses");
        }

        const data = await response.json();
        setAnalyses(data);
      } catch (error) {
        console.error("Failed to fetch dashboard analyses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();

    const next30Days = new Date();
    next30Days.setDate(now.getDate() + 30);

    const eligible = analyses.filter(
      (analysis) => analysis.status === "eligible",
    ).length;

    const needsReview = analyses.filter(
      (analysis) => analysis.status === "needs_review",
    ).length;

    const upcomingDeadlines = analyses.filter((analysis) => {
      if (!analysis.deadline) return false;

      const deadline = new Date(analysis.deadline);

      return deadline >= now && deadline <= next30Days;
    }).length;

    return {
      total: analyses.length,
      eligible,
      needsReview,
      upcomingDeadlines,
    };
  }, [analyses]);

  const recent = useMemo(() => {
    return [...analyses]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [analyses]);

  function getStatusTone(status: string): "green" | "amber" | "blue" {
    switch (status) {
      case "eligible":
        return "green";

      case "not_eligible":
        return "amber";

      case "needs_review":
      default:
        return "blue";
    }
  }

  function formatStatus(status: string) {
    switch (status) {
      case "eligible":
        return "Eligible";

      case "not_eligible":
        return "Not eligible";

      case "needs_review":
        return "Needs review";

      default:
        return status;
    }
  }

  function formatType(type: string) {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function formatDate(date: string) {
    const created = new Date(date);
    const now = new Date();

    const diff = now.getTime() - created.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

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

  const statCards: [string, number, LucideIcon, string][] = [
    ["Analyses", stats.total, FileText, "All opportunities"],
    [
      "Eligible",
      stats.eligible,
      CheckCircle2,
      stats.total > 0
        ? `${Math.round((stats.eligible / stats.total) * 100)}% of analyses`
        : "No analyses yet",
    ],
    ["Needs review", stats.needsReview, Clock3, "Worth a closer look"],
    ["Deadlines", stats.upcomingDeadlines, CalendarDays, "Next 30 days"],
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 py-9 lg:px-10 lg:py-11">
        <PageHeader
          eyebrow="Your workspace"
          title={`Good morning, ${name.split(" ")[0]}`}
          description="Here's what needs your attention today."
        />

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(([label, value, Icon, detail]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {label}
                </p>

                <span className="grid size-8 place-items-center rounded-lg bg-slate-50 text-slate-500">
                  <Icon className="size-4" />
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight">
                {loading ? "—" : value}
              </p>

              <p className="mt-1 text-xs text-slate-400">{detail}</p>
            </div>
          ))}
        </div>

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
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-500">Loading your analyses...</p>
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
                Analyze an opportunity to see it here.
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
              {recent.map((item) => (
                <Link
                  href={`/analyses/${item.id}`}
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="size-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatType(item.type)} · {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <StatusBadge tone={getStatusTone(item.status)}>
                    {formatStatus(item.status)}
                  </StatusBadge>

                  <span className="hidden text-sm font-bold sm:block">
                    {item.match}%
                  </span>

                  <ArrowUpRight className="size-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}
