"use client";

export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Bold grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />

      {/* Animated gradient sweep */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, transparent 30%, rgba(99,102,241,0.06) 45%, rgba(16,185,129,0.06) 55%, transparent 70%)",
          backgroundSize: "300% 300%",
          animation: "gradient-shift 8s ease infinite",
        }}
      />

    </div>
  );
}
