import { formatDeadline, parseDeadline, remainingLabel } from "@/lib/deadline";

type ChecklistItem = { title: string; completed: boolean };

type ShareInput = {
  title: string;
  organization?: string | null;
  match: number;
  deadline?: string | Date | null;
  missing: string[];
  items: ChecklistItem[];
  appUrl: string;
};

export function buildChecklistMessage({
  title,
  organization,
  match,
  deadline,
  missing,
  items,
  appUrl,
}: ShareInput): string {
  const lines: string[] = [];

  lines.push(`*${title}*${organization ? ` (${organization})` : ""}`);
  lines.push(`Match: ${match}%`);

  if (deadline) {
    const d = parseDeadline(deadline);
    lines.push(`Deadline: ${formatDeadline(d)} (${remainingLabel(d)})`);
  }

  if (missing.length > 0) {
    lines.push("", "*Still missing*");
    missing.forEach((m) => lines.push(`- ${m}`));
  }

  if (items.length > 0) {
    lines.push("", "*Checklist*");
    items.forEach((i) => lines.push(`${i.completed ? "✅" : "⬜"} ${i.title}`));
  }

  lines.push("", `Made with NextStep: ${appUrl}`);
  return lines.join("\n");
}

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}