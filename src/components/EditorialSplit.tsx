import Image from "next/image";
import { PremiumButton } from "@/components/PremiumButton";
import { placeholderImages } from "@/data/media";
import { cn } from "@/lib/utils";

type EditorialSplitProps = {
  eyebrow: string;
  title: string;
  copy: string;
  points: string[];
  href: string;
  cta: string;
  reverse?: boolean;
  tone?: "bronze" | "blue";
};

export function EditorialSplit({
  eyebrow,
  title,
  copy,
  points,
  href,
  cta,
  reverse = false,
  tone = "bronze",
}: EditorialSplitProps) {
  const image =
    tone === "bronze"
      ? placeholderImages.hairRestoration
      : placeholderImages.skinLaser;

  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center",
          reverse && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div className="gradient-border relative min-h-[30rem] overflow-hidden rounded-[2.5rem] bg-[var(--ink)] shadow-[0_34px_100px_rgba(16,16,20,0.18)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover opacity-82"
          />
          <div
            className={cn(
              "absolute inset-0 opacity-90",
              tone === "bronze"
                ? "bg-[radial-gradient(circle_at_25%_20%,rgba(183,138,74,0.72),transparent_28%),radial-gradient(circle_at_70%_30%,rgba(247,241,232,0.24),transparent_24%),linear-gradient(135deg,#151515,#30261c_48%,#151515)]"
                : "bg-[radial-gradient(circle_at_25%_20%,rgba(30,111,134,0.72),transparent_28%),radial-gradient(circle_at_72%_24%,rgba(247,241,232,0.24),transparent_24%),linear-gradient(135deg,#151515,#102b32_48%,#151515)]",
            )}
          />
          <div className="absolute inset-x-8 bottom-8 rounded-[2rem] border border-white/12 bg-white/[0.08] p-6 text-[#FBF7EF] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#FBF7EF]/58">
              Radiance protocol
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {["Assess", "Plan", "Review"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-2 text-center text-xs font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#1E6F86]">
            {eyebrow}
          </p>
          <h2 className="font-serif text-5xl leading-[0.94] tracking-normal text-[#151515] sm:text-6xl">
            {title}
          </h2>
          <p className="mt-7 text-lg leading-8 text-[#151515]/68">{copy}</p>
          <div className="mt-8 grid gap-3">
            {points.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 border-b border-[#151515]/10 pb-3 text-sm font-semibold text-[#151515]"
              >
                <span className="h-2 w-2 rounded-full bg-[#B78A4A]" />
                {point}
              </div>
            ))}
          </div>
          <PremiumButton href={href} variant="outline" className="mt-9">
            {cta}
          </PremiumButton>
        </div>
      </div>
    </section>
  );
}
