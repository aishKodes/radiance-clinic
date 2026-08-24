"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function DeferredGoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const activate = () => setReady(true);
    const eventOptions: AddEventListenerOptions = { once: true, passive: true };
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((event) => window.addEventListener(event, activate, eventOptions));
    const timer = window.setTimeout(activate, 12_000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, activate));
      window.clearTimeout(timer);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <Script id="radiance-google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
