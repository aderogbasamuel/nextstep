"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Loader2,
  MapPin,
  Save,
  UserRound,
  Wrench,
} from "lucide-react";

type Profile = {
  university: string;
  degree: string;
  fieldOfStudy: string;
  studyLevel: string;
  graduationYear: string;
  location: string;
  skills: string;
  experience: string;
};

const emptyProfile: Profile = {
  university: "",
  degree: "",
  fieldOfStudy: "",
  studyLevel: "",
  graduationYear: "",
  location: "",
  skills: "",
  experience: "",
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);

  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        /*
         * Our profile API currently returns the profile itself.
         *
         * If the API later includes user information, this will
         * automatically pick it up.
         */
        if (data?.user) {
          setUser({
            name: data.user.name ?? "",
            email: data.user.email ?? "",
          });
        }

        if (data) {
          setProfile({
            university: data.university ?? "",
            degree: data.degree ?? "",
            fieldOfStudy: data.fieldOfStudy ?? "",
            studyLevel: data.studyLevel ?? "",
            graduationYear: data.graduationYear
              ? String(data.graduationYear)
              : "",
            location: data.location ?? "",
            skills: data.skills ?? "",
            experience: data.experience ?? "",
          });
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(
    field: keyof Profile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          graduationYear: profile.graduationYear
            ? Number(profile.graduationYear)
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();

      setProfile({
        university: data.university ?? "",
        degree: data.degree ?? "",
        fieldOfStudy: data.fieldOfStudy ?? "",
        studyLevel: data.studyLevel ?? "",
        graduationYear: data.graduationYear
          ? String(data.graduationYear)
          : "",
        location: data.location ?? "",
        skills: data.skills ?? "",
        experience: data.experience ?? "",
      });

      setSaved(true);
    } catch (error) {
      console.error(error);
      setError("Failed to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const completeness = useMemo(() => {
    const fields = [
      profile.university,
      profile.degree,
      profile.fieldOfStudy,
      profile.studyLevel,
      profile.graduationYear,
      profile.location,
      profile.skills,
      profile.experience,
    ];

    const completed = fields.filter(
      (field) => field.trim().length > 0
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 h-10 w-48 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 space-y-6">
            <div className="h-40 animate-pulse rounded-xl bg-white" />
            <div className="h-72 animate-pulse rounded-xl bg-white" />
            <div className="h-64 animate-pulse rounded-xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 lg:px-12">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        {/* Header */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-blue-50">
              <UserRound className="size-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Your profile
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Keep your profile current to improve every match.
              </p>
            </div>
          </div>
        </div>

        {/* Completeness */}
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">
                Profile completeness
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Complete your profile so NextStep can make better
                eligibility and requirement matches.
              </p>
            </div>

            <span className="text-2xl font-bold text-blue-600">
              {completeness}%
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${completeness}%`,
              }}
            />
          </div>

          {completeness < 100 && (
            <p className="mt-3 text-xs text-slate-400">
              Add the missing information below to reach 100%.
            </p>
          )}
        </section>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">

          {/* Personal information */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={<UserRound className="size-5" />}
              title="Personal information"
              description="Your account information."
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full name
                </label>

                <input
                  value={user?.name ?? "Your name"}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  value={user?.email ?? "Your email"}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none"
                />
              </div>

              <Field
                label="Location"
                value={profile.location}
                placeholder="Lagos, Nigeria"
                onChange={(value) =>
                  updateField("location", value)
                }
              />
            </div>
          </section>

          {/* Education */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={<GraduationCap className="size-5" />}
              title="Education"
              description="This information is especially important for eligibility matching."
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field
                label="University"
                value={profile.university}
                placeholder="University of Lagos"
                onChange={(value) =>
                  updateField("university", value)
                }
              />

              <Field
                label="Degree"
                value={profile.degree}
                placeholder="B.Eng"
                onChange={(value) =>
                  updateField("degree", value)
                }
              />

              <Field
                label="Field of study"
                value={profile.fieldOfStudy}
                placeholder="Computer Engineering"
                onChange={(value) =>
                  updateField("fieldOfStudy", value)
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Study level
                </label>

                <select
                  value={profile.studyLevel}
                  onChange={(event) =>
                    updateField(
                      "studyLevel",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select level</option>
                  <option value="Undergraduate">
                    Undergraduate
                  </option>
                  <option value="Graduate">
                    Graduate
                  </option>
                  <option value="Postgraduate">
                    Postgraduate
                  </option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <Field
                label="Expected graduation year"
                type="number"
                value={profile.graduationYear}
                placeholder="2029"
                onChange={(value) =>
                  updateField(
                    "graduationYear",
                    value
                  )
                }
              />
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={<Wrench className="size-5" />}
              title="Skills"
              description="Technologies, tools, languages, and other skills you can use."
            />

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">
                Your skills
              </label>

              <textarea
                value={profile.skills}
                onChange={(event) =>
                  updateField(
                    "skills",
                    event.target.value
                  )
                }
                placeholder="JavaScript, React, Node.js, Git, MongoDB, Python..."
                rows={5}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Separate skills with commas.
              </p>
            </div>
          </section>

          {/* Experience */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <SectionHeader
              icon={<BriefcaseBusiness className="size-5" />}
              title="Experience"
              description="Tell NextStep about your projects, internships, work, and other relevant experience."
            />

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">
                Experience
              </label>

              <textarea
                value={profile.experience}
                onChange={(event) =>
                  updateField(
                    "experience",
                    event.target.value
                  )
                }
                placeholder={`Example:

Frontend Developer Intern — ABC Technologies
June 2025 – August 2025
Built React interfaces and integrated REST APIs.

Personal project — Student Marketplace
Built a full-stack marketplace using React, Firebase and Paystack.`}
                rows={10}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Include projects, internships, jobs, leadership,
                volunteering, or other relevant experience.
              </p>
            </div>
          </section>

          {/* What NextStep uses */}
          <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-white">
                <Check className="size-4 text-blue-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-950">
                  What NextStep uses this for
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-800">
                  Your profile helps NextStep compare your
                  education, location, skills, and experience
                  against opportunity requirements and identify
                  what you qualify for and what you still need.
                </p>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Save */}
          <div className="flex items-center justify-end gap-4 pb-6">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Check className="size-4" />
                Profile saved
              </span>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}

              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ----------------------------- */
/* Reusable components            */
/* ----------------------------- */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div>
        <h2 className="font-semibold">{title}</h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}