"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

import {
  AppShell,
  PageHeader,
  StatusBadge,
} from "@/components/app-shell";

type Analysis = {
  id: number;
  userId: string;
  title: string;
  type: string;
  organization: string | null;
  match: number;
  status: "eligible" | "not_eligible" | "needs_review" | string;
  deadline: string | null;
  createdAt: string;
};

type StatusFilter = "all" | "eligible" | "not_eligible" | "needs_review";

export function AnalysesContent() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/analyses");

        if (!response.ok) {
          throw new Error("Failed to fetch analyses");
        }

        const data = await response.json();
        setAnalyses(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load your analyses.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyses();
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return analyses.filter((analysis) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          analysis.title,
          analysis.organization ?? "",
          analysis.type,
          analysis.status,
          analysis.match.toString(),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" ||
        analysis.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [analyses, query, statusFilter]);

  function formatDeadline(deadline: string | null) {
    if (!deadline) return "No deadline";

    return new Date(deadline).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatType(type: string) {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function getStatusTone(
    status: string
  ): "green" | "blue" | "amber" {
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

  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 py-9 lg:px-10 lg:py-11">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <PageHeader
            eyebrow="Your workspace"
            title="My analyses"
            description="All the opportunities you've reviewed in one place."
          />

          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Analyze document
          </Link>
        </div>

        {/* Search + filter */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-slate-400" />

            <input
              aria-label="Search opportunities"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search opportunities..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter
                )
              }
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All statuses</option>
              <option value="eligible">Eligible</option>
              <option value="needs_review">
                Needs review
              </option>
              <option value="not_eligible">
                Not eligible
              </option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-slate-400" />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              Loading your analyses...
            </p>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-500">
              <FileText className="size-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">
              No analyses found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {query || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Analyze your first opportunity to get started."}
            </p>

            {!query && statusFilter === "all" && (
              <Link
                href="/analyze"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Analyze an opportunity
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Table header */}
            <div className="hidden grid-cols-[1.5fr_0.7fr_0.5fr_0.8fr_0.7fr] gap-4 border-b border-slate-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:grid">
              <span>Opportunity</span>
              <span>Type</span>
              <span>Match</span>
              <span>Status</span>
              <span>Deadline</span>
            </div>

            {/* Rows */}
            {filtered.map((analysis) => (
              <Link
                href={`/analyses/${analysis.id}`}
                key={analysis.id}
                className="grid gap-3 border-b border-slate-100 px-5 py-4 transition last:border-0 hover:bg-slate-50 sm:grid-cols-[1.5fr_0.7fr_0.5fr_0.8fr_0.7fr] sm:items-center sm:gap-4"
              >
                {/* Opportunity */}
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="size-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {analysis.title}
                    </p>

                    {analysis.organization && (
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {analysis.organization}
                      </p>
                    )}
                  </div>
                </div>

                {/* Type */}
                <span className="text-xs text-slate-500">
                  {formatType(analysis.type)}
                </span>

                {/* Match */}
                <span className="text-sm font-bold text-slate-900">
                  {analysis.match}%
                </span>

                {/* Status */}
                <StatusBadge
                  tone={getStatusTone(analysis.status)}
                >
                  {formatStatus(analysis.status)}
                </StatusBadge>

                {/* Deadline */}
                <span className="text-sm text-slate-500">
                  {formatDeadline(analysis.deadline)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}