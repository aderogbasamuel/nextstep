"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPending(true);
    setError("");

    try {
      if (isSignup) {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
        });

        if (result.error) {
          setError(
            "We could not create your account. Check your details and try again."
          );
          return;
        }

        router.push("/profile");
        router.refresh();
        return;
      }

      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(
          "We could not sign you in. Check your email and password and try again."
        );
        return;
      }

      const pendingAnalysis = sessionStorage.getItem("pendingAnalysis");

      if (pendingAnalysis) {
        router.push("/analyze?continue=true");
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-12 font-sans antialiased text-slate-900">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-2 font-bold tracking-tight text-slate-900"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-white">
            <ArrowRight className="size-4" />
          </span>
          NextStep
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            {isSignup
              ? "Start finding opportunities that fit your next step."
              : "Sign in to continue your next step."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {isSignup && (
              <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                Full name
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jane Doe"
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                />
              </label>
            )}

            <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
              Password
              <input
                required
                minLength={8}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
              />
            </label>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50/80 px-3.5 py-2.5 text-xs font-medium text-red-700"
              >
                {error}
              </div>
            )}

            <button
              disabled={pending}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            {isSignup
              ? "Already have an account?"
              : "Don&apos;t have an account?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-semibold text-blue-600 hover:underline"
            >
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
          <ShieldCheck className="size-4 shrink-0" />
          Your information is kept private.
        </p>
      </div>
    </main>
  );
}