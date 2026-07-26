"use client";

import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, User, Building2, Sparkles, FileText, BookOpen,
  Send, RotateCcw, ChevronDown, Check, Globe, Languages,
  ArrowRight, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Design Tokens ── */

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";
const SECTION_GAP = "space-y-6";

/* ── Animation ── */

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ── Data ── */

const toneOptions = [
  { id: "professional", label: "Professional", emoji: "💼", description: "Formal and business-like" },
  { id: "friendly", label: "Friendly", emoji: "😊", description: "Warm and approachable" },
  { id: "luxury", label: "Luxury", emoji: "✨", description: "Elevated and refined" },
  { id: "casual", label: "Casual", emoji: "👋", description: "Relaxed and informal" },
  { id: "formal", label: "Formal", emoji: "🎩", description: "Traditional and polite" },
  { id: "funny", label: "Funny", emoji: "😄", description: "Light-hearted and witty" },
  { id: "empathetic", label: "Empathetic", emoji: "💚", description: "Understanding and caring" },
];

const lengthOptions = [
  { id: "short", label: "Short", description: "1-2 sentences" },
  { id: "balanced", label: "Balanced", description: "2-3 sentences" },
  { id: "detailed", label: "Detailed", description: "Full paragraphs" },
];

const emojiOptions = [
  { id: "off", label: "Off" },
  { id: "minimal", label: "Minimal" },
  { id: "normal", label: "Normal" },
  { id: "frequent", label: "Frequent" },
];

const conversationRules = [
  { id: "transfer", label: "Transfer to human", description: "When customer requests a person" },
  { id: "booking", label: "Allow booking", description: "Create new appointments" },
  { id: "cancellation", label: "Allow cancellations", description: "Cancel existing bookings" },
  { id: "pricing", label: "Answer pricing questions", description: "Share service prices" },
  { id: "collect_name", label: "Collect customer name", description: "Ask for name if missing" },
  { id: "collect_phone", label: "Collect phone number", description: "Ask for phone if missing" },
  { id: "collect_email", label: "Collect email", description: "Ask for email if missing" },
  { id: "recommend", label: "Recommend services", description: "Suggest relevant services" },
  { id: "upsell", label: "Upsell premium services", description: "Mention upgrades when relevant" },
  { id: "order_tracking", label: "Allow order tracking", description: "Check order status" },
];

const examplePrompts = [
  "Book an appointment",
  "What are your prices?",
  "Are you open tomorrow?",
  "I want a refund.",
];

/* ── Input Component ── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-muted-foreground/60 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={cn(
        "h-[42px] w-full rounded-[10px] border border-border/40 bg-muted/30 px-3.5 text-[13px]",
        "text-foreground placeholder:text-muted-foreground/40",
        "transition-all duration-150",
        "focus:outline-none focus:border-accent/40 focus:bg-muted/50 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.06)]",
      )}
    />
  );
}

function TextArea({ defaultValue, rows = 4, placeholder }: { defaultValue?: string; rows?: number; placeholder?: string }) {
  return (
    <textarea
      defaultValue={defaultValue}
      rows={rows}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-[10px] border border-border/40 bg-muted/30 px-3.5 py-3 text-[13px]",
        "text-foreground placeholder:text-muted-foreground/40 resize-none",
        "transition-all duration-150",
        "focus:outline-none focus:border-accent/40 focus:bg-muted/50 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.06)]",
      )}
    />
  );
}

/* ── Section Header ── */

function SectionHeader({ icon: Icon, title, description }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent/[0.08]">
        <Icon size={18} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        <p className="text-[12px] text-muted-foreground/45">{description}</p>
      </div>
    </div>
  );
}

/* ── Option Selector ── */

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: { id: T; label: string; description?: string; emoji?: string }[];
  value: T;
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <div className={cn("grid gap-2.5", columns === 3 && "grid-cols-3", columns === 4 && "grid-cols-4", columns === 7 && "grid-cols-4 lg:grid-cols-7")}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-[12px] border p-3 text-center transition-all duration-150",
            value === opt.id
              ? "border-accent bg-accent/[0.06] shadow-[0_0_0_1px_rgba(34,197,94,0.15)]"
              : "border-border/40 hover:border-border/60 hover:bg-hover-bg/50",
          )}
        >
          {opt.emoji && <span className="text-[18px] mb-0.5">{opt.emoji}</span>}
          <span className={cn("text-[12px] font-semibold", value === opt.id ? "text-accent" : "text-foreground")}>{opt.label}</span>
          {opt.description && <span className="text-[10px] text-muted-foreground/40 leading-tight">{opt.description}</span>}
        </button>
      ))}
    </div>
  );
}

