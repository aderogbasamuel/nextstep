import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  analyses,
  actionItems,
  eligibility,
  profile,
} from "@/lib/db/schema";

import { analyzeOpportunity } from "@/lib/ai/gemini";
import { extractTextFromFile } from "@/lib/parser/extract-text";

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Read multipart form data
    const formData = await request.formData();

    const file = formData.get("file");
    const text = formData.get("text");

    let opportunityText = "";

    // 3. Extract text from uploaded file
    if (file instanceof File) {
      opportunityText = await extractTextFromFile(file);
    }

    // 4. Use pasted text if provided
    if (typeof text === "string" && text.trim()) {
      opportunityText = text.trim();
    }

    // 5. Validate extracted/pasted content
    if (!opportunityText) {
      return NextResponse.json(
        {
          error:
            "Please upload a document or provide opportunity details.",
        },
        { status: 400 }
      );
    }

    if (opportunityText.length < 30) {
      return NextResponse.json(
        {
          error:
            "Please provide more information about the opportunity.",
        },
        { status: 400 }
      );
    }

    // 6. Load user's profile
    const profileResult = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, session.user.id))
      .limit(1);

    const userProfile = profileResult[0];

    if (!userProfile) {
      return NextResponse.json(
        {
          error:
            "Please complete your profile before analyzing an opportunity.",
        },
        { status: 400 }
      );
    }

    // 7. Send opportunity + profile to Gemini
    const result = await analyzeOpportunity(
      opportunityText,
      userProfile
    );

    // 8. Save analysis
    const [savedAnalysis] = await db
      .insert(analyses)
      .values({
        userId: session.user.id,
        title: result.title,
        type: result.type,
        organization: result.organization,
        match: result.match,
        status: result.status,
        deadline: result.deadline
          ? new Date(result.deadline)
          : null,
        summary: result.summary,
      })
      .returning();

    // 9. Save eligibility requirements
    if (result.eligibility?.length) {
      await db.insert(eligibility).values(
        result.eligibility.map((item: any) => ({
          analysisId: savedAnalysis.id,
          requirement: item.requirement,
          explanation: item.explanation,
          status: item.status,
        }))
      );
    }

    // 10. Save action items
    if (result.actionItems?.length) {
      await db.insert(actionItems).values(
        result.actionItems.map((item: any, index: number) => ({
          analysisId: savedAnalysis.id,
          title: item.title,
          completed: false,
          position: item.position ?? index + 1,
        }))
      );
    }

    // 11. Return the new analysis
    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis.id,
    });
  } catch (error) {
    console.error("Analysis failed:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze opportunity",
      },
      { status: 500 }
    );
  }
}