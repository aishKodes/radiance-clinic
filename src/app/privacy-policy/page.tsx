import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/metadata";
import { webPageJsonLd } from "@/lib/schema";
import { clinicIdentity } from "@/lib/seo-config";
import { ConversionLink } from "@/components/ConversionLink";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Radiance Clinics",
  description: "How Radiance Clinics handles website, consultation, analytics and private question information.",
  path: "/privacy-policy",
});

const sections = [
  {
    title: "Information you choose to share",
    paragraphs: [
      "When you request a callback or contact the clinic, you may provide your name, phone number, treatment concern, preferred date and an optional message. The Ask the Doctor architecture can also accept a category, question and optional private contact detail when a secure submission endpoint is configured.",
      "Medical questions and contact details are treated as private intake information. They are not published automatically and are not sent to Google Analytics.",
    ],
  },
  {
    title: "How the information is used",
    paragraphs: [
      "Information you submit is used to respond to your enquiry, arrange a consultation, perform clinical triage, prevent spam and improve patient information. A website enquiry does not create a doctor-patient relationship or confirm an appointment.",
    ],
  },
  {
    title: "Analytics and technical information",
    paragraphs: [
      "The website uses Google Analytics to understand page visits and broad interaction patterns. Concern-search analytics records privacy-preserving measurements such as query length, token count, result count, content type and destination path. It does not send the wording of a medical search or private question.",
      "Hosting and security systems may process technical data such as IP address, browser type, device information, timestamps and requested pages to operate and protect the website.",
    ],
  },
  {
    title: "AI assistant",
    paragraphs: [
      "The Radiance AI Assistant may use a configured third-party model provider to generate general service guidance. Do not enter information you do not want processed for that reply. The assistant is not a diagnostic service and should not be used for emergencies or prescriptions.",
    ],
  },
  {
    title: "Service providers and links",
    paragraphs: [
      "The site may rely on hosting, analytics, maps, review, messaging and AI service providers. Their processing is governed by their own terms and privacy notices. Links to WhatsApp, Google, YouTube and other external services take you to those services.",
    ],
  },
  {
    title: "Retention, access and deletion",
    paragraphs: [
      "Information should be retained only as long as needed for enquiry handling, clinical administration, legal obligations, security and dispute resolution. To ask what information the clinic holds about you, request a correction or request deletion where applicable, contact the clinic using the details below.",
    ],
  },
  {
    title: "Children and urgent care",
    paragraphs: [
      "A parent or guardian should contact the clinic for a minor. Do not use website forms or the AI assistant for an emergency; contact an appropriate emergency service or medical facility.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd({ title: "Privacy Policy", description: "Radiance Clinics website privacy information.", path: "/privacy-policy" })} />
      <section className="bg-[var(--ivory)] px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[var(--aqua)]">Last updated 15 August 2026</p>
          <h1 className="mt-5 font-serif text-[clamp(4rem,9vw,8rem)] leading-[0.88] text-[var(--ink)]">Privacy Policy</h1>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-[var(--ink)]/68">This notice explains how information is handled when you use the Radiance Clinics website or choose to contact the clinic through it.</p>
        </div>
      </section>
      <section className="bg-[var(--mist)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl space-y-6">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[2rem] border border-[var(--ink)]/10 bg-white/66 p-7 sm:p-9">
              <h2 className="font-serif text-4xl leading-none text-[var(--ink)]">{section.title}</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-[var(--ink)]/68">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </article>
          ))}
          <article className="rounded-[2rem] bg-[var(--ink)] p-7 text-white sm:p-9">
            <h2 className="font-serif text-4xl leading-none">Contact</h2>
            <p className="mt-6 text-base leading-8 text-white/68">{clinicIdentity.legalName}<br />{clinicIdentity.address}<br /><a className="text-[var(--champagne)]" href={`mailto:${clinicIdentity.email}`}>{clinicIdentity.email}</a><br /><ConversionLink className="text-[var(--champagne)]" href={`tel:${clinicIdentity.primaryPhoneTel}`} eventName="call_click">{clinicIdentity.primaryPhone}</ConversionLink></p>
          </article>
        </div>
      </section>
    </>
  );
}
