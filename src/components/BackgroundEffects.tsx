import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function AnimatedAuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="aurora-orb aurora-orb-a" />
      <div className="aurora-orb aurora-orb-b" />
      <div className="aurora-orb aurora-orb-c" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,247,237,0.48),transparent_38%),linear-gradient(180deg,rgba(255,247,237,0.08),rgba(255,247,237,0.74))]" />
    </div>
  );
}

export function SciencePatternOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.18] science-pattern",
        className,
      )}
    />
  );
}

export function LuxuryNoiseOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.18] luxury-noise",
        className,
      )}
    />
  );
}

export function ContourMeshOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.14] contour-mesh",
        className,
      )}
    />
  );
}

export function SectionGlowMask({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="section-glow section-glow-a" />
      <div className="section-glow section-glow-b" />
    </div>
  );
}

export function FloatingSkinCells({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: 7 }, (_, index) => (
        <span
          key={index}
          className="skin-cell"
          style={
            {
              "--cell-x": `${8 + ((index * 19) % 84)}%`,
              "--cell-y": `${10 + ((index * 23) % 78)}%`,
              "--cell-delay": `${index * 0.55}s`,
              "--cell-size": `${18 + (index % 5) * 8}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
