type IcsInput = {
  analysisId: number;
  title: string;
  organization?: string | null;
  deadline: Date;
  url?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

const icsDate = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

const icsUtcStamp = (d: Date) =>
  d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escapeText = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

// RFC 5545: lines should be folded at 75 octets.
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = " " + rest.slice(74);
  }
  out.push(rest);
  return out.join("\r\n");
}

export function buildDeadlineIcs({
  analysisId,
  title,
  organization,
  deadline,
  url,
}: IcsInput): string {
  const start = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const description = [
    organization ? `Organization: ${organization}` : null,
    "Tracked in NextStep.",
    url ?? null,
  ]
    .filter(Boolean)
    .join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NextStep//Deadline//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    // Stable UID: adding the same analysis twice updates the event instead of duplicating it.
    `UID:nextstep-analysis-${analysisId}@nextstepapp.vercel.app`,
    `DTSTAMP:${icsUtcStamp(new Date())}`,
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(end)}`,
    `SUMMARY:${escapeText(`Deadline: ${title}`)}`,
    `DESCRIPTION:${escapeText(description)}`,
    // All-day events start at 00:00, so -PT15H = 9:00 AM the day before,
    // and -P2DT15H = 9:00 AM three days before.
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Application due tomorrow",
    "TRIGGER:-PT15H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Application due in 3 days",
    "TRIGGER:-P2DT15H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadDeadlineIcs(input: IcsInput) {
  const ics = buildDeadlineIcs(input);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = "nextstep-deadline.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}