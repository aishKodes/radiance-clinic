"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent, type RadianceAnalyticsEvent } from "@/lib/analytics";

export function TrackedLink({
  eventName,
  eventParameters,
  onClick,
  ...props
}: ComponentProps<typeof Link> & {
  eventName: RadianceAnalyticsEvent;
  eventParameters?: Record<string, string | number | boolean | undefined>;
}) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParameters);
        onClick?.(event);
      }}
    />
  );
}
