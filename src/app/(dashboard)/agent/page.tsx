"use client";

import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  Bot,
  Clock,
  MessageSquare,
  Users,
  Phone,
  Globe,
  Languages,
  Smile,
  ThumbsUp,
  ArrowRight,
  Upload,
  FileText,
  ShieldCheck,
  Zap,
  Send,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Design Tokens ── */

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";
const CARD_HEADER = "px-5 py-3.5 border-b border-border/25";
const SECTION_GAP = "space-y-5";

/* ── Animation Variants ── */

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ── Data ── */

const quickConfig = [
  { icon: Clock, label: "Business Hours", description: "Opening hours and availability", color: "#6366f1" },
  { icon: MessageSquare, label: "Greeting Message", description: "First message customers receive", color: "#22c55e" },
  { icon: Smile, label: "Emoji Usage", description: "How often the agent uses emojis", color: "#f59e0b" },
  { icon: Zap, label: "Fallback Message", description: "When the agent can't help", color: "#8b5cf6" },
];

const toneOptions = [
  { id: "friendly", label: "Friendly", description: "Warm and approachable" },
  { id: "professional", label: "Professional", description: "Formal and business-like" },
  { id: "casual", label: "Casual", description: "Relaxed and informal" },
];

const lengthOptions = [
  { id: "short", label: "Short", description: "1-2 sentences" },
  { id: "balanced", label: "Balanced", description: "2-3 sentences" },
  { id: "detailed", label: "Detailed", description: "Full paragraphs" },
];

const emojiOptions = [
  { id: "off", label: "Off" },
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
];

const escalationRules = [
  { id: "human", label: "Transfer to Human", description: "When customer requests a human agent", icon: Users },
  { id: "closed", label: "Business Closed", description: "When outside working hours", icon: Clock },
  { id: "unknown", label: "Unknown Question", description: "When AI confidence is low", icon: Bot },
];

const testConversation = [
  { from: "customer", text: "Hi, do you have appointments available this Saturday?" },
  { from: "agent", text: "Hello! Yes, we have openings this Saturday at 10 AM, 2 PM, and 4 PM. Which time works best for you?" },
];

/* ── Page ── */

