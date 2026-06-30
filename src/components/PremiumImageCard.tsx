import Image from "next/image";
import type { CmsImage } from "@/types/cms";
import { cn } from "@/lib/utils";

export function PremiumImageCard({
  image,
  label,
  title,
  caption,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 34vw, 100vw",
  className,
  imageClassName,
  preload = false,
  overlay = true,
}: {
  image: CmsImage;
  label?: string;
  title?: string;
  caption?: string;
  aspect?: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  preload?: boolean;
  overlay?: boolean;
}) {
  const focal = image.focalPoint || { x: 0.5, y: 0.5 };

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-white/55 bg-white shadow-[0_28px_90px_rgba(15,16,22,0.13)]",
        aspect,
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.altText || image.alt}
        fill
        preload={preload}
        placeholder={image.blurDataUrl ? "blur" : "empty"}
        blurDataURL={image.blurDataUrl}
        sizes={sizes}
        className={cn(
          "object-cover transition duration-700 group-hover:scale-[1.045]",
          imageClassName,
        )}
        style={{
          objectPosition: `${focal.x * 100}% ${focal.y * 100}%`,
        }}
      />
      {overlay ? (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,22,0.02)_20%,rgba(15,16,22,0.74)_100%)]" />
      ) : null}
      {(label || title || caption) && (
        <figcaption className="absolute inset-x-5 bottom-5 text-white">
          {label ? (
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-[var(--champagne)]">
              {label}
            </p>
          ) : null}
          {title ? (
            <h3 className="mt-2 font-serif text-3xl leading-none">{title}</h3>
          ) : null}
          {caption ? (
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/68">
              {caption}
            </p>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
