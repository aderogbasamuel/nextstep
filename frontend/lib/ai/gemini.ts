import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeOpportunity(
  opportunityText: string,
  profile: {
    university?: string | null;
    degree?: string | null;
    fieldOfStudy?: string | null;
    studyLevel?: string | null;
    graduationYear?: number | null;
    location?: string | null;
    skills?: string | null;
    experience?: string | null;
  }
) {
  const prompt = `
You are the analysis engine for NextStep.

Analyze this opportunity against the student's profile.

STUDENT PROFILE:
${JSON.stringify(profile, null, 2)}

OPPORTUNITY:
${opportunityText}

Return ONLY valid JSON:

{
  "title": "string",
  "organization": "string or null",
  "type": "scholarship | internship | job | grant | competition | program | other",
  "deadline": "ISO date string or null",
  "summary": "short summary",
  "match": 0,
  "status": "eligible | not_eligible | needs_review",
  "eligibility": [
    {
      "requirement": "string",
      "explanation": "string",
      "status": "met | missing | unclear"
    }
  ],
  "actionItems": [
    {
      "title": "string",
      "position": 1
    }
  ]
}

Rules:
- match must be an integer from 0 to 100.
- Do not invent requirements.
- If something cannot be determined, use "unclear".
- Keep explanations concise.
- Generate practical next steps.
- If there is no deadline, return null.
`;

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response");
      }

      return JSON.parse(response.text);
    } catch (error: any) {
      lastError = error;

      const message = String(error?.message ?? error);

      const retryable =
        message.includes("503") ||
        message.includes("UNAVAILABLE") ||
        message.includes("429") ||
        message.includes("RESOURCE_EXHAUSTED");

      if (!retryable || attempt === 2) {
        throw error;
      }

      const delay = 1000 * 2 ** attempt;

      console.log(
        `Gemini temporarily unavailable. Retrying in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}