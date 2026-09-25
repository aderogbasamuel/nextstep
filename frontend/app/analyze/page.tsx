"use client";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Upload,
  ClipboardCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function AnalyzePage() {
  const [drag, setDrag] = useState(false);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-white">
              <ArrowRight className="size-4" />
            </span>
            NextStep
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Back to dashboard
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-5 py-16">
        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <Sparkles className="size-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Analyze an opportunity
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            Upload a document and we&apos;ll turn its requirements into a
            personalized action plan.
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div
            onDragEnter={() => setDrag(true)}
            onDragLeave={() => setDrag(false)}
            onDrop={() => setDrag(false)}
            className={`flex min-h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition ${drag ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50/70"}`}
          >
            <div className="grid size-12 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Upload className="size-5" />
            </div>
            <h2 className="mt-4 font-semibold">Drop your PDF here</h2>
            <p className="mt-1 text-sm text-slate-500">
              or{" "}
              <button className="font-semibold text-blue-600 hover:underline">
                browse files
              </button>
            </p>
            <p className="mt-4 text-xs text-slate-400">
              PDF, DOCX, or TXT · Maximum 10MB
            </p>
          </div>
          <div className="flex items-center gap-4 px-3 py-6 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <textarea
            className="min-h-32 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            placeholder="Paste the job description, scholarship requirements, application guide, or process instructions..."
            aria-label="Opportunity description"
          />
          <div className="mt-4 flex justify-end">
            <Link
              href="/analyses/1"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Analyze with NextStep{" "}
              <ArrowRight className="ml-1 inline size-4" />
            </Link>
          </div>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[
            [FileText, "Extract requirements"],
            [ClipboardCheck, "Match your profile"],
            [ShieldCheck, "Keep data private"],
          ].map(([Icon, label]) => (
            <div
              key={label as string}
              className="flex items-center gap-2.5 text-xs text-slate-500"
            >
              <Icon className="size-4 text-slate-400" />
              {label as string}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
