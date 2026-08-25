"use client";

const colors = [
  "#22C55E",
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#0F172A",
];

const row1 = [
  "Glow Dermatology",
  "Bite & Sip Cafe",
  "Luxe Nail Bar",
  "FreshCuts Salon",
  "Urban Paws Vet",
  "The Fit Lab",
  "Bloom Florist",
  "QuickFix Repairs",
  "Sunrise Yoga",
  "Craft & Pour",
];

const row2 = [
  "Smile Dental",
  "Savory Bites",
  "Silk Hair Studio",
  "Pawfect Pets",
  "Iron Gym",
  "Blossom Spa",
  "TechFix Pro",
  "Cloud Nine Bakery",
  "Trailhead Outfitters",
  "Zen Wellness",
];

function MarqueeRow({
  items,
  direction,
  speed = 30,
}: {
  items: string[];
  direction: "left" | "right";
  speed?: number;
}) {
  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap py-2" aria-hidden="true">
      <div
        className="inline-flex items-center"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {duplicated.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="mx-4 sm:mx-6 text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight select-none"
            style={{ color: colors[i % colors.length], opacity: 0.6 }}
          >
            <span className="mx-1 sm:mx-2 text-[#22C55E]">✦</span>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrustedBy() {
  return (
    <section className="relative -mt-2 sm:-mt-4 pt-6 pb-12 sm:pt-8 sm:pb-16 overflow-hidden" aria-labelledby="trusted-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 mb-6 sm:mb-8">
        <div className="text-center">
          <h2 id="trusted-heading" className="text-2xl sm:text-3xl md:text-[2.75rem] font-bold text-[#0F172A] tracking-[-0.02em] leading-tight">
            Businesses that{" "}
            <span className="bg-gradient-to-r from-[#22C55E] to-[#6366F1] bg-clip-text text-transparent">
              never miss
            </span>{" "}
            a message
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-md mx-auto">
            Clinics, salons, restaurants, retailers — all on WhatsApp with Ringly
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <MarqueeRow items={row1} direction="left" speed={40} />
        <MarqueeRow items={row2} direction="right" speed={45} />
      </div>
    </section>
  );
}
