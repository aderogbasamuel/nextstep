import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { extractTextFromFile } from "@/lib/parser/extract-text";
import { extractResumeProfile } from "@/lib/ai/resume";

export async function POST(request: Request) {
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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a resume." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Resume must be smaller than 10MB." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    const resumeText = await extractTextFromFile(file);

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { error: "We couldn't extract enough information from this resume." },
        { status: 400 }
      );
    }

    const profile = await extractResumeProfile(resumeText);

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Resume processing failed:", error);

    return NextResponse.json(
      { error: "Failed to process resume." },
      { status: 500 }
    );
  }
}