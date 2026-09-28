"use client";

import { MessageCircle } from "lucide-react";

import { buildChecklistMessage, whatsappShareUrl } from "@/lib/share";

type Props = {
  title: string;
  organization: string | null;
  match: number;
  deadline: string | null;
  missing: string[];
  items: { title: string; completed: boolean }[];
};

export default function ShareChecklistButton(props: Props) {
  function handleShare() {
    const text = buildChecklistMessage({
      ...props,
      // The analysis page is private, so share the app link instead.
      appUrl: window.location.origin,
    });
    window.open(whatsappShareUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <MessageCircle className="size-4" />
      Share on WhatsApp
    </button>
  );
}