import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { SettingsContent } from "@/components/settings-content";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const [row] = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, session.user.id))
    .limit(1);

  const has = (value: string | number | null | undefined) =>
    typeof value === "number" || (typeof value === "string" && value.trim() !== "");

  const profileFields = [
    { label: "University", filled: has(row?.university) },
    { label: "Degree", filled: has(row?.degree) },
    { label: "Field of study", filled: has(row?.fieldOfStudy) },
    { label: "Study level", filled: has(row?.studyLevel) },
    { label: "Graduation year", filled: has(row?.graduationYear) },
    { label: "Location", filled: has(row?.location) },
    { label: "Skills", filled: has(row?.skills) },
    { label: "Experience", filled: has(row?.experience) },
  ];

  // Optional: set DEMO_USER_EMAIL in your env to protect a shared demo account from deletion.
  const demoEmail = process.env.DEMO_USER_EMAIL?.toLowerCase();
  const isDemoAccount =
    !!demoEmail && session.user.email.toLowerCase() === demoEmail;

  return (
    <SettingsContent
      name={session.user.name}
      email={session.user.email}
      profileFields={profileFields}
      isDemoAccount={isDemoAccount}
    />
  );
}