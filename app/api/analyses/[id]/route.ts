import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  analyses,
  eligibility,
  actionItems,
} from "@/lib/db/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const analysisId = Number(id);

    if (Number.isNaN(analysisId)) {
      return NextResponse.json(
        { error: "Invalid analysis ID" },
        { status: 400 }
      );
    }

    const analysis = await db
      .select()
      .from(analyses)
      .where(
        and(
          eq(analyses.id, analysisId),
          eq(analyses.userId, session.user.id)
        )
      )
      .limit(1);

    if (!analysis.length) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    const eligibilityItems = await db
      .select()
      .from(eligibility)
      .where(eq(eligibility.analysisId, analysisId));

    const actions = await db
      .select()
      .from(actionItems)
      .where(eq(actionItems.analysisId, analysisId));

    return NextResponse.json({
      ...analysis[0],
      eligibility: eligibilityItems,
      actionItems: actions,
    });
  } catch (error) {
    console.error("Failed to fetch analysis:", error);

    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}