import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const parser = new PDFParse({ data: buffer });

    const result = await parser.getText();

    await parser.destroy();

    return result.text.trim();
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });

    return result.value.trim();
  }

  if (file.type === "text/plain") {
    return buffer.toString("utf-8").trim();
  }

  throw new Error("Unsupported file type");
}