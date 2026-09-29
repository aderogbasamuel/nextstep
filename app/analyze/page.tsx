"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Upload,
  ClipboardCheck,
  Sparkles,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";
import { DragEvent, useEffect, useRef, useState } from "react";
import NextStepLogo from "@/components/ui/NextStepLogo";
import { SAMPLE_DOCUMENTS } from "@/lib/sample-documents";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];

const LOADING_STEPS = [
  "Reading your document...",
  "Extracting requirements...",
  "Comparing with your profile...",
  "Building your action plan...",
];

export default function AnalyzePage() {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate the progress message while the analysis runs.
  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }
    const id = setInterval(
      () => setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)),
      2500,
    );
    return () => clearInterval(id);
  }, [loading]);

  function handleFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    setError("");

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10MB.");
      return;
    }

    const name = selectedFile.name.toLowerCase();
    const okType =
      ALLOWED_TYPES.includes(selectedFile.type) ||
      ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));

    if (!okType) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setFile(selectedFile);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDrag(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDrag(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDrag(false);
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleAnalyze(sampleText?: string) {
    setError("");

    const bodyText = (sampleText ?? text).trim();
    const bodyFile = sampleText ? null : file;

    if (!bodyFile && !bodyText) {
      setError("Upload a document or paste the opportunity details.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (bodyFile) {
        formData.append("file", bodyFile);
      }

      if (bodyText) {
        formData.append("text", bodyText);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      window.location.href = `/analyses/${data.analysisId}`;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  }

  function runSample(id: string) {
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === id);
    if (!sample || loading) return;

    const sampleText = sample.build();
    removeFile();
    setText(sampleText);
    handleAnalyze(sampleText);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
            <NextStepLogo tagline className="h-12 w-auto" />
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-600/10">
            <Sparkles className="size-6" />
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Analyze an opportunity
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Upload a document and we&apos;ll turn its requirements into a
            personalized action plan.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400">
              No document handy? Try a fictional sample:
            </span>
            {SAMPLE_DOCUMENTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => runSample(sample.id)}
                disabled={loading}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex min-h-60 flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-6 text-center transition ${
              drag
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
            }`}
          >
            {!file ? (
              <>
                <div className="grid size-11 place-items-center rounded-xl bg-white text-blue-600 shadow-xs ring-1 ring-slate-900/5">
                  <Upload className="size-5" />
                </div>

                <h2 className="mt-3 text-sm font-semibold text-slate-900">
                  Drop your document here
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    browse files
                  </button>
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />

                <p className="mt-3 text-[11px] text-slate-400">
                  PDF, DOCX, or TXT · Maximum 10MB
                </p>
              </>
            ) : (
              <div className="w-full max-w-md">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-xs">
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Remove file"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Choose a different file
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 px-2 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
            <span className="h-px flex-1 bg-slate-200/80" />
            or
            <span className="h-px flex-1 bg-slate-200/80" />
          </div>

          {/* Text Input */}
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setError("");
            }}
            className="min-h-32 w-full resize-none rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
            placeholder="Paste the job description, scholarship requirements, application guide, or process instructions..."
          />

          {/* Error display */}
          {error && (
            <div
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-red-50/80 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {/* Action button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {LOADING_STEPS[loadingStep]}
                </>
              ) : (
                <>
                  Analyze with NextStep
                  <ArrowRight className="ml-1.5 size-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature List Footer */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3 px-1">
          {[
            [FileText, "Extract requirements"],
            [ClipboardCheck, "Match your profile"],
            [ShieldCheck, "Keep data private"],
          ].map(([Icon, label]) => (
            <div
              key={label as string}
              className="flex items-center gap-2 text-xs font-medium text-slate-500"
            >
              <Icon className="size-4 text-slate-400 shrink-0" />
              {label as string}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}