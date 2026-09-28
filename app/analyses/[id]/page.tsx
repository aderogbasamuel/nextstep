import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
  Building2,
  Calendar,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyses, eligibility, actionItems } from "@/lib/db/schema";
import ActionPlan from "@/components/ActionPlan";
import DeadlineCard from "@/components/DeadlineCard";
import ShareChecklistButton from "@/components/ShareCheckListButton";
import { statusMeta } from "@/lib/analysis-ui";

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
      and(eq(analyses.id, analysisId), eq(analyses.userId, session.user.id))
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

  const missingItems = eligibilityItems.filter(
    (item) => item.status === "missing"
  );
  const unclearItems = eligibilityItems.filter(
    (item) => item.status === "unclear"
  );
  const attentionCount = missingItems.length + unclearItems.length;

  // Deadline as a plain string so it can cross into client components.
  const rawDeadline = analysis.deadline as string | Date | null;
  const deadlineValue = rawDeadline
    ? typeof rawDeadline === "string"
      ? rawDeadline
      : rawDeadline.toISOString()
    : null;

  // Labels follow the actual data instead of being hard-coded.
  const matchLabel =
    analysis.match >= 75
      ? { text: "Strong match", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" }
      : analysis.match >= 50
        ? { text: "Partial match", cls: "bg-amber-50 text-amber-700 ring-amber-600/20" }
        : { text: "Weak match", cls: "bg-red-50 text-red-700 ring-red-600/20" };

  // Same source as the analyses list, so both pages always show the same status.
  const meta = statusMeta(analysis.status);
  const verdict = { text: meta.label, cls: meta.badge };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link
            href="/analyses"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to analyses
          </Link>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${verdict.cls}`}
            >
              {verdict.text}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-10">
        {/* Document Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-8 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <FileText className="size-3.5" />
              {analysis.type}
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              {analysis.title}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-slate-400" />
                {analysis.organization ?? "Organization"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-slate-400" />
                Analyzed {new Date(analysis.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Match Overview & Eligibility Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Match Score Card */}
          <section className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Match score</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    How your profile compares
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${matchLabel.cls}`}
                >
                  {matchLabel.text}
                </span>
              </div>

              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <div
                  className="relative grid size-32 shrink-0 place-items-center rounded-full shadow-inner"
                  style={{
                    background: `conic-gradient(
                      #2563eb 0 ${analysis.match}%,
                      #e2e8f0 ${analysis.match}% 100%
                    )`,
                  }}
                >
                  <div className="grid size-[104px] place-items-center rounded-full bg-white shadow-xs">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {analysis.match}%
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  {analysis.summary ??
                    "Review the requirements on the right to see where you stand."}
                </p>
              </div>
            </div>

            {attentionCount > 0 && (
              <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="size-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">
                      {attentionCount}{" "}
                      {attentionCount === 1 ? "area needs" : "areas need"} your
                      attention
                    </p>
                    <p className="mt-0.5 text-xs text-amber-800/90 leading-relaxed">
                      {missingItems.length > 0
                        ? "Review the missing requirements before submitting."
                        : "Review the requirements marked as unclear before submitting."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Eligibility Requirements List */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Eligibility Breakdown</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Detailed requirement check against your profile
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {eligibilityItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-3.5 transition hover:bg-slate-50"
                >
                  <div className="mt-0.5 shrink-0">
                    {item.status === "met" ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : item.status === "missing" ? (
                      <XCircle className="size-4 text-red-500" />
                    ) : (
                      <Clock3 className="size-4 text-amber-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.requirement}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.explanation}
                    </p>
                    <SourceQuote
                      quote={
                        "sourceQuote" in item &&
                        typeof item.sourceQuote === "string"
                          ? item.sourceQuote
                          : null
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Action Plan & Sidebar */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Action Plan</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Complete these steps to move your application forward.
                </p>
              </div>
              <ShareChecklistButton
                title={analysis.title}
                organization={analysis.organization}
                match={analysis.match}
                deadline={deadlineValue}
                missing={missingItems.map((item) => item.requirement)}
                items={actionItemsData.map((task) => ({
                  title: task.title,
                  completed: task.completed,
                }))}
              />
            </div>

            <div className="mt-6">
              <ActionPlan analysisId={analysis.id} items={actionItemsData} />
            </div>
          </section>

          <div className="space-y-6">
            <DeadlineCard
              analysisId={analysis.id}
              title={analysis.title}
              organization={analysis.organization}
              deadline={deadlineValue}
            />

            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Missing Requirements</h2>

              <div className="mt-4 space-y-3">
                {missingItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-red-100 bg-red-50/30 p-3.5"
                  >
                    <p className="text-xs font-semibold text-slate-900">
                      {item.requirement}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {item.explanation}
                    </p>
                    <SourceQuote
                      quote={
                        "sourceQuote" in item &&
                        typeof item.sourceQuote === "string"
                          ? item.sourceQuote
                          : null
                      }
                    />
                  </div>
                ))}

                {missingItems.length === 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-xs font-medium text-slate-500">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    Nothing missing based on your profile.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
          <AlertCircle className="size-3.5 shrink-0" />
          AI-generated analysis may contain errors. Always verify important requirements against the original source document.
        </p>
      </div>
    </main>
  );
}

function SourceQuote({ quote }: { quote: string | null }) {
  if (!quote) return null;
  return (
    <blockquote className="mt-2.5 rounded-md border-l-2 border-blue-500 bg-slate-100/70 p-2 text-[11px] leading-normal text-slate-600">
      <span className="font-semibold text-slate-500">Source: </span>
      <span className="italic">&ldquo;{quote}&rdquo;</span>
    </blockquote>
  );
}