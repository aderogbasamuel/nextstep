import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { actionItems, analyses } from "@/lib/db/schema";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      actionId: string;
    }>;
  }
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

    const { id, actionId } = await params;

    const analysisId = Number(id);
    const actionItemId = Number(actionId);

    if (
      Number.isNaN(analysisId) ||
      Number.isNaN(actionItemId)
    ) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (typeof body.completed !== "boolean") {
      return NextResponse.json(
        { error: "completed must be a boolean" },
        { status: 400 }
      );
    }

    // Make sure the analysis belongs to the logged-in user
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

    // Update the action
    const updatedAction = await db
      .update(actionItems)
      .set({
        completed: body.completed,
      })
      .where(
        and(
          eq(actionItems.id, actionItemId),
          eq(actionItems.analysisId, analysisId)
        )
      )
      .returning();

    if (!updatedAction.length) {
      return NextResponse.json(
        { error: "Action item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAction[0]);
  } catch (error) {
    console.error("Failed to update action item:", error);

    return NextResponse.json(
      { error: "Failed to update action item" },
      { status: 500 }
    );
  }
}