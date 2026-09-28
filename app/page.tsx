"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  BriefcaseBusiness,
  Award,
  ClipboardCheck,
  Sparkles,
  Upload,
  Menu,
  X,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle,
  FileSearch,
  Target,
  ListTodo,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import NextStepLogo from "@/components/ui/NextStepLogo";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Document",
    body: "Drop in any opportunity PDF, job description, grant guideline, or scholarship form.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Analysis",
    body: "Our engine instantly parses core eligibility, deadlines, required documents, and fine print.",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Profile Match",
    body: "Compare requirement criteria directly against your experience and qualifications.",
  },
  {
    number: "04",
    icon: ArrowRight,
    title: "Execute Checklist",
    body: "Follow a step-by-step interactive roadmap engineered to get your application submitted.",
  },
];

const features = [
  {
    icon: FileSearch,
    title: "Requirement Extraction",
    body: "Find hidden eligibility criteria, required documents, mandatory skills, and strict deadlines in seconds.",
  },
  {
    icon: Target,
    title: "Personalized Matching",
    body: "Compare every opportunity against your personal background and automatically calculate match probability.",
  },
  {
    icon: ShieldCheck,
    title: "Gap Analysis",
    body: "Clearly pinpoint what qualifications you satisfy, what is missing, and what requires secondary review.",
  },
  {
    icon: ListTodo,
    title: "Automated Action Plans",
    body: "Transform dense, confusing legal and institutional guidelines into a straightforward, prioritized checklist.",
  },
  {
    icon: Clock,
    title: "Deadline Tracking",
    body: "Keep urgent cutoff dates and key milestones front-and-center so you never miss an application window.",
  },
  {
    icon: CheckCircle,
    title: "Centralized Workspace",
    body: "Store all your parsed documents, match analyses, and application progress inside one unified dashboard.",
  },
];

const useCases = [
  {
    icon: GraduationCap,
    title: "Scholarships",
    body: "Know whether you qualify and exactly what documents you need before starting.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Internships & Jobs",
    body: "Compare your skills against job specifications to tailor your application strategy.",
  },
  {
    icon: Award,
    title: "Grants & Competitions",
    body: "Unpack complex eligibility guidelines and track mandatory submission steps.",
  },
  {
    icon: FileText,
    title: "University Processes",
    body: "Turn institutional guidelines and transfer policies into manageable tasks.",
  },
];

