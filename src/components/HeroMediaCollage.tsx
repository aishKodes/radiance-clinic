import Image from "next/image";
import { Bot } from "lucide-react";
import { OpenChatButton } from "@/components/OpenChatButton";
import type { ClinicSettings, CmsImage, CmsStat, HomepageContent } from "@/types/cms";

function imagePosition(image: CmsImage) {
  const focal = image.focalPoint || { x: 0.5, y: 0.5 };
  return `${focal.x * 100}% ${focal.y * 100}%`;
}

function imageSearchText(image: CmsImage) {
  return `${image.filename || ""} ${image.role || ""} ${image.category || ""} ${image.altText || ""} ${image.alt || ""}`;
}

function isRecognitionImage(image: CmsImage) {
  return /anil|award|recognition|event|badge|threebest|threebestrated/i.test(
    imageSearchText(image),
  );
}

function imageMatches(image: CmsImage, pattern: RegExp) {
  return pattern.test(imageSearchText(image));
}

function PremiumPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[12rem] items-center justify-center rounded-[inherit] bg-[radial-gradient(circle_at_28%_18%,rgba(42,195,214,0.24),transparent_34%),radial-gradient(circle_at_78%_28%,rgba(255,123,97,0.18),transparent_32%),linear-gradient(135deg,#fff7ed,#f3ede3)]">
      <div className="rounded-full border border-[var(--ink)]/10 bg-white/55 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ink)]/58 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function FramedImage({
  image,
  sizes,
  className = "",
  priority = false,
  fit = "cover",
}: {
  image?: CmsImage;
  sizes: string;
  className?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}) {
  if (!image) {
    return <PremiumPlaceholder label="Radiance Visual" />;
  }

  return (
    <Image
      src={image.src || image.desktopUrl}
      alt={image.altText || image.alt}
      fill
      preload={priority}
      placeholder={image.blurDataUrl ? "blur" : "empty"}
      blurDataURL={image.blurDataUrl}
      sizes={sizes}
      className={className || (fit === "contain" ? "object-contain" : "object-cover")}
      style={{ objectPosition: imagePosition(image) }}
    />
  );
}

