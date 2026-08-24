"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { pageTypeFromPath, topicFromPath } from "@/lib/contact-links";
import {
  trackConversionEvent,
  type RadianceConversionEvent,
} from "@/lib/analytics";

export function ConversionLink({
  eventName,
  topic,
  onClick,
  ...props
}: ComponentProps<typeof Link> & {
  eventName: RadianceConversionEvent;
  topic?: string;
}) {
  const pathname = usePathname() || "/";

  return (
    <Link
      {...props}
      onClick={(event) => {
        trackConversionEvent(eventName, {
          path: pathname,
          page_type: pageTypeFromPath(pathname),
          topic: topic || topicFromPath(pathname),
        });
        onClick?.(event);
      }}
    />
  );
}