/* ── Page ── */

export default function AgentPage() {
  // Agent Identity
  const [agentName, setAgentName] = useState("Bloom Assistant");
  const [agentRole, setAgentRole] = useState("Receptionist");

  // AI Personality
  const [tone, setTone] = useState("friendly");
  const [length, setLength] = useState("balanced");
  const [emoji, setEmoji] = useState("normal");
  const [creativity, setCreativity] = useState(50);

  // Conversation Rules
  const [rules, setRules] = useState<Record<string, boolean>>({
    transfer: true,
    booking: true,
    cancellation: false,
    pricing: true,
    collect_name: true,
    collect_phone: true,
    collect_email: false,
    recommend: true,
    upsell: false,
    order_tracking: false,
  });

  // Advanced
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Test Chat
  const [testMessages, setTestMessages] = useState<{ from: "customer" | "agent"; text: string }[]>([
    { from: "customer", text: "Hi, do you have appointments available this Saturday?" },
    { from: "agent", text: "Hello! Yes, we have openings this Saturday at 10 AM, 2 PM, and 4 PM. Which time works best for you?" },
  ]);
  const [testInput, setTestInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Save
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [testMessages]);

  const handleSend = () => {
    if (!testInput.trim()) return;
    setTestMessages((prev) => [...prev, { from: "customer", text: testInput }]);
    setTestInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setTestMessages((prev) => [
        ...prev,
        { from: "agent", text: "Thanks for your message! I'm checking availability and will get back to you right away." },
      ]);
    }, 1200);
  };

  const handleReset = () => {
    setTestMessages([
      { from: "customer", text: "Hi, do you have appointments available this Saturday?" },
      { from: "agent", text: "Hello! Yes, we have openings this Saturday at 10 AM, 2 PM, and 4 PM. Which time works best for you?" },
    ]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  const toggleRule = (id: string) => {
    setRules((prev) => ({ ...prev, [id]: !prev[id] }));
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
              Train your AI receptionist to handle conversations the way you want.
            </p>
          </div>
        </motion.div>

        {/* ── 2-COLUMN: CONFIG + TEST ── */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">

          {/* ── LEFT: CONFIGURATION ── */}
          <div className="space-y-6">

            {/* ── SECTION 1: AGENT IDENTITY ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className={cn(CARD, "p-6")}
            >
              <SectionHeader icon={Bot} title="Agent Identity" description="Define who your AI is" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Agent Name">
                  <TextInput defaultValue="Bloom Assistant" />
                </Field>
                <Field label="Role">
                  <div className="relative">
                    <select
                      defaultValue="receptionist"
                      className={cn(
                        "h-[42px] w-full appearance-none rounded-[10px] border border-border/40 bg-muted/30 px-3.5 pr-10 text-[13px]",
                        "text-foreground transition-all duration-150",
                        "focus:outline-none focus:border-accent/40 focus:bg-muted/50",
                      )}
                    >
                      <option value="receptionist">Receptionist</option>
                      <option value="sales">Sales Assistant</option>
                      <option value="support">Customer Support</option>
                      <option value="booking">Booking Assistant</option>
                    </select>
                    <ChevronDown size={14} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
                  </div>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Short Description">
                  <TextArea
                    rows={2}
                    defaultValue="You are the virtual receptionist for Bloom Studio. You help customers book appointments, answer questions about services, and provide a warm, professional experience."
                    placeholder="Describe what your AI does..."
                  />
                </Field>
              </div>
            </motion.div>

            {/* ── SECTION 2: BUSINESS PROFILE ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className={cn(CARD, "p-6")}
            >
              <SectionHeader icon={Building2} title="Business Profile" description="Everything the AI needs to understand your business" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Business Name">
                  <TextInput defaultValue="Bloom Studio" />
                </Field>
                <Field label="Business Category">
                  <TextInput defaultValue="Hair Salon" />
                </Field>
                <Field label="Business Address">
                  <TextInput defaultValue="Dubai Marina, Dubai, UAE" />
                </Field>
                <Field label="Phone Number">
                  <TextInput defaultValue="+971 50 123 4567" />
                </Field>
                <Field label="Website">
                  <TextInput defaultValue="https://bloomstudio.com" placeholder="https://..." />
                </Field>
                <Field label="Timezone">
                  <TextInput defaultValue="GMT+4 (Dubai)" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Business Description">
                  <TextArea
                    rows={2}
                    defaultValue="Premium hair salon specializing in balayage, coloring, and styling. Located in Dubai Marina."
                    placeholder="Describe your business..."
                  />
                </Field>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Business Hours">
                  <TextInput defaultValue="Mon-Sat: 9:00 AM - 8:00 PM" />
                </Field>
                <Field label="Supported Languages">
                  <TextInput defaultValue="English, Arabic" />
                </Field>
              </div>
            </motion.div>

            {/* ── SECTION 3: AI PERSONALITY ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className={cn(CARD, "p-6")}
            >
              <SectionHeader icon={Sparkles} title="AI Personality" description="Teach the AI how to behave" />

              <div className="space-y-6">
                {/* Tone */}
                <div>
                  <label className="text-[12px] font-medium text-muted-foreground/60 mb-2.5 block">Tone</label>
                  <OptionGrid options={toneOptions} value={tone} onChange={setTone} columns={7} />
                </div>

                {/* Response Length */}
                <div>
                  <label className="text-[12px] font-medium text-muted-foreground/60 mb-2.5 block">Response Length</label>
                  <OptionGrid options={lengthOptions} value={length} onChange={setLength} columns={3} />
                </div>

                {/* Emoji Usage */}
                <div>
                  <label className="text-[12px] font-medium text-muted-foreground/60 mb-2.5 block">Emoji Usage</label>
                  <OptionGrid options={emojiOptions} value={emoji} onChange={setEmoji} columns={4} />
                </div>

                {/* Creativity Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-[12px] font-medium text-muted-foreground/60">Creativity</label>
                    <span className="text-[11px] text-muted-foreground/40 tabular-nums">{creativity}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={creativity}
                      onChange={(e) => setCreativity(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full bg-muted/50 appearance-none cursor-pointer accent-accent"
                    />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground/35">Conservative</span>
                      <span className="text-[10px] text-muted-foreground/35">Creative</span>
                    </div>
                  </div>
                </div>

                {/* Greeting & Closing */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Greeting Style">
                    <TextArea
                      rows={2}
                      defaultValue="Welcome to Bloom Studio! How can I help you today?"
                      placeholder="Your greeting message..."
                    />
                  </Field>
                  <Field label="Closing Style">
                    <TextArea
                      rows={2}
                      defaultValue="Thank you for choosing Bloom Studio. Have a wonderful day!"
                      placeholder="Your closing message..."
                    />
                  </Field>
                </div>
              </div>
            </motion.div>

            {/* ── SECTION 4: BUSINESS INSTRUCTIONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className={cn(CARD, "p-6")}
            >
              <SectionHeader icon={FileText} title="Business Instructions" description="The main system prompt that guides your AI" />
              <TextArea
                rows={8}
                defaultValue={`Always answer as a receptionist for Bloom Studio.

Never make up pricing — only use prices from the knowledge base.
Never promise unavailable appointments.
Always recommend premium services first.
Never discuss competitors.
Ask follow-up questions when information is missing.

If a customer asks for something you cannot handle, transfer to a human agent immediately.`}
                placeholder="Write instructions for your AI..."
              />
              <p className="mt-2 text-[11px] text-muted-foreground/40">
                These instructions override all other settings. Be specific about what the AI should and should not do.
              </p>
            </motion.div>

            {/* ── SECTION 5: CONVERSATION RULES ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.25 }}
              className={cn(CARD, "p-6")}
            >
              <SectionHeader icon={MessageSquare} title="Conversation Rules" description="Simple toggles for what the AI can do" />
              <div className="divide-y divide-border/20">
                {conversationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{rule.label}</p>
                      <p className="text-[11px] text-muted-foreground/45 mt-0.5">{rule.description}</p>
                    </div>
                    <Switch
                      checked={rules[rule.id] ?? false}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── SECTION 6: KNOWLEDGE SOURCES ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.3 }}
              className={cn(CARD, "p-6")}
            >
              <SectionHeader icon={BookOpen} title="Knowledge Sources" description="Connected knowledge base for your AI" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-accent/[0.08]">
                    <BookOpen size={20} strokeWidth={1.5} className="text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-foreground">Knowledge Base</h3>
                      <span className="h-2 w-2 rounded-full bg-success" />
                    </div>
                    <p className="text-[12px] text-muted-foreground/50 mt-0.5">12 documents connected · Last synced 2h ago</p>
                  </div>
                </div>
                <a
                  href="/knowledge"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-[12px] font-semibold",
                    "bg-accent text-white transition-all duration-150",
                    "hover:bg-accent-hover",
                  )}
                >
                  Manage Knowledge
                  <ArrowRight size={12} strokeWidth={2} />
                </a>
              </div>
            </motion.div>

            {/* ── SECTION 8: ADVANCED PROMPT ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.35 }}
              className={cn(CARD, "overflow-hidden")}
            >
              <button
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex w-full items-center justify-between px-6 py-4 transition-colors duration-150 hover:bg-hover-bg/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-muted/50">
                    <FileText size={18} strokeWidth={1.5} className="text-muted-foreground/40" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-[13px] font-semibold text-foreground">Advanced System Prompt</h3>
                    <p className="text-[11px] text-muted-foreground/45">For power users — full prompt editor</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: advancedOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} strokeWidth={1.5} className="text-muted-foreground/30" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {advancedOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6">
                      <TextArea
                        rows={12}
                        defaultValue={`You are a professional AI receptionist for Bloom Studio, a premium hair salon in Dubai Marina.

## Core Behavior
- Always greet customers warmly
- Never make up pricing information
- Never promise unavailable time slots
- Always verify customer details before booking

## Booking Rules
- Check availability before confirming
- Collect: name, phone, preferred time, service
- Send confirmation after booking
- Offer alternative times if preferred slot is unavailable

## Escalation
- Transfer to human for: refund requests, complaints, complex scheduling
- Transfer if confidence is low on any answer

## Tone
- Professional but warm
- Use customer's name when known
- Keep responses under 3 sentences unless detailing services`}
                        placeholder="Write your full system prompt..."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── RIGHT: CONVERSATION TESTER ── */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className={cn(CARD, "overflow-hidden flex flex-col")}
              style={{ height: "calc(100vh - 120px)", maxHeight: "680px" }}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/25 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <Bot size={15} strokeWidth={1.8} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-foreground">Test Conversation</h3>
                    <p className="text-[10px] text-muted-foreground/40">Try messages to see how your AI responds</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="flex h-7 w-7 items-center justify-center rounded-[8px] text-muted-foreground/40 transition-all duration-150 hover:bg-hover-bg hover:text-foreground"
                >
                  <RotateCcw size={13} strokeWidth={1.5} />
                </button>
              </div>

              {/* Chat Messages */}
              <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-premium">
                {testMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn("flex", msg.from === "customer" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-[16px] px-3.5 py-2.5 text-[13px] leading-relaxed",
                      msg.from === "customer"
                        ? "bg-accent text-white rounded-br-[6px]"
                        : "bg-muted text-foreground rounded-bl-[6px]",
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-[16px] rounded-bl-[4px] bg-muted px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "200ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "400ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Example Prompts */}
              {testMessages.length <= 2 && (
                <div className="px-4 pb-2 shrink-0">
                  <p className="text-[10px] text-muted-foreground/35 mb-1.5">Try asking:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {examplePrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => {
                          setTestMessages((prev) => [...prev, { from: "customer", text: prompt }]);
                          setIsTyping(true);
                          setTimeout(() => {
                            setIsTyping(false);
                            setTestMessages((prev) => [
                              ...prev,
                              { from: "agent", text: "Let me check that for you right away!" },
                            ]);
                          }, 1200);
                        }}
                        className="rounded-full border border-border/30 bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground/60 transition-all duration-150 hover:bg-hover-bg hover:text-foreground hover:border-border/50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="px-4 py-3 border-t border-border/25 shrink-0">
                <div className="flex items-end gap-2">
                  <div className="relative flex-1">
                    <textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a test message..."
                      rows={1}
                      className={cn(
                        "w-full resize-none rounded-[12px] border border-border/30 bg-muted/30 px-3.5 py-2.5 pr-12 text-[13px]",
                        "text-foreground placeholder:text-muted-foreground/35",
                        "transition-all duration-200",
                        "focus:outline-none focus:border-accent/30 focus:bg-muted/50 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.06)]",
                        "max-h-24",
                      )}
                      style={{ minHeight: "40px" }}
                    />
                    <button
                      onClick={handleSend}
                      className={cn(
                        "absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-[8px] transition-all duration-200",
                        testInput.trim()
                          ? "bg-accent text-white shadow-[0_2px_8px_rgba(34,197,94,0.3)]"
                          : "bg-muted text-muted-foreground/30",
                      )}
                    >
                      <Send size={12} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── STICKY FOOTER ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-card/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-8 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-[12px] text-muted-foreground/60">Unsaved changes</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-medium",
                "border border-border/50 bg-card text-foreground/70",
                "transition-all duration-150 hover:bg-hover-bg hover:text-foreground hover:border-border/80",
              )}
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-semibold",
                "bg-accent text-white transition-all duration-150",
                "hover:bg-accent-hover",
              )}
            >
              {saved ? <Check size={14} strokeWidth={2} /> : null}
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
