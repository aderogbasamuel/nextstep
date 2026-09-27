import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function extractResumeProfile(resumeText: string) {
  const prompt = `
You are a resume parsing assistant for NextStep.

Extract structured information from the resume below.

Only use information explicitly supported by the resume.
Do not invent missing information.
If a field cannot be determined, return null or an empty array.

Return ONLY valid JSON in this exact structure:

{
  "university": "string or null",
  "degree": "string or null",
  "fieldOfStudy": "string or null",
  "studyLevel": "string or null",
  "graduationYear": "number or null",
  "location": "string or null",
  "skills": ["string"],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "description": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ]
}

Resume:

${resumeText}
`;

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
      const message = String(error?.message ?? error);

      const retryable =
        message.includes("503") ||
        message.includes("UNAVAILABLE") ||
        message.includes("429") ||
        message.includes("RESOURCE_EXHAUSTED");

      if (!retryable || attempt === 2) {
        throw error;
      }

      await sleep(1000 * 2 ** attempt);
    }
  }

  throw new Error("Resume processing failed");
}