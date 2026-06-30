"use client";

import {MessageCircle} from "lucide-react";
import {cn} from "@/lib/utils";

export function OpenChatButton({
  children = "Chat Now",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("radiance:open-chat"))}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/18 bg-white/10 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-current shadow-[0_18px_55px_rgba(15,16,22,0.14)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/16",
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {children}
    </button>
  );
}
