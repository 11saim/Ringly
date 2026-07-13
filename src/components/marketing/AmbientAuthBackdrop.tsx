"use client";

import { useEffect, useState } from "react";

const messages = [
  "Booked in 12 seconds.",
  "Answered while you slept.",
  "Zero missed messages.",
  "Sold out and reordered — automatically.",
  "Refund request escalated.",
  "Calendar checked instantly.",
];

export function AmbientAuthBackdrop({ businessName }: { businessName?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);
  const bubbles = [
    { label: businessName ? `${businessName}'s agent is warming up…` : "Hi — I'd love to book a haircut Saturday", rot: "-6deg", dur: "7s", top: "18%", left: "12%" },
    { label: "Confirmed for Sat, 3:30 PM ✓", rot: "3deg", dur: "9s", top: "42%", left: "38%" },
    { label: "Deposit received — $25", rot: "-2deg", dur: "11s", top: "64%", left: "18%" },
    { label: "I checked Ana's calendar — 4:15 also works", rot: "5deg", dur: "10s", top: "24%", left: "62%" },
    { label: "Low confidence: customer asked for refund → human handoff", rot: "-4deg", dur: "12s", top: "55%", left: "58%" },
    { label: "Voice call summarized · 48 seconds", rot: "2deg", dur: "8s", top: "74%", left: "42%" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0b] text-[#f2f2f3]">
      <div className="absolute -top-24 -left-16 h-96 w-96 rounded-full bg-[#4f46e5] opacity-40 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-[#8b5cf6] opacity-30 blur-3xl animate-blob" style={{ animationDelay: "-6s" }} />
      <div className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-[#4f46e5] opacity-25 blur-3xl animate-blob" style={{ animationDelay: "-12s" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />

      {bubbles.map((b, idx) => (
        <div
          key={idx}
          className="absolute max-w-[290px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 text-sm shadow-2xl animate-bubble"
          style={{
            top: b.top, left: b.left,
            ["--rot" as string]: b.rot,
            ["--dur" as string]: b.dur,
          } as React.CSSProperties}
        >
          <div className="mb-1 text-[10px] uppercase tracking-widest text-white/50">WhatsApp</div>
          <div>{b.label}</div>
        </div>
      ))}

      <div className="absolute left-8 top-1/2 hidden w-72 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur md:block">
        <div className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/45">Agent state</div>
        {[
          ["Intent", "booking", "92%"],
          ["Catalog", "synced", "6 items"],
          ["Next action", "hold slot", "safe"],
        ].map(([a, b, c]) => (
          <div key={a} className="mb-2 grid grid-cols-[1fr_auto] gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs last:mb-0">
            <span className="text-white/50">{a}</span><span className="font-mono">{b} · {c}</span>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-16 flex flex-col items-center px-8 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Live on Ringly</div>
        <div className="h-16 relative w-full">
          {messages.map((m, idx) => (
            <div
              key={m}
              className={`absolute inset-0 text-3xl font-bold tracking-tight transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
