import Image from "next/image";
import type {
  ClinicSettings,
  CmsImage,
  CmsStat,
  HomepageContent,
} from "@/types/cms";

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

function selectHeroImage(images: CmsImage[]) {
  return (
    images.find((image) =>
      /(^|[-\s])doctor[-\s]?hero|hero[-_\s]?primary|satyarth.*hero/i.test(
        imageSearchText(image),
      ),
    ) ||
    images.find(
      (image) =>
        !isRecognitionImage(image) &&
        /doctor.*patient|with-patient|consultation/i.test(
          imageSearchText(image),
        ),
    ) ||
    images.find(
      (image) =>
        !isRecognitionImage(image) &&
        /doctor|satyarth/i.test(imageSearchText(image)),
    ) ||
    images.find((image) => !isRecognitionImage(image)) ||
    images[0]
  );
}

function HeroVisualFallback() {
  return (
    <div className="grid h-full min-h-[28rem] place-items-center bg-[linear-gradient(135deg,#fff7ed,#eef7f8)]">
      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--bronze)]">
          Radiance Clinics
        </p>
        <p className="mt-3 font-serif text-4xl leading-none text-[var(--ink)]">
          Skin, Hair & Aesthetic Care
        </p>
      </div>
    </div>
  );
}

export function HeroMediaCollage({
  images,
  settings,
}: {
  images: CmsImage[];
  stats: CmsStat[];
  settings: ClinicSettings;
  assistantTeaser: HomepageContent["assistantTeaser"];
}) {
  const image = selectHeroImage(images);

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl">
      <div className="gradient-border relative overflow-hidden rounded-[1.5rem] bg-[var(--ink)] shadow-[0_34px_110px_rgba(16,16,20,0.18)] sm:rounded-[2rem]">
        <div className="relative aspect-[4/5] min-h-0 sm:min-h-[31rem]">
          {image ? (
            <Image
              src={image.src || image.desktopUrl}
              alt={image.altText || image.alt}
              fill
              preload
              sizes="(min-width: 1024px) 560px, 100vw"
              placeholder={image.blurDataUrl ? "blur" : "empty"}
              blurDataURL={image.blurDataUrl}
              className="object-cover"
              style={{ objectPosition: imagePosition(image) }}
            />
          ) : (
            <HeroVisualFallback />
          )}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,20,0.04),rgba(16,16,20,0.68))]" />
          <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-white/14 px-3 py-2 text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:text-[0.62rem] sm:tracking-[0.2em]">
            Doctor-led care
          </div>
          <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-[1.2rem] border border-white/14 bg-[rgba(16,16,20,0.56)] p-4 text-white backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:rounded-[1.55rem] sm:p-5">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-[var(--champagne)]">
              Radiance Clinics
            </p>
            <p className="mt-2 max-w-sm font-serif text-2xl leading-none sm:text-3xl">
              Skin, hair, laser and aesthetic care in {settings.city}.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex min-w-0 flex-wrap gap-2">
        {["Skin", "Hair", "Laser", "Aesthetics"].map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/60 bg-white/54 px-3 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-[var(--ink)]/62 shadow-sm backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.16em]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
