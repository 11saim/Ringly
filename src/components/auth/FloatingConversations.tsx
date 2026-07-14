const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: "#25d366",
  voice: "#8b5cf6",
  web: "#3b82f6",
};

interface Thread {
  id: number;
  name: string;
  initials: string;
  channel: "whatsapp" | "voice" | "web";
  messages: { role: "user" | "agent"; text: string }[];
  style: React.CSSProperties;
  animDuration: string;
  animDelay: string;
}

const THREADS: Thread[] = [
  {
    id: 1, channel: "whatsapp", name: "Sarah Jenkins", initials: "SJ",
    messages: [
      { role: "user", text: "My order #4821 hasn't arrived" },
      { role: "agent", text: "It's out for delivery today, before 6 PM ✓" },
    ],
    style: { left: "3%", top: "10%" }, animDuration: "28s", animDelay: "0s",
  },
  {
    id: 2, channel: "voice", name: "Michael Chen", initials: "MC",
    messages: [
      { role: "user", text: "Book a table for two tonight" },
      { role: "agent", text: "Confirmed for 8 PM at Harbour & Co." },
    ],
    style: { right: "4%", top: "12%" }, animDuration: "34s", animDelay: "-8s",
  },
  {
    id: 3, channel: "web", name: "Elena Rostova", initials: "ER",
    messages: [
      { role: "user", text: "What's your enterprise pricing?" },
      { role: "agent", text: "I've sent a custom quote to your email." },
    ],
    style: { left: "16%", top: "32%" }, animDuration: "32s", animDelay: "-14s",
  },
  {
    id: 4, channel: "whatsapp", name: "David Kim", initials: "DK",
    messages: [
      { role: "user", text: "Cancel my subscription please" },
      { role: "agent", text: "Done — you'll retain access until Mar 31." },
    ],
    style: { right: "14%", top: "38%" }, animDuration: "38s", animDelay: "-5s",
  },
  {
    id: 5, channel: "voice", name: "Rachel Adams", initials: "RA",
    messages: [
      { role: "user", text: "What hours is the clinic open?" },
      { role: "agent", text: "Mon–Fri 8am–7pm, Sat 9am–2pm" },
    ],
    style: { left: "4%", bottom: "20%" }, animDuration: "30s", animDelay: "-20s",
  },
  {
    id: 6, channel: "web", name: "Thomas Wright", initials: "TW",
    messages: [
      { role: "user", text: "Refund status for INV-2024-0091?" },
      { role: "agent", text: "Processed — $149 returns in 2–3 days." },
    ],
    style: { right: "6%", bottom: "14%" }, animDuration: "36s", animDelay: "-3s",
  },
  {
    id: 7, channel: "whatsapp", name: "Maria Garcia", initials: "MG",
    messages: [
      { role: "user", text: "Do you ship to Portugal?" },
      { role: "agent", text: "Yes, 5–7 business days, free over €80." },
    ],
    style: { left: "24%", bottom: "5%" }, animDuration: "42s", animDelay: "-17s",
  },
];

export default function FloatingConversations() {
  return (
    <>
      {THREADS.map((thread) => {
        const color = CHANNEL_COLORS[thread.channel];

        return (
          <div
            key={thread.id}
            className="pointer-events-none absolute z-10 animate-float-drift"
            style={{
              ...thread.style,
              ["--dur" as string]: thread.animDuration,
              ["--delay" as string]: thread.animDelay,
            }}
          >
            {/* Extremely realistic messaging app styling */}
            <div className="relative flex flex-col w-[260px] rounded-[24px] bg-[#121212] shadow-[0_16px_40px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
              
              {/* Realistic Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#1C1C1E] border-b border-white/5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner" style={{ background: color }}>
                  <span className="font-bold text-[11px] tracking-wide">{thread.initials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs font-semibold tracking-tight">{thread.name}</span>
                  <span className="text-white/50 text-[10px] mt-0.5">Active now</span>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex flex-col gap-3 p-4 bg-[#000000]/20">
                {thread.messages.map((msg, i) => {
                  const isAgent = msg.role === "agent";
                  return (
                    <div key={i} className={`flex w-full ${isAgent ? "justify-end" : "justify-start"}`}>
                      <div 
                        className={`px-3.5 py-2.5 text-[12.5px] leading-[1.35] shadow-sm ${
                          isAgent 
                            ? "rounded-[18px] rounded-br-[4px] text-white" 
                            : "rounded-[18px] rounded-bl-[4px] text-[#E5E5EA] bg-[#2C2C2E]"
                        }`}
                        style={isAgent ? { background: color } : {}}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        );
      })}
    </>
  );
}
