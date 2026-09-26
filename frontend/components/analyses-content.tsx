"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { FileText, Search, SlidersHorizontal } from "lucide-react";
import { AppShell, PageHeader, StatusBadge } from "@/components/app-shell";
type Analysis = {
  id: number;
  userId: string;
  title: string;
  type: string;
  match: string;
  status: string;
  deadline: string;
  createdAt: string;
};
const rows = [
  [
    "Software Engineering Internship",
    "Internship",
    "78%",
    "Eligible",
    "Sep 30",
    "green",
  ],
  [
    "African Technology Scholarship",
    "Scholarship",
    "92%",
    "Eligible",
    "Oct 04",
    "green",
  ],
  [
    "Student Innovation Grant",
    "Grant",
    "54%",
    "Needs review",
    "Oct 18",
    "amber",
  ],
  [
    "Engineering Leadership Fellowship",
    "Fellowship",
    "61%",
    "Needs review",
    "Nov 02",
    "amber",
  ],
] as const;

export function AnalysesContent() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchAnalyses() {
      try {
        setLoading(true);

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
    return analyses.filter((analysis) =>
      [
        analysis.title,
        analysis.type,
        analysis.match,
        analysis.status,
        analysis.deadline,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [analyses, query]);
  return (
    <AppShell>
      <main className="mx-auto max-w-7xl px-5 py-9 lg:px-10 lg:py-11">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <PageHeader
            eyebrow="Your workspace"
            title="My analyses"
            description="All the opportunities you've reviewed in one place."
          />
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            + Analyze document
          </Link>
        </div>
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
          <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600">
            <SlidersHorizontal className="size-4" />
            All statuses
          </button>
        </div>

        {loading ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">Loading your analyses...</p>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.5fr_0.7fr_0.5fr_0.8fr_0.6fr] gap-4 border-b border-slate-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:grid">
              <span>Opportunity</span>
              <span>Type</span>
              <span>Match</span>
              <span>Status</span>
              <span>Deadline</span>
            </div>
            {filtered.map((analysis) => {
              const tone = analysis.status === "Eligible" ? "green" : "amber";

              return (
                <Link
                  href={`/analyses/${analysis.id}`}
                  key={analysis.id}
                  className="grid gap-2 border-b border-slate-100 px-5 py-4 transition last:border-0 hover:bg-slate-50 sm:grid-cols-[1.5fr_0.7fr_0.5fr_0.8fr_0.6fr] sm:items-center sm:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <FileText className="size-4" />
                    </span>

                    <span className="text-sm font-semibold">
                      {analysis.title}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500">
                    {analysis.type}
                  </span>

                  <span className="text-sm font-bold">
                    {analysis.match}%
                    
                  </span>

                  <StatusBadge tone={tone}>{analysis.status}</StatusBadge>

                  <span className="text-sm text-slate-500">
                    {analysis.deadline}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            No analyses match your search.
          </p>
        )}
      </main>
    </AppShell>
  );
}
