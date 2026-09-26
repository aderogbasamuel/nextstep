import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Download,
  FileText,
  Share2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyses, eligibility, actionItems } from "@/lib/db/schema";
import ActionPlan from "@/components/ActionPlan";
type EligibilityItem = {
  id: number;
  requirement: string;
  explanation: string;
  status: "good" | "warn" | "bad";
};

type ActionItem = {
  id: number;
  title: string;
  completed: boolean;
  position: number;
};

type Analysis = {
  id: number;
  title: string;
  type: string;
  organization: string | null;
  match: number;
  status: string;
  deadline: string | null;
  summary: string | null;
  createdAt: string;
  eligibility: EligibilityItem[];
  actionItems: ActionItem[];
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const analysisId = Number(id);

  if (Number.isNaN(analysisId)) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    notFound();
  }

  const analysisResult = await db
    .select()
    .from(analyses)
    .where(
      and(eq(analyses.id, analysisId), eq(analyses.userId, session.user.id)),
    )
    .limit(1);

  if (!analysisResult.length) {
    notFound();
  }

  const analysis = analysisResult[0];

  const eligibilityItems = await db
    .select()
    .from(eligibility)
    .where(eq(eligibility.analysisId, analysisId));

  const actionItemsData = await db
    .select()
    .from(actionItems)
    .where(eq(actionItems.analysisId, analysisId))
    .orderBy(asc(actionItems.position));

  const completedTasks = actionItemsData.filter(
    (task) => task.completed,
  ).length;

  const totalTasks = actionItemsData.length;

  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link
            href="/analyses"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="size-4" />
            Back to analyses
          </Link>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-slate-200 p-2.5 text-slate-500"
              aria-label="Share"
            >
              <Share2 className="size-4" />
            </button>
            <button
              className="rounded-lg border border-slate-200 p-2.5 text-slate-500"
              aria-label="Download"
            >
              <Download className="size-4" />
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
              <FileText className="size-4" />
              {analysis.type}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              {analysis.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {analysis.organization ?? "Organization"} · Analyzed{" "}
              {new Date(analysis.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            Eligible
          </span>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">Match score</p>
                <p className="mt-1 text-xs text-slate-400">
                  How your profile compares
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                Strong match
              </span>
            </div>
            <div className="mt-8 flex items-center gap-5">
              <div
                className="relative grid size-32 shrink-0 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(
  #2563eb 0 ${analysis.match}%,
  #e2e8f0 ${analysis.match}% 100%
)`,
                }}
              >
                <div className="grid size-[104px] place-items-center rounded-full bg-white">
                  <span className="text-4xl font-bold tracking-tight">
                    {analysis.match}%
                  </span>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-500">
                You meet most of the core requirements, but there are a few gaps
                worth reviewing.
              </p>
            </div>
            <div className="mt-8 rounded-lg bg-amber-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="size-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    2 areas need your attention
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    Review the missing skill and recommendation letter before
                    applying.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Eligibility</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Based on your current profile
                </p>
              </div>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <div className="mt-5 grid gap-3">
              {eligibilityItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-slate-100 p-3"
                >
                  <div className="mt-0.5">
                    {item.status === "met" ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : item.status === "warn" ? (
                      <Clock3 className="size-4 text-amber-500" />
                    ) : (
                      <XCircle className="size-4 text-red-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{item.requirement}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.22fr_0.78fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Your action plan</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complete these steps to move your application forward.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <ActionPlan analysisId={analysis.id} items={actionItemsData} />
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Deadline */}
            <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-center gap-2 text-amber-800">
                <CalendarDays className="size-5" />
                <p className="text-sm font-semibold">Application deadline</p>
              </div>

              <p className="mt-4 text-2xl font-bold text-amber-950">
                {analysis.deadline
                  ? new Date(analysis.deadline).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No deadline"}
              </p>

              {analysis.deadline && (
                <p className="mt-1 text-sm font-medium text-amber-700">
                  {(() => {
                    const deadline = new Date(analysis.deadline);
                    const now = new Date();

                    const diff = deadline.getTime() - now.getTime();
                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

                    if (days < 0) return "Deadline passed";
                    if (days === 0) return "Due today";
                    if (days === 1) return "1 day remaining";

                    return `${days} days remaining`;
                  })()}
                </p>
              )}
            </section>

            {/* What you're missing */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold">What you&apos;re missing</h2>

              <div className="mt-4 grid gap-3">
                {eligibilityItems
                  .filter((item) => item.status === "missing")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-100 p-3"
                    >
                      <p className="text-sm font-medium">{item.requirement}</p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.explanation}
                      </p>
                    </div>
                  ))}

                {eligibilityItems.filter((item) => item.status === "missing")
                  .length === 0 && (
                  <p className="text-sm text-slate-500">
                    Nothing missing based on your profile.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
        <p className="mt-8 flex items-center gap-2 text-xs text-slate-400">
          <AlertCircle className="size-3.5" />
          AI-generated analysis may contain errors. Always verify important
          requirements against the original source.
        </p>
      </div>
    </main>
  );
}
