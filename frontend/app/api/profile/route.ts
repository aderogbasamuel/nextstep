import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, session.user.id))
      .limit(1);

    return NextResponse.json({
      ...(result[0] ?? {}),
      user: {
        name: session.user.name,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("Failed to fetch profile:", error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const existing = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, session.user.id))
      .limit(1);

    const profileData = {
      university: body.university || null,
      degree: body.degree || null,
      fieldOfStudy: body.fieldOfStudy || null,
      studyLevel: body.studyLevel || null,
      graduationYear: body.graduationYear
        ? Number(body.graduationYear)
        : null,
      location: body.location || null,
      skills: body.skills || null,
      experience: body.experience || null,
      updatedAt: new Date(),
    };

    let saved;

    if (existing.length) {
      saved = await db
        .update(profile)
        .set(profileData)
        .where(eq(profile.userId, session.user.id))
        .returning();
    } else {
      saved = await db
        .insert(profile)
        .values({
          userId: session.user.id,
          ...profileData,
        })
        .returning();
    }

    return NextResponse.json(saved[0]);
  } catch (error) {
    console.error("Failed to save profile:", error);

    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}