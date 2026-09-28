"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarPlus,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { authClient } from "@/lib/auth-client";

// Change this if your profile editor lives at a different route.
const PROFILE_HREF = "/profile";

type Props = {
  name: string;
  email: string;
  profileFields: { label: string; filled: boolean }[];
  isDemoAccount: boolean;
};

const card = "rounded-xl border border-slate-200 bg-white shadow-sm";
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function SettingsContent({
  name,
  email,
  profileFields,
  isDemoAccount,
}: Props) {
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-5 py-9 lg:py-11">
        <PageHeader
          eyebrow="Your workspace"
          title="Settings"
          description="Manage your account and check that your profile is ready for matching."
        />

        <div className="mt-8 grid gap-6">
          <AccountSection initialName={name} email={email} />
          <ProfileSection fields={profileFields} />
          <RemindersSection />
          <DataSection />
          <DangerSection isDemoAccount={isDemoAccount} />
        </div>
      </main>
    </AppShell>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-slate-100 px-5 py-4">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

/* ---------------- Account ---------------- */

function AccountSection({ initialName, email }: { initialName: string; email: string }) {
  const router = useRouter();
  const [savedName, setSavedName] = useState(initialName);
  const [value, setValue] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const trimmed = value.trim();
  const dirty = trimmed !== savedName && trimmed.length > 0;

  async function handleSave() {
    if (!dirty) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await authClient.updateUser({ name: trimmed });
      if (error) throw new Error(error.message || "Couldn't save your name.");

      setSavedName(trimmed);
      setMessage({ kind: "ok", text: "Name updated." });
      router.refresh();
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Couldn't save your name.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={card} aria-labelledby="account-heading">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 id="account-heading" className="font-semibold">Account</h2>
        <p className="mt-1 text-sm text-slate-500">Your basic account information.</p>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="settings-name" className="text-sm font-medium">Full name</label>
          <input
            id="settings-name"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setMessage(null);
            }}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="settings-email" className="text-sm font-medium">Email</label>
          <input
            id="settings-email"
            value={email}
            readOnly
            className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
          />
          <p className="text-xs text-slate-400">Email can&apos;t be changed here yet.</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-slate-100 px-5 py-4">
        {message && (
          <p
            role={message.kind === "error" ? "alert" : "status"}
            className={`mr-auto text-sm ${message.kind === "error" ? "text-red-600" : "text-emerald-600"}`}
          >
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </button>
      </div>
    </section>
  );
}

/* ---------------- Profile completeness ---------------- */

function ProfileSection({ fields }: { fields: { label: string; filled: boolean }[] }) {
  const filled = fields.filter((f) => f.filled).length;
  const missing = fields.filter((f) => !f.filled).map((f) => f.label);
  const percent = Math.round((filled / fields.length) * 100);

  return (
    <section className={card} aria-labelledby="profile-heading">
      <div className="flex items-start gap-3 p-5">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
          <UserRound className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 id="profile-heading" className="font-semibold">Your profile</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Every match is calculated from your profile. Blank fields show up as
            &ldquo;unclear&rdquo; requirements.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Profile completeness"
            >
              <div
                className={`h-full rounded-full ${percent === 100 ? "bg-emerald-500" : "bg-blue-600"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-sm font-semibold tabular-nums">
              {filled}/{fields.length}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {missing.length === 0
              ? "Your profile is complete."
              : `Still empty: ${missing.join(", ")}.`}
          </p>

          <Link
            href={PROFILE_HREF}
            className="mt-4 inline-flex rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {missing.length === 0 ? "Edit profile" : "Complete your profile"}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Reminders ---------------- */

function RemindersSection() {
  return (
    <section className={card} aria-labelledby="reminders-heading">
      <SectionHeader
        title="Deadline reminders"
        description="How to stay on top of deadlines today."
      />
      <div className="grid gap-4 p-5 text-sm">
        <div className="flex items-start gap-3">
          <CalendarPlus className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <p className="leading-6 text-slate-600">
            Open any analysis and choose <span className="font-medium">Add to calendar</span>. Your
            calendar app will remind you 3 days and 1 day before the deadline.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <MessageCircle className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <p className="leading-6 text-slate-600">
            Use <span className="font-medium">Share on WhatsApp</span> to send yourself or a friend
            the checklist.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Automatic email and WhatsApp reminders are not available yet.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Data & privacy ---------------- */

function DataSection() {
  return (
    <section className={card} aria-labelledby="data-heading">
      <div className="flex items-start gap-3 p-5">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h2 id="data-heading" className="font-semibold">Data and privacy</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Your profile is used to personalize comparisons. To analyze a document, NextStep sends
            its text and your profile details to Google&apos;s Gemini API. Your analyses are saved to
            your account so you can come back to them.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            AI analysis can make mistakes. Always verify important requirements against the
            original document.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Danger zone ---------------- */

function DangerSection({ isDemoAccount }: { isDemoAccount: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const { error: deleteError } = await authClient.deleteUser();
      if (deleteError) {
        const status = (deleteError as { status?: number }).status;
        throw new Error(
          status === 404
            ? "Account deletion isn't enabled on this server yet."
            : deleteError.message || "Couldn't delete your account.",
        );
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete your account.");
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-xl border border-red-200 bg-red-50/40" aria-labelledby="danger-heading">
      <div className="flex items-center justify-between gap-4 p-5">
        <div>
          <h2 id="danger-heading" className="font-semibold text-red-900">Delete account</h2>
          <p className="mt-1 text-sm text-red-700/80">
            {isDemoAccount
              ? "This is the shared demo account, so deleting it is turned off."
              : "Permanently delete your account, profile and all saved analyses. This can't be undone."}
          </p>
        </div>

        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={isDemoAccount}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        )}
      </div>

      {open && !isDemoAccount && (
        <div className="border-t border-red-200 p-5">
          <label htmlFor="confirm-delete" className="text-sm font-medium text-red-900">
            Type DELETE to confirm
          </label>
          <input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
            className="mt-2 w-full max-w-xs rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
          />

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Delete my account
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirmText("");
                setError("");
              }}
              disabled={deleting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}