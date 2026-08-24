import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal(props: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { children, className } = props;

  return <div className={cn(className)}>{children}</div>;
}
