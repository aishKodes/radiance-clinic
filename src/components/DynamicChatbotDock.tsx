"use client";

import { ChatbotDock } from "@/components/ChatbotDock";
import type { AssistantSettings } from "@/types/cms";

export function DynamicChatbotDock({
  settings,
}: {
  settings: AssistantSettings;
}) {
  return <ChatbotDock settings={settings} />;
}