export function HeroMediaCollage({
  images,
  settings,
  assistantTeaser,
}: {
  images: CmsImage[];
  stats: CmsStat[];
  settings: ClinicSettings;
  assistantTeaser: HomepageContent["assistantTeaser"];
}) {
  const recognitionImage =
    images.find((image) =>
      imageMatches(image, /radiance-hero-anil-kapoor-feature-01|anil.*kapoor.*feature/i),
    ) ||
    images.find((image) =>
      imageMatches(image, /radiance-recognition-anil-kapoor-event-01|anil.*kapoor|recognition.*event/i),
    ) ||
    images.find((image) => imageMatches(image, /recognition|event|award/i));
  const mainImage =
    images.find((image) =>
      !isRecognitionImage(image) &&
      imageMatches(image, /radiance-doctor-satyarth-hero-primary-02|doctor-hero|hero-primary/i),
    ) ||
    images.find((image) =>
      !isRecognitionImage(image) &&
      imageMatches(image, /radiance-doctor-satyarth-hero-primary-01|doctor-image|hero-secondary/i),
    ) ||
    images.find((image) =>
      !isRecognitionImage(image) &&
      imageMatches(image, /radiance-hero-gallery-consultation|gallery.*consultation|hero-gallery.*consultation/i),
    ) ||
    images.find((image) =>
      !isRecognitionImage(image) &&
      imageMatches(image, /radiance-doctor-satyarth-consultation|satyarth.*consultation|doctor.*consultation/i),
    ) ||
    images.find((image) =>
      !isRecognitionImage(image) &&
      imageMatches(image, /radiance-hero-gallery-clinic|gallery.*clinic|clinic.*gallery/i),
    ) ||
    images.find((image) =>
      !isRecognitionImage(image) &&
      imageMatches(image, /doctor-consultation-feature|consultation-feature|clinic-interior-secondary|reception-wide|interior-wide/i),
    ) ||
    images.find((image) =>
      !isRecognitionImage(image) &&
      imageMatches(image, /doctor|consultation|clinic-|reception|interior|patient/i),
    ) ||
    images[0];
  const mainIsDoctor = mainImage
    ? /doctor|satyarth|hero-primary|hero-secondary/i.test(imageSearchText(mainImage))
    : false;
  const galleryStrip = images
    .filter((image) => image !== mainImage && image !== recognitionImage)
    .filter((image) =>
      /hero-gallery|gallery|doctor|consultation|clinic|reception|interior|recognition/i.test(
        imageSearchText(image),
      ),
    )
    .slice(0, 3);

  const chips = [
    "Hair Restoration",
    "Skin & Laser",
    "Aesthetic Dermatology",
    `${settings.city}, ${settings.region}`,
  ];

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="grid gap-4">
        <div className={`gradient-border relative overflow-hidden rounded-[2.1rem] bg-[var(--ink)] shadow-[0_34px_110px_rgba(16,16,20,0.18)] ${mainIsDoctor ? "aspect-[4/5] sm:aspect-[4/5] lg:aspect-[4/5]" : "aspect-[4/3] lg:aspect-[5/4]"}`}>
          <FramedImage
            image={mainImage}
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover opacity-95"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,20,0.02),rgba(16,16,20,0.72))]" />
          <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/20 bg-white/14 px-4 py-2 text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-white backdrop-blur">
            Doctor-led care
          </div>
          <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-[1.75rem] border border-white/14 bg-[rgba(16,16,20,0.48)] p-4 text-white backdrop-blur-xl sm:p-5">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[var(--champagne)]">
              Radiance Clinics
            </p>
            <p className="mt-2 max-w-sm font-serif text-3xl leading-none">
              Hair transplant, skin, laser and aesthetic care under one roof.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="overflow-hidden rounded-[1.75rem] border border-white/64 bg-white/62 shadow-[0_22px_70px_rgba(16,16,20,0.1)] backdrop-blur-xl lg:col-span-2">
            <div className="relative aspect-[4/3] bg-[var(--mist)] lg:aspect-[16/7]">
              <FramedImage
                image={recognitionImage}
                sizes="(min-width: 1024px) 260px, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(15,16,22,0.62))]" />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white/70">
                  Recognition Moment
                </p>
                <p className="mt-1 text-sm font-extrabold">
                  Radiance Clinics highlight
                </p>
              </div>
            </div>
            <p className="px-5 py-4 text-xs leading-5 text-[var(--ink)]/62 lg:py-3">
              Recognition moments, patient trust, and two decades of clinical
              experience.
            </p>
          </article>

          <article className="grid content-between rounded-[1.75rem] border border-white/64 bg-white/62 p-5 shadow-[0_22px_70px_rgba(16,16,20,0.1)] backdrop-blur-xl lg:hidden">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--aqua),var(--coral))] text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-[var(--ink)]">
                  Chat Now
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--ink)]/62">
                  {assistantTeaser.text || "Ask about treatments or request a consultation."}
                </p>
              </div>
            </div>
            <OpenChatButton className="mt-5 min-h-10 w-fit px-4 py-2 text-[0.68rem] text-[var(--ink)]">
              Chat Now
            </OpenChatButton>
          </article>

        </div>

        {galleryStrip.length ? (
          <div className="grid grid-cols-3 gap-2 rounded-[1.55rem] border border-white/60 bg-white/46 p-2 shadow-[0_18px_58px_rgba(16,16,20,0.08)] backdrop-blur-xl lg:hidden">
            {galleryStrip.map((image, index) => (
              <div
                key={image.id || image.src || index}
                className="relative aspect-[4/3] overflow-hidden rounded-[1.15rem] bg-[var(--mist)]"
              >
                <FramedImage
                  image={image}
                  sizes="(min-width: 1024px) 160px, 31vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {chips.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/60 bg-white/48 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--ink)]/62 shadow-sm backdrop-blur"
          >
            {item}
          </span>
        ))}
        </div>
      </div>
    </div>
  );
}
