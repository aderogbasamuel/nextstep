import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

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

    const userAnalyses = await db
      .select()
      .from(analyses)
      .where(eq(analyses.userId, session.user.id))
      .orderBy(desc(analyses.createdAt));

    return NextResponse.json(userAnalyses);
  } catch (error) {
    console.error("Failed to fetch analyses:", error);

    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}