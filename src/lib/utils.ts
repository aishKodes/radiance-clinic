import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { canonicalOrigin } from "@/lib/seo-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteUrl = canonicalOrigin;
