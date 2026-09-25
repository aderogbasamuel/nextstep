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
    const result = isSignup
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });
    setPending(false);
    if (result.error) {
      setError(
        "We could not complete that request. Check your details and try again.",
      );
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-2 font-semibold"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-white">
            <ArrowRight className="size-4" />
          </span>
          NextStep
        </Link>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm text-black">
          <h1 className="text-2xl font-bold">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isSignup
              ? "Start finding opportunities that fit your next step."
              : "Sign in to continue your next step."}
          </p>
          <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
            {isSignup && (
              <label className="grid gap-2 text-sm font-medium">
                Full name
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
                />
              </label>
            )}
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                required
                minLength={8}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-rose-600">
                {error}
              </p>
            )}
            <button
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {isSignup
              ? "Already have an account?"
              : "Don&apos;t have an account?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-semibold text-blue-600"
            >
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
        <p className="mt-5 flex justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="size-4" />
          Your information is kept private.
        </p>
      </div>
    </main>
  );
}