function Logo() {
  return (
    <Link href="/" className="">
      <NextStepLogo tagline className="h-12 w-auto" />
    </Link>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-24 pb-20 lg:pt-32 lg:pb-32">
      {/* Background Gradients & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl lg:top-[-10rem]">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-8">
        {/* Left Column: Hero Copy */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
            <Sparkles className="size-3.5 animate-pulse text-blue-400" />
            <span>AI-Powered Requirement Intelligence</span>
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Know what you qualify for.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Own what comes next.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg sm:leading-8">
            Stop guessing your eligibility. Upload complex opportunity documents
            and get instant match analysis, verified requirements, and a
            step-by-step roadmap to victory.
          </p>

          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Link
              href="/analyze"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Analyze a Document
              <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              See How It Works
            </a>
          </div>

          {/* Proof points */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-800/80 pt-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Instant Eligibility Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-amber-400" />
              <span>Automated Checklist</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Mockup Card */}
        <ProductPreview />
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:mr-0">
      {/* Background Glow */}
      <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-blue-600 to-cyan-500 opacity-30 blur-2xl transition duration-1000 group-hover:opacity-100" />

      {/* Main Glass Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl backdrop-blur-xl">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
              <FileText className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Document Analyzed
              </p>
              <p className="text-sm font-semibold text-white">
                Senior Systems Engineer
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Eligible
          </span>
        </div>

        {/* Score & Requirements Section */}
        <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr]">
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-center">
            <div
              className="relative grid size-24 place-items-center rounded-full"
              style={{
                background: "conic-gradient(#3b82f6 0 88%, #1e293b 88% 100%)",
              }}
            >
              <div className="grid size-[78px] place-items-center rounded-full bg-slate-900">
                <span className="text-2xl font-extrabold text-white">88%</span>
              </div>
            </div>
            <p className="mt-3 text-xs font-bold text-slate-200">Match Score</p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              High Probability
            </p>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Key Requirements
            </p>
            <div className="space-y-2">
              {[
                "Distributed Systems Architecture",
                "TypeScript & Node.js",
                "Kubernetes & Docker",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-medium text-slate-300"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                <Clock className="size-4 shrink-0" />
                <span>5+ Years Experience (Needs Review)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Plan Progress */}
        <div className="border-t border-slate-800/80 bg-slate-950/30 px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-200">
              Action Plan Progress
            </p>
            <span className="text-[11px] font-medium text-blue-400">
              4 of 5 Complete
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-500 to-sky-400" />
          </div>
          <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-400" /> Resume Tailored
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-400" /> Cover Letter Ready
            </span>
          </div>
        </div>

        {/* Deadline Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 bg-amber-500/10 px-5 py-3">
          <span className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <Clock className="size-3.5" />
            Closing Window
          </span>
          <span className="text-xs font-bold text-amber-200">
            4 Days Remaining
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Light Glass Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#how-it-works" className="transition hover:text-slate-900">
              How it works
            </a>
            <a href="#features" className="transition hover:text-slate-900">
              Features
            </a>
            <a href="#use-cases" className="transition hover:text-slate-900">
              Use cases
            </a>
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow"
            >
              Get started <ArrowRight className="size-4" />
            </Link>
          </div>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-6 shadow-xl md:hidden">
            <div className="flex flex-col gap-4 font-medium text-slate-700">
              <a
                href="#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="py-1 hover:text-slate-900"
              >
                How it works
              </a>
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="py-1 hover:text-slate-900"
              >
                Features
              </a>
              <a
                href="#use-cases"
                onClick={() => setMobileOpen(false)}
                className="py-1 hover:text-slate-900"
              >
                Use cases
              </a>
              <hr className="my-1 border-slate-100" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="py-1 hover:text-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/analyze"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-xl bg-slate-900 px-4 py-3 text-center font-semibold text-white shadow-sm"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Social Proof / Capability Ribbon */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-6 lg:px-8">
          <p className="mr-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Supports documents for:
          </p>
          {[
            "Scholarships",
            "Internships",
            "Job Postings",
            "Grants & Funding",
            "University Applications",
          ].map((x) => (
            <span
              key={x}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs"
            >
              {x}
            </span>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Clarity in four simple steps.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            No more manually reading 30-page documents or wondering if you missed critical eligibility criteria.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, body }) => (
            <div
              key={number}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-600">
                    {number}
                  </span>
                  <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                    <Icon className="size-5" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="border-y border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                The NextStep difference
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                From static information to active execution.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Everything you need to analyze, qualify, and execute on high-impact opportunities with absolute confidence.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-8 transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Built for your next opportunity
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            One engine, every target application.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
            >
              <div>
                <div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
              <a
                href="/analyze"
                className="mt-6 inline-flex items-center text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
              >
                Explore use case <ChevronRight className="ml-1 size-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-5 mb-24 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl lg:mx-auto lg:max-w-7xl">
        <div className="relative flex flex-col items-start justify-between gap-8 px-8 py-16 sm:px-14 sm:py-20 md:flex-row md:items-center">
          <div className="absolute -right-10 -top-10 -z-0 size-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Stop reading requirements.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                Start taking action.
              </span>
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Upload your document now and get an instant eligibility breakdown in under 30 seconds.
            </p>
          </div>
          <Link
            href="/analyze"
            className="relative z-10 inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-4 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100 hover:shadow-lg"
          >
            Get Started Now <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Logo />
          <div className="flex flex-wrap gap-6 font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900">
              How it works
            </a>
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
            <a href="#use-cases" className="hover:text-slate-900">
              Use cases
            </a>
            <a href="#" className="hover:text-slate-900">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-900">
              Terms of Service
            </a>
          </div>
          <p className="text-xs text-slate-400">© 2026 NextStep. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}