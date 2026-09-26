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
import { DragEvent, useRef, useState } from "react";

export default function AnalyzePage() {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    setError("");

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10MB.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setFile(selectedFile);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDrag(false);

    const droppedFile = event.dataTransfer.files?.[0];

    handleFile(droppedFile);
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

  async function handleAnalyze() {
    setError("");

    if (!file && !text.trim()) {
      setError("Upload a document or paste the opportunity details.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      }

      if (text.trim()) {
        formData.append("text", text.trim());
      }

      const response = await fetch("/api/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: text.trim(),
  }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "Analysis failed");
}

window.location.href = `/analyses/${data.analysisId}`;

    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
          {/* Upload */}
          <div
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex min-h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition ${
              drag
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-slate-50/70"
            }`}
          >
            {!file ? (
              <>
                <div className="grid size-12 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Upload className="size-5" />
                </div>

                <h2 className="mt-4 font-semibold">Drop your document here</h2>

                <p className="mt-1 text-sm text-slate-500">
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

                <p className="mt-4 text-xs text-slate-400">
                  PDF, DOCX, or TXT · Maximum 10MB
                </p>
              </>
            ) : (
              <div className="w-full max-w-md">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>

                    <p className="mt-1 text-xs text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Remove file"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-xs font-medium text-blue-600 hover:underline"
                >
                  Choose a different file
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 px-3 py-6 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
            <span className="h-px flex-1 bg-slate-200" />
            or
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Text input */}
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setError("");
            }}
            className="min-h-32 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            placeholder="Paste the job description, scholarship requirements, application guide, or process instructions..."
          />

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Analyze */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  Analyze with NextStep
                  <ArrowRight className="ml-1 size-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features */}
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
