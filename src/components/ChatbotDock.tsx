"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import type { AssistantSettings, LeadPayload } from "@/types/cms";
import { apiBaseUrl } from "@/lib/api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type LeadFields = {
  name: string;
  phone: string;
  concern: string;
};

const defaultAssistantSettings: AssistantSettings = {
  title: "Radiance AI Assistant",
  intro: "Ask about treatments or request a consultation.",
  disclaimer:
    "I can help with services and appointments. I cannot diagnose or provide medical advice.",
  quickPrompts: ["Hair transplant", "Book consultation"],
};

const medicalRefusal =
  "I can help with general service information and appointment requests, but I cannot diagnose or provide medical advice. A consultation with the clinic team is the right next step.";

const whatsappFallback = "https://wa.me/919937000000";

export function ChatbotDock({
  settings = defaultAssistantSettings,
}: {
  settings?: AssistantSettings;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [leadMessage, setLeadMessage] = useState("");
  const [showCallbackCta, setShowCallbackCta] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [lead, setLead] = useState<LeadFields>({
    name: "",
    phone: "",
    concern: "",
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: settings.intro || defaultAssistantSettings.intro,
    },
  ]);
  const messageListRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestions = useMemo(
    () =>
      (settings.quickPrompts?.length
        ? settings.quickPrompts
        : defaultAssistantSettings.quickPrompts
      ).slice(0, 2),
    [settings.quickPrompts],
  );

  useEffect(() => {
    const openChat = () => {
      setOpen(true);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    };

    window.addEventListener("radiance:open-chat", openChat);
    return () => window.removeEventListener("radiance:open-chat", openChat);
  }, []);

  function scrollToLatest(behavior: ScrollBehavior = "smooth") {
    window.requestAnimationFrame(() => {
      const messageList = messageListRef.current;
      if (messageList) {
        messageList.scrollTo({
          top: messageList.scrollHeight,
          behavior,
        });
      }

      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    });
  }

  useEffect(() => {
    if (!open) return;

    scrollToLatest();
  }, [messages, status, showCallbackCta, showLeadForm, leadMessage, open]);

  useEffect(() => {
    if (!open) return;

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches;

    if (!isMobile) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function sendMessage(content: string) {
    const cleanContent = content.trim();

    if (!cleanContent || status === "sending") return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: cleanContent },
    ];

    setMessages(nextMessages);
    setInput("");
    setShowLeadForm(false);
    setShowCallbackCta(false);

    if (asksForMedicalAdvice(cleanContent)) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: medicalRefusal },
      ]);
      setShowCallbackCta(true);
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-10),
          lead: {
            name: lead.name || undefined,
            phone: lead.phone || undefined,
            concern: lead.concern || undefined,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Assistant request failed.");
      }

      const data = (await response.json()) as { reply?: string };

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply ||
            "I can help with services, appointments and general clinic guidance.",
        },
      ]);
      setShowCallbackCta(true);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I could not connect for a moment. You can still request a callback or use WhatsApp.",
        },
      ]);
      setShowCallbackCta(true);
    } finally {
      setStatus("idle");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  async function requestCallback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lead.name.trim() || !lead.phone.trim() || !lead.concern.trim()) {
      setLeadStatus("error");
      setLeadMessage("Please share your name, phone and concern.");
      return;
    }

    setLeadStatus("sending");
    setLeadMessage("");

    const payload: LeadPayload = {
      name: lead.name.trim(),
      phone: lead.phone.trim(),
      concern: lead.concern.trim(),
      source: "chat_callback",
      page_url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    try {
      if (!apiBaseUrl) {
        throw new Error("Lead API is not configured yet.");
      }

      const response = await fetch(`${apiBaseUrl}/api/public/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Lead request failed.");

      setLeadStatus("success");
      setLeadMessage("Thank you. Radiance Clinics will contact you soon.");
      setLead({ name: "", phone: "", concern: "" });
    } catch {
      setLeadStatus("error");
      setLeadMessage("We could not send this right now. Please use WhatsApp as a fallback.");
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[60] sm:bottom-8 sm:right-6">
      {open ? (
        <section
          aria-label="Radiance AI Assistant chat"
          className="pointer-events-auto fixed bottom-20 right-4 flex max-h-[min(calc(100svh-7rem),38rem)] w-[min(calc(100vw-2rem),24rem)] flex-col overflow-hidden rounded-[1.65rem] border border-white/58 bg-[rgba(255,247,237,0.98)] shadow-[0_28px_90px_rgba(15,16,22,0.24)] backdrop-blur-2xl sm:bottom-24 sm:right-6"
        >
          <header className="relative shrink-0 overflow-hidden bg-[linear-gradient(135deg,rgba(31,127,143,0.16),rgba(217,189,130,0.2))] p-4">
            <div className="pointer-events-none absolute -right-12 -top-16 h-32 w-32 rounded-full bg-[var(--aqua)]/24 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-[1rem] bg-[var(--ink)] text-[var(--ivory)] shadow-lg">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-serif text-2xl leading-none text-[var(--ink)]">
                    Radiance AI Assistant
                  </p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[var(--ink)]/62">
                    Ask about treatments or request a consultation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--ink)]/10 bg-white/70 text-[var(--ink)] transition hover:bg-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div
            ref={messageListRef}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
          >
            <p className="mb-3 rounded-2xl border border-[var(--ink)]/10 bg-white/70 p-3 text-xs leading-5 text-[var(--ink)]/64">
              {settings.disclaimer || defaultAssistantSettings.disclaimer}
            </p>

            <div className="space-y-2 pb-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 16)}`}
                  className={
                    message.role === "assistant"
                      ? "mr-8 rounded-[1rem] bg-white/82 px-3 py-2 text-xs leading-5 text-[var(--ink)]/74 shadow-sm"
                      : "ml-8 rounded-[1rem] bg-[var(--ink)] px-3 py-2 text-xs leading-5 text-[var(--ivory)] shadow-sm"
                  }
                >
                  {message.content}
                </div>
              ))}

              {status === "sending" ? (
                <div className="mr-8 inline-flex items-center gap-2 rounded-full bg-white/78 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[var(--ink)]/52 shadow-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Typing
                </div>
              ) : null}

              {showCallbackCta ? (
                <div className="rounded-[1.1rem] border border-[var(--ink)]/10 bg-white/62 p-3">
                  <p className="text-xs font-bold leading-5 text-[var(--ink)]/68">
                    Want our team to call you?
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowLeadForm(true)}
                    className="mt-2 rounded-full bg-[var(--ink)] px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-white"
                  >
                    Request Callback
                  </button>
                </div>
              ) : null}

              {showLeadForm ? (
                <form
                  onSubmit={requestCallback}
                  className="grid gap-2 rounded-[1.25rem] border border-[var(--ink)]/10 bg-white/54 p-3"
                >
                  {(["name", "phone", "concern"] as const).map((field) => (
                    <input
                      key={field}
                      value={lead[field]}
                      onChange={(event) =>
                        setLead((current) => ({
                          ...current,
                          [field]: event.target.value,
                        }))
                      }
                      placeholder={
                        field === "name" ? "Name" : field === "phone" ? "Phone" : "Concern"
                      }
                      className="rounded-2xl border border-[var(--ink)]/10 bg-white/82 px-4 py-3 text-sm font-semibold text-[var(--ink)] outline-none transition placeholder:text-[var(--ink)]/36 focus:border-[var(--aqua)]/70"
                    />
                  ))}
                  {leadMessage ? (
                    <p className="text-xs font-bold leading-5 text-[var(--ink)]/62">
                      {leadMessage}{" "}
                      {leadStatus === "error" ? (
                        <a
                          href={whatsappFallback}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-[var(--bronze)] underline-offset-4"
                        >
                          WhatsApp clinic
                        </a>
                      ) : null}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={leadStatus === "sending"}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_18px_55px_rgba(15,16,22,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {leadStatus === "sending" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Request Callback
                  </button>
                </form>
              ) : null}

              <div ref={bottomRef} />
            </div>
          </div>

          <footer className="shrink-0 border-t border-[var(--ink)]/10 bg-[rgba(255,247,237,0.98)] p-3">
            {messages.length === 1 && suggestions.length ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className="rounded-full border border-[var(--ink)]/10 bg-white/72 px-3 py-1.5 text-[0.68rem] font-bold text-[var(--ink)]/64 transition hover:bg-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question"
                className="min-w-0 flex-1 rounded-full border border-[var(--ink)]/10 bg-white/84 px-4 py-3 text-sm font-semibold text-[var(--ink)] outline-none transition placeholder:text-[var(--ink)]/36 focus:border-[var(--bronze)]/60"
              />
              <button
                type="submit"
                disabled={status === "sending" || !input.trim()}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[var(--ivory)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Send message"
              >
                {status === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </footer>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          window.setTimeout(() => inputRef.current?.focus(), 80);
        }}
        className="pointer-events-auto flex min-h-12 items-center gap-2 rounded-full border border-white/50 bg-[rgba(15,16,22,0.92)] px-3.5 py-3 text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_18px_70px_rgba(15,16,22,0.24)] backdrop-blur-xl transition hover:shadow-[0_22px_80px_rgba(15,16,22,0.3)]"
        aria-expanded={open}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,var(--aqua),var(--bronze))]">
          {open ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        </span>
        <span>{open ? "Close" : "Chat Now"}</span>
      </button>
    </div>
  );
}

function asksForMedicalAdvice(value: string) {
  return /(diagnos|diagnose|prescrib|prescription|medicine|dosage|tablet|medical advice|what should i take|treat at home)/i.test(
    value,
  );
}
