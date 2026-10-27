"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { initializeAnalyticsQueue, rememberLeadAttribution } from "@/lib/analytics";

export function DeferredGoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    rememberLeadAttribution();
    initializeAnalyticsQueue(measurementId);
    const activate = () => setReady(true);
    const eventOptions: AddEventListenerOptions = { once: true, passive: true };
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((event) => window.addEventListener(event, activate, eventOptions));
    const timer = window.setTimeout(activate, 12_000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, activate));
      window.clearTimeout(timer);
    };
  }, [measurementId]);

  if (!ready) return null;

  return (
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
  );
}
