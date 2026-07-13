const EVENTS = [
  { channel: "WA", color: "#25d366", text: "Agent resolved billing dispute for Marco T." },
  { channel: "VC", color: "#8b5cf6", text: "Voice agent booked appointment for Sarah K." },
  { channel: "WEB", color: "#3b82f6", text: "Web agent escalated to human for Priya M." },
  { channel: "WA", color: "#25d366", text: "Order status confirmed for 1,204 customers today" },
  { channel: "VC", color: "#8b5cf6", text: "Call completed in 43s — CSAT 5.0" },
  { channel: "WEB", color: "#3b82f6", text: "Lead qualified and routed to sales — Acme Corp" },
  { channel: "WA", color: "#25d366", text: "Refund processed automatically — INV-2024-0091" },
  { channel: "VC", color: "#8b5cf6", text: "Multilingual session completed in Portuguese" },
  { channel: "WEB", color: "#3b82f6", text: "Policy lookup answered — 0.3s response time" },
  { channel: "WA", color: "#25d366", text: "Subscription renewed via agent for Diego R." },
];

const ITEM_WIDTH = 320;

export default function ActivityTicker() {
  const doubled = [...EVENTS, ...EVENTS];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 h-[52px] flex items-center overflow-hidden border-t border-white/[0.055] bg-[rgba(13,14,17,0.85)] backdrop-blur-[12px]">
      <div className="flex shrink-0 items-center gap-[7px] border-r border-white/[0.055] px-5 h-full">
        <span className="block h-[7px] w-[7px] rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] animate-live-pulse" />
        <span className="whitespace-nowrap font-mono text-[9px] font-bold tracking-[0.18em] text-white/40">LIVE</span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="flex items-center animate-ticker" style={{ width: `${EVENTS.length * ITEM_WIDTH * 2}px` }}>
          {doubled.map((event, i) => (
            <div key={i} className="flex shrink-0 items-center gap-2 pr-6" style={{ width: ITEM_WIDTH }}>
              <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.14em]" style={{ color: event.color, background: `${event.color}15` }}>{event.channel}</span>
              <span className="flex-1 truncate font-sans text-[12px] text-white/45">{event.text}</span>
              <span className="ml-auto shrink-0 h-3.5 w-px bg-white/[0.07]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
