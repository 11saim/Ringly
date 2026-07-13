const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: "#25d366",
  voice: "#8b5cf6",
  web: "#3b82f6",
};

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WA",
  voice: "VC",
  web: "WEB",
};

interface Thread {
  id: number;
  channel: "whatsapp" | "voice" | "web";
  messages: { role: "user" | "agent"; text: string }[];
  style: React.CSSProperties;
  animDuration: string;
  animDelay: string;
}

const THREADS: Thread[] = [
  {
    id: 1, channel: "whatsapp",
    messages: [
      { role: "user", text: "My order #4821 hasn't arrived" },
      { role: "agent", text: "It's out for delivery today, before 6 PM ✓" },
    ],
    style: { left: "4%", top: "18%" }, animDuration: "28s", animDelay: "0s",
  },
  {
    id: 2, channel: "voice",
    messages: [
      { role: "user", text: "Book a table for two tonight" },
      { role: "agent", text: "Confirmed for 8 PM at Harbour & Co." },
    ],
    style: { right: "5%", top: "22%" }, animDuration: "34s", animDelay: "-8s",
  },
  {
    id: 3, channel: "web",
    messages: [
      { role: "user", text: "What's your enterprise pricing?" },
      { role: "agent", text: "I've sent a custom quote to your email." },
    ],
    style: { left: "8%", bottom: "28%" }, animDuration: "32s", animDelay: "-14s",
  },
  {
    id: 4, channel: "whatsapp",
    messages: [
      { role: "user", text: "Cancel my subscription please" },
      { role: "agent", text: "Done — you'll retain access until Mar 31." },
    ],
    style: { right: "7%", bottom: "24%" }, animDuration: "38s", animDelay: "-5s",
  },
  {
    id: 5, channel: "voice",
    messages: [
      { role: "user", text: "What hours is the clinic open?" },
      { role: "agent", text: "Mon–Fri 8am–7pm, Sat 9am–2pm" },
    ],
    style: { left: "22%", top: "10%" }, animDuration: "30s", animDelay: "-20s",
  },
  {
    id: 6, channel: "web",
    messages: [
      { role: "user", text: "Refund status for INV-2024-0091?" },
      { role: "agent", text: "Processed — $149 returns in 2–3 days." },
    ],
    style: { right: "18%", top: "8%" }, animDuration: "36s", animDelay: "-3s",
  },
  {
    id: 7, channel: "whatsapp",
    messages: [
      { role: "user", text: "Do you ship to Portugal?" },
      { role: "agent", text: "Yes, 5–7 business days, free over €80." },
    ],
    style: { left: "38%", bottom: "12%" }, animDuration: "42s", animDelay: "-17s",
  },
];

export default function FloatingConversations() {
  return (
    <>
      {THREADS.map((thread) => {
        const color = CHANNEL_COLORS[thread.channel];
        const label = CHANNEL_LABELS[thread.channel];
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
            <div
              style={{
                background: "rgba(19,21,25,0.55)",
                border: `1px solid ${color}22`,
                borderRadius: 10,
                padding: "10px 13px",
                minWidth: 200,
                maxWidth: 240,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "block", boxShadow: `0 0 6px ${color}` }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.16em", color, fontWeight: 700 }}>{label}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {thread.messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-start" : "flex-end" }}>
                    <div style={{
                      background: msg.role === "agent" ? `${color}18` : "rgba(255,255,255,0.05)",
                      borderRadius: msg.role === "agent" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                      padding: "5px 9px", maxWidth: "88%", fontSize: 11, lineHeight: 1.45,
                      color: msg.role === "agent" ? color : "rgba(242,243,245,0.7)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