export default function AgentPage() {
  const [tone, setTone] = useState("friendly");
  const [length, setLength] = useState("balanced");
  const [emoji, setEmoji] = useState("medium");
  const [autoReply, setAutoReply] = useState(true);
  const [escalation, setEscalation] = useState<Record<string, boolean>>({
    human: true,
    closed: true,
    unknown: false,
  });
  const [testInput, setTestInput] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  return (
    <AppShell fullWidth>
      <div className={SECTION_GAP}>
        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-end justify-between"
        >
          <div>
            <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] leading-none">
              AI Agent
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground/50">
              Configure how your WhatsApp AI assistant responds to customers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium",
                "border border-border/50 bg-card text-foreground/70",
                "transition-all duration-150 hover:bg-hover-bg hover:text-foreground hover:border-border/80",
              )}
            >
              <Bot size={14} strokeWidth={1.8} />
              Test Agent
            </button>
            <button
              onClick={handleSave}
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold",
                "bg-accent text-white transition-all duration-150",
                "hover:bg-accent-hover",
              )}
            >
              {saved ? <Check size={14} strokeWidth={2} /> : null}
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>
        </motion.div>

        {/* ── AGENT STATUS ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className={cn(CARD, "overflow-hidden")}
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-success/[0.08]">
                  <Bot size={22} strokeWidth={1.5} className="text-success" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold text-foreground">Agent Online</h2>
                    <span className="h-2 w-2 rounded-full bg-success" />
                  </div>
                  <p className="text-[12px] text-muted-foreground/50 mt-0.5">Bloom Studio · WhatsApp Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground/40 uppercase tracking-wider">Messages Today</p>
                  <p className="text-[20px] font-bold text-foreground tabular-nums mt-0.5">127</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground/40 uppercase tracking-wider">Avg Response</p>
                  <p className="text-[20px] font-bold text-foreground tabular-nums mt-0.5">1.2s</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── QUICK CONFIGURATION ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickConfig.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                variants={fadeUp}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className={cn(CARD, "p-5 cursor-pointer transition-all duration-150 hover:shadow-[var(--shadow-card-hover)] hover:border-border/50")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${item.color}0D` }}>
                    <span style={{ color: item.color } as React.CSSProperties}><Icon size={18} strokeWidth={1.5} /></span>
                  </div>
                  <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground/25" />
                </div>
                <h3 className="text-[13px] font-semibold text-foreground">{item.label}</h3>
                <p className="text-[11px] text-muted-foreground/45 mt-1">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── BUSINESS INFORMATION ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className={cn(CARD, "overflow-hidden")}
        >
          <div className={CARD_HEADER}>
            <h2 className="text-[13px] font-semibold text-foreground">Business Information</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-[12px] font-medium text-muted-foreground/60 mb-1.5 block">Business Name</label>
                <input
                  type="text"
                  defaultValue="Bloom Studio"
                  className="h-[40px] w-full rounded-[10px] border border-border/40 bg-muted/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground/60 mb-1.5 block">Business Type</label>
                <input
                  type="text"
                  defaultValue="Hair Salon"
                  className="h-[40px] w-full rounded-[10px] border border-border/40 bg-muted/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground/60 mb-1.5 block">Phone Number</label>
                <input
                  type="text"
                  defaultValue="+971 50 123 4567"
                  className="h-[40px] w-full rounded-[10px] border border-border/40 bg-muted/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground/60 mb-1.5 block">Business Address</label>
                <input
                  type="text"
                  defaultValue="Dubai Marina, Dubai, UAE"
                  className="h-[40px] w-full rounded-[10px] border border-border/40 bg-muted/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground/60 mb-1.5 block">Timezone</label>
                <input
                  type="text"
                  defaultValue="GMT+4 (Dubai)"
                  className="h-[40px] w-full rounded-[10px] border border-border/40 bg-muted/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted-foreground/60 mb-1.5 block">Response Language</label>
                <input
                  type="text"
                  defaultValue="English, Arabic"
                  className="h-[40px] w-full rounded-[10px] border border-border/40 bg-muted/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── AI BEHAVIOUR ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className={cn(CARD, "overflow-hidden")}
        >
          <div className={CARD_HEADER}>
            <h2 className="text-[13px] font-semibold text-foreground">AI Behaviour</h2>
          </div>
          <div className="p-5 space-y-6">
            {/* Tone */}
            <div>
              <label className="text-[12px] font-medium text-muted-foreground/60 mb-2 block">Agent Tone</label>
              <div className="grid grid-cols-3 gap-3">
                {toneOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTone(opt.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-[10px] border p-3 text-center transition-all duration-150",
                      tone === opt.id
                        ? "border-accent bg-accent/[0.06] text-accent"
                        : "border-border/40 text-muted-foreground/60 hover:border-border/60 hover:bg-hover-bg/50",
                    )}
                  >
                    <span className="text-[13px] font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-muted-foreground/40">{opt.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Response Length */}
            <div>
              <label className="text-[12px] font-medium text-muted-foreground/60 mb-2 block">Response Length</label>
              <div className="grid grid-cols-3 gap-3">
                {lengthOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setLength(opt.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-[10px] border p-3 text-center transition-all duration-150",
                      length === opt.id
                        ? "border-accent bg-accent/[0.06] text-accent"
                        : "border-border/40 text-muted-foreground/60 hover:border-border/60 hover:bg-hover-bg/50",
                    )}
                  >
                    <span className="text-[13px] font-semibold">{opt.label}</span>
                    <span className="text-[10px] text-muted-foreground/40">{opt.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Usage */}
            <div>
              <label className="text-[12px] font-medium text-muted-foreground/60 mb-2 block">Emoji Usage</label>
              <div className="grid grid-cols-3 gap-3">
                {emojiOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setEmoji(opt.id)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-[10px] border p-2.5 text-center transition-all duration-150",
                      emoji === opt.id
                        ? "border-accent bg-accent/[0.06] text-accent"
                        : "border-border/40 text-muted-foreground/60 hover:border-border/60 hover:bg-hover-bg/50",
                    )}
                  >
                    <span className="text-[13px] font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Reply */}
            <div className="flex items-center justify-between rounded-[10px] border border-border/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-muted/50">
                  <MessageSquare size={14} strokeWidth={1.8} className="text-muted-foreground/40" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Auto Reply</p>
                  <p className="text-[11px] text-muted-foreground/45">Automatically respond to incoming messages</p>
                </div>
              </div>
              <Switch checked={autoReply} onCheckedChange={setAutoReply} />
            </div>
          </div>
        </motion.div>

        {/* ── KNOWLEDGE BASE ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className={cn(CARD, "overflow-hidden")}
        >
          <div className={CARD_HEADER}>
            <h2 className="text-[13px] font-semibold text-foreground">Knowledge Base</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-accent/[0.08]">
                  <FileText size={22} strokeWidth={1.5} className="text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-foreground">Knowledge Base Connected</h3>
                    <span className="h-2 w-2 rounded-full bg-success" />
                  </div>
                  <p className="text-[12px] text-muted-foreground/50 mt-0.5">12 documents · Last updated 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium",
                    "border border-border/50 bg-card text-foreground/70",
                    "transition-all duration-150 hover:bg-hover-bg hover:text-foreground hover:border-border/80",
                  )}
                >
                  <Upload size={14} strokeWidth={1.8} />
                  Upload
                </button>
                <button
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold",
                    "bg-accent text-white transition-all duration-150",
                    "hover:bg-accent-hover",
                  )}
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── ESCALATION RULES ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.25 }}
          className={cn(CARD, "overflow-hidden")}
        >
          <div className={CARD_HEADER}>
            <h2 className="text-[13px] font-semibold text-foreground">Escalation Rules</h2>
          </div>
          <div className="p-5 space-y-3">
            {escalationRules.map((rule) => {
              const Icon = rule.icon;
              return (
                <div
                  key={rule.id}
                  className="flex items-center justify-between rounded-[10px] border border-border/40 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-muted/50">
                      <Icon size={14} strokeWidth={1.8} className="text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{rule.label}</p>
                      <p className="text-[11px] text-muted-foreground/45">{rule.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={escalation[rule.id] ?? false}
                    onCheckedChange={(checked) =>
                      setEscalation((prev) => ({ ...prev, [rule.id]: checked }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── TEST AGENT ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className={cn(CARD, "overflow-hidden")}
        >
          <div className={CARD_HEADER}>
            <h2 className="text-[13px] font-semibold text-foreground">Test Agent</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-3">
              {testConversation.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.from === "customer" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-[12px] px-3.5 py-2.5 text-[13px] leading-relaxed",
                      msg.from === "customer"
                        ? "bg-accent text-white"
                        : "bg-muted/50 text-foreground",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask your AI anything..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="flex-1 h-[40px] rounded-[10px] border border-border/40 bg-muted/30 px-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
              />
              <button
                className={cn(
                  "inline-flex items-center justify-center h-[40px] w-[40px] rounded-[10px]",
                  "bg-accent text-white transition-all duration-150",
                  "hover:bg-accent-hover",
                )}
              >
                <Send size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── ANALYTICS ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Messages Today", value: "127", trend: "+18%", icon: MessageSquare, color: "#6366f1" },
            { label: "Avg Response Time", value: "1.2s", trend: "-0.3s", icon: Clock, color: "#22c55e" },
            { label: "Resolved Automatically", value: "89%", trend: "+5%", icon: Bot, color: "#8b5cf6" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                variants={fadeUp}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className={cn(CARD, "p-5 cursor-default transition-all duration-150 hover:shadow-[var(--shadow-card-hover)] hover:border-border/50")}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase">{m.label}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-muted/50">
                    <Icon size={14} strokeWidth={1.8} className="text-muted-foreground/35" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-[32px] font-bold text-foreground tracking-[-0.03em] leading-none tabular-nums">
                    {m.value}
                  </div>
                  <span className="text-[11px] font-semibold text-success">{m.trend}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </AppShell>
  );
}
