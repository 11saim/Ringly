"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { highlights, howItWorks, features, integrations, testimonials } from "@/lib/mock";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Check, Play, ShieldCheck, Lock, Sparkles, MessageSquare, Calendar, BarChart3, Zap, Phone, Mic, Volume2 } from "lucide-react";

export default function Index() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Highlights />
      <HowItWorks />
      <FeatureGrid />
      <Integrations />
      <ExplorePlatform />
      <Testimonials />
      <SecurityBand />
      <BigCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-16 text-center">
        <h1 className="mt-4 sm:mt-6 text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
          AI agents that sell and book<br className="hidden md:inline" /> for your business.
        </h1>
        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground">
          Ringly answers WhatsApp and phone calls in your voice, quotes prices, and closes bookings — 24/7, in minutes to set up, no code required.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup"><Button size="lg" className="h-12 px-6 text-sm sm:text-base bg-primary hover:bg-primary/90 w-full sm:w-auto">Build your agent free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          <Link href="/contact"><Button size="lg" variant="ghost" className="h-12 px-6 text-sm sm:text-base w-full sm:w-auto">Book a demo</Button></Link>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">Free forever plan · No credit card required</div>
      </div>
      <HeroDemo />
    </section>
  );
}

const CHAT_MESSAGES = [
  { side: "in" as const, text: "Hi! Do you have space for 2 people this Saturday around 3pm? For a haircut + blowout?", delay: 800 },
  { side: "out" as const, text: "Hey Sofia — yes, Saturday at 3:30 PM works with Ana. That's $30 for the cut and blowout together. Should I lock it in?", delay: 1800 },
  { side: "in" as const, text: "Yes please 🙌", delay: 1200 },
  { side: "out" as const, text: "Booked — see you Saturday 3:30 PM. I'll send a reminder Friday morning ✨", delay: 1600 },
];

const VOICE_TRANSCRIPT_LINES = [
  { speaker: "caller", text: "Hi, I'd like to book a haircut for tomorrow afternoon?" },
  { speaker: "agent", text: "Sure! We have 2:00 PM and 3:30 PM open with Luis. Which works better?" },
  { speaker: "caller", text: "3:30 PM please!" },
  { speaker: "agent", text: "Locked in — tomorrow at 3:30 PM with Luis. You'll get a confirmation text shortly." },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

function AnimatedChat() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount >= CHAT_MESSAGES.length) return;
    const msg = CHAT_MESSAGES[visibleCount];
    const isReply = msg.side === "out";
    const showDelay = isReply ? msg.delay : msg.delay;

    const timer = setTimeout(() => {
      if (isReply) {
        setTyping(true);
        const typeTimer = setTimeout(() => {
          setTyping(false);
          setVisibleCount((c) => c + 1);
        }, 1200);
        return () => clearTimeout(typeTimer);
      } else {
        setVisibleCount((c) => c + 1);
      }
    }, showDelay);

    return () => clearTimeout(timer);
  }, [visibleCount]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [visibleCount, typing]);

  const handleRestart = () => {
    setVisibleCount(0);
    setTyping(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2.5 sm:space-y-3 text-sm scroll-smooth">
        {CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
          <div key={i} className="animate-slide-in">
            <Bubble side={msg.side}>{msg.text}</Bubble>
          </div>
        ))}
        {typing && (
          <div className="animate-fade-in">
            <div className="max-w-[85%] rounded-2xl bg-white border border-border">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>
      {visibleCount >= CHAT_MESSAGES.length && !typing && (
        <button onClick={handleRestart} className="mt-3 text-[10px] text-muted-foreground hover:text-foreground transition-colors self-start">
          ↻ Replay
        </button>
      )}
    </div>
  );
}

function VoiceWaveform() {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-full bg-primary/60 animate-wave-bar"
          style={{
            height: "40%",
            animationDelay: `${i * 0.08}s`,
            animationDuration: `${0.8 + (i % 3) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function VoiceTranscription() {
  const [transcriptIndex, setTranscriptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptIndex >= VOICE_TRANSCRIPT_LINES.length) {
      const restartTimer = setTimeout(() => {
        setTranscriptIndex(0);
        setCharIndex(0);
      }, 4000);
      return () => clearTimeout(restartTimer);
    }

    const line = VOICE_TRANSCRIPT_LINES[transcriptIndex];
    if (charIndex < line.text.length) {
      const timer = setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, 25 + Math.random() * 20);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setTranscriptIndex((i) => i + 1);
        setCharIndex(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [transcriptIndex, charIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [transcriptIndex, charIndex]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2.5">
      {VOICE_TRANSCRIPT_LINES.slice(0, transcriptIndex + 1).map((line, i) => {
        const isAgent = line.speaker === "agent";
        const displayText = i === transcriptIndex ? line.text.slice(0, charIndex) : line.text;
        const isTyping = i === transcriptIndex && charIndex < line.text.length;
        return (
          <div key={i} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed ${isAgent ? "bg-primary/10 text-foreground" : "bg-[color:var(--surface-2)] text-foreground"}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-semibold text-[10px]">{isAgent ? "Agent" : "Caller"}</span>
                {isAgent && <Volume2 className="h-2.5 w-2.5 text-primary" />}
                {!isAgent && <Mic className="h-2.5 w-2.5 text-muted-foreground" />}
              </div>
              <span>{displayText}</span>
              {isTyping && <span className="inline-block w-[2px] h-3 bg-primary ml-0.5 animate-pulse" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HeroDemo() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-12 sm:pb-16 md:pb-24">
      <div className="relative rounded-2xl border border-border bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-border bg-[color:var(--surface-2)] px-3 sm:px-4 py-2 sm:py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-muted-foreground hidden sm:inline">ringly.app / playground</span>
          <button className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"><Play size={12} className="ml-0.5" /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-0 min-h-[300px] sm:min-h-[360px] md:min-h-[420px]">
          <div className="p-4 sm:p-6 bg-[#faf7f3] md:border-r border-border">
            <div className="mb-3 sm:mb-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-whatsapp text-white text-[10px]">W</span>
                <span className="hidden sm:inline">WhatsApp · Sofia N.</span>
                <span className="sm:hidden">Sofia N.</span>
              </div>
              <span className="text-[10px] text-success font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            </div>
            <AnimatedChat />
          </div>
          <div className="hidden md:flex flex-col p-6 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-voice text-white">
                  <Phone className="h-3 w-3" />
                </span>
                Voice · Marcus T.
              </div>
              <span className="text-[10px] text-success font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            </div>
            <div className="mb-4 rounded-lg border border-border bg-[color:var(--surface-2)] p-3">
              <VoiceWaveform />
              <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                <span className="font-mono">00:47</span>
                <span>·</span>
                <span>gpt-4o-realtime</span>
                <span>·</span>
                <span>Latency 320ms</span>
              </div>
            </div>
            <div className="flex-1 rounded-lg border border-border bg-[color:var(--surface-2)] p-3 overflow-hidden">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Live transcription</div>
              <VoiceTranscription />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ side, children }: { side: "in" | "out"; children: React.ReactNode }) {
  return (
    <div className={`max-w-[85%] rounded-2xl px-3 py-2 leading-snug ${side === "in" ? "bg-white border border-border" : "ml-auto bg-[#dcf8c6]"}`}>
      {children}
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="bg-[color:var(--surface-2)] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-6">Trusted by 500+ businesses</div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-12 sm:gap-y-4 opacity-60 text-sm sm:text-base md:text-lg font-bold tracking-tight">
          {["Bloom", "Bistro Nord", "Verdant", "Casa Loma", "Nova Salon", "Ochre", "Vela & Co"].map((l) => (
            <div key={l} className="grayscale">{l}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const icons = [Sparkles, Zap, ShieldCheck];
  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {highlights.map((h, i) => {
          const I = icons[i];
          return (
            <div key={h.title} className="animate-fade-up">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-primary"><I size={20} /></div>
              <h3 className="text-base sm:text-lg font-semibold">{h.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{h.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = document.querySelectorAll<HTMLDivElement>("[data-step]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number(e.target.getAttribute("data-step")));
      });
    }, { rootMargin: "-40% 0px -40% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const demos = [
    <DemoNumber key="number" />,
    <DemoCatalog key="catalog" />,
    <DemoConversation key="conversation" />,
    <DemoEscalation key="escalation" />,
    <DemoAnalytics key="analytics" />,
  ];
  return (
    <section className="bg-[color:var(--surface-2)] py-14 sm:py-20 md:py-24 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</div>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Live in minutes, running your business by tonight.</h2>
        </div>
        <div className="mt-10 sm:mt-12 md:mt-16 grid md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            {howItWorks.map((s, idx) => (
              <div key={s.n} data-step={idx} className={`py-6 sm:py-8 border-b border-border last:border-0 transition-opacity ${active === idx ? "opacity-100" : "opacity-40"}`}>
                <div className="flex items-baseline gap-3 sm:gap-4">
                  <div className="font-mono text-2xl sm:text-3xl font-bold text-primary">{String(s.n).padStart(2, "0")}</div>
                  <div>
                    <div className="text-lg sm:text-xl font-semibold">{s.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 min-h-[420px] shadow-sm">
              <div className="text-xs font-mono text-muted-foreground mb-3">Step {active + 1} of {howItWorks.length}</div>
              <div className="text-2xl font-semibold">{howItWorks[active].title}</div>
              <div className="mt-6 rounded-lg border border-border bg-[color:var(--surface-2)] p-4 min-h-[280px] animate-fade-up" key={active}>
                {demos[active]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const icons = [Zap, Calendar, Sparkles, MessageSquare, BarChart3];
  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-14 sm:space-y-20 md:space-y-24">
        {features.map((f, i) => {
          const I = icons[i];
          const flip = i % 2 === 1;
          return (
            <div key={f.title} className={`grid md:grid-cols-2 gap-8 sm:gap-12 items-center ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-primary"><I size={20} /></div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{f.title}</h3>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md">{f.body}</p>
                <Button variant="ghost" className="mt-4 px-0 hover:bg-transparent hover:text-primary">Learn more <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </div>
              <FeatureDemo title={f.title} index={i} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Integrations() {
  return (
    <section className="bg-[color:var(--surface-2)] py-10 sm:py-12 md:py-16 border-y border-border overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-6 sm:mb-8 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Works with what you already use</div>
      </div>
      <div className="relative">
        <div className="flex gap-2.5 sm:gap-3 animate-marquee w-max">
          {[...integrations, ...integrations].map((name, i) => (
            <div key={i} className="whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExplorePlatform() {
  const tabs = [
    { id: "playground", label: "Playground" },
    { id: "analytics", label: "Analytics" },
    { id: "inbox", label: "Inbox" },
    { id: "catalog", label: "Catalog" },
    { id: "actions", label: "Actions" },
  ];
  const [active, setActive] = useState(tabs[0].id);
  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl mb-8 sm:mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Explore the platform</div>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Everything an owner needs, nothing they don&apos;t.</h2>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)} className={`rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${active === t.id ? "bg-foreground text-background" : "bg-[color:var(--surface-2)] text-foreground hover:bg-border"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-[color:var(--surface-2)] p-4 sm:p-6 min-h-[320px] sm:min-h-[380px] md:min-h-[440px]">
          <PlatformPreview active={active} label={tabs.find(t => t.id === active)?.label || "Preview"} />
        </div>
      </div>
    </section>
  );
}

function DemoNumber() {
  return <div className="space-y-3"><div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-whatsapp text-primary-foreground">W</span><div><div className="font-semibold">Main WhatsApp connected</div><div className="text-xs text-muted-foreground">Verification AL-4821 accepted</div></div></div><div className="rounded-lg bg-card p-3 text-xs font-mono text-muted-foreground">webhook: live · routing: agent_first · fallback: owner</div></div>;
}

function DemoCatalog() {
  return <div className="space-y-2">{[["Balayage", "$45", "120m"], ["Blowout", "$12", "30m"], ["Bridal package", "$85", "180m"]].map((row) => <div key={row[0]} className="grid grid-cols-3 rounded-lg border border-border bg-card p-3 text-sm"><span className="font-semibold">{row[0]}</span><span className="font-mono text-right">{row[1]}</span><span className="font-mono text-right text-muted-foreground">{row[2]}</span></div>)}</div>;
}

function DemoConversation() {
  return <div className="space-y-3 text-sm"><Bubble side="in">Can two people come Saturday after 3?</Bubble><Bubble side="out">Yes — Ana has 3:30 open. I can hold it for both of you.</Bubble><div className="rounded-lg border border-primary/20 bg-accent-soft p-3 text-xs text-primary">Action queued: book_appointment · confidence 94%</div></div>;
}

function DemoEscalation() {
  return <div className="space-y-3"><div className="rounded-lg border border-warning/30 bg-warning/10 p-3"><div className="text-sm font-semibold text-warning">Human review needed</div><div className="text-xs text-muted-foreground">Refund request over policy threshold</div></div><div className="rounded-lg border border-border bg-card p-3 text-xs">Summary sent with customer history, order ID, and suggested response.</div></div>;
}

function DemoAnalytics() {
  return <div className="space-y-3"><div className="grid grid-cols-3 gap-2">{[["Closed", "82%"], ["Revenue", "$4.8k"], ["Saved", "31h"]].map(([a, b]) => <div key={a} className="rounded-lg bg-card p-3"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">{a}</div><div className="font-mono font-bold">{b}</div></div>)}</div><div className="flex h-24 items-end gap-2 rounded-lg bg-card p-3">{[30, 45, 62, 50, 78, 88, 70].map((h, i) => <div key={i} className="flex-1 rounded-t bg-primary" style={{ height: `${h}%` }} />)}</div></div>;
}

function FeatureDemo({ title, index }: { title: string; index: number }) {
  const rows = [
    ["Calendar", "Ana free 15:30", "live"],
    ["Inventory", "3 color kits", "synced"],
    ["Stripe", "deposit ready", "armed"],
  ];
  return <div className="rounded-xl border border-border bg-[color:var(--surface-2)] p-4 sm:p-6 min-h-[200px] sm:min-h-[260px] text-sm"><div className="rounded-lg bg-white border border-border p-3 sm:p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-mono text-muted-foreground">{title}</span><span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">LIVE</span></div>{index === 0 ? rows.map(([a, b, c]) => <div key={a} className="mb-2 grid grid-cols-[80px_1fr_auto] sm:grid-cols-[90px_1fr_auto] gap-1.5 sm:gap-2 rounded bg-[color:var(--surface-2)] p-2 text-xs last:mb-0"><span>{a}</span><span className="font-medium">{b}</span><span className="text-muted-foreground">{c}</span></div>) : index === 1 ? <div className="grid grid-cols-4 gap-1.5 sm:gap-2">{["09", "10", "11", "12", "13", "14", "15", "16"].map((h, n) => <div key={h} className={`rounded p-1.5 sm:p-2 text-center text-[10px] sm:text-xs ${n === 6 ? "bg-accent-soft text-primary" : "bg-[color:var(--surface-2)]"}`}>{h}:00</div>)}</div> : <div className="space-y-2">{["Model A answered in 1.2s", "Escalation rule matched", "Action safely completed"].map((x) => <div key={x} className="rounded bg-[color:var(--surface-2)] p-2 text-xs">{x}</div>)}</div>}</div></div>;
}

function PlatformPreview({ active, label }: { active: string; label: string }) {
  return <div className="rounded-xl bg-white border border-border min-h-[260px] sm:min-h-[320px] md:min-h-[380px] p-4 sm:p-6 shadow-sm"><div className="text-xs font-mono text-muted-foreground mb-3">{label} — live preview</div><div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"><div className="sm:col-span-2 rounded-lg border border-border bg-[color:var(--surface-2)] p-3 sm:p-4"><div className="mb-3 sm:mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" /><span className="text-xs sm:text-sm font-semibold">{active === "analytics" ? "Revenue influenced" : active === "inbox" ? "Customer thread" : active === "catalog" ? "Service catalog" : active === "actions" ? "Automation timeline" : "Agent playground"}</span></div>{active === "analytics" ? <DemoAnalytics /> : active === "catalog" ? <DemoCatalog /> : active === "actions" ? <DemoEscalation /> : <DemoConversation />}</div><div className="space-y-2 sm:space-y-3">{["Confidence 94%", "Tool call ready", "Owner notified"].map((x) => <div key={x} className="rounded-lg bg-[color:var(--surface-2)] p-3 sm:p-4 text-xs font-semibold">{x}</div>)}</div></div></div>;
}

function Testimonials() {
  return (
    <section className="bg-[color:var(--surface-2)] py-14 sm:py-20 md:py-24 border-y border-border overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl">Owners are getting hours back.</h2>
      </div>
      <div className="relative">
        <div className="flex gap-3 sm:gap-4 animate-marquee w-max">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="w-[280px] sm:w-[340px] md:w-[380px] rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-sm">
              <div className="text-xs font-semibold text-muted-foreground">{t.company}</div>
              <p className="mt-3 text-base sm:text-lg leading-snug">&quot;{t.quote}&quot;</p>
              <div className="mt-4 sm:mt-6 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityBand() {
  const items = [
    { icon: Lock, title: "Encrypted end-to-end", body: "TLS in flight, AES-256 at rest." },
    { icon: ShieldCheck, title: "Not used to train models", body: "Your conversations stay yours. Always." },
    { icon: Check, title: "Secure integrations", body: "SOC 2 Type II · GDPR · scoped OAuth per tool." },
  ];
  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border border-border bg-white p-4 sm:p-5 md:p-6">
            <it.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <div className="mt-3 text-sm sm:text-base font-semibold">{it.title}</div>
            <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{it.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BigCTA() {
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0b] text-[#f2f2f3] mx-auto max-w-6xl">
        <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 h-48 w-48 sm:h-64 sm:w-64 md:h-96 md:w-96 rounded-full bg-primary opacity-40 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 h-48 w-48 sm:h-64 sm:w-64 md:h-96 md:w-96 rounded-full bg-[#8b5cf6] opacity-40 blur-3xl" />
        <div className="relative px-5 sm:px-8 py-14 sm:py-20 md:py-24 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.1]">The next message your agent answers could be a booking.</h2>
          <div className="mt-6 sm:mt-8">
            <Link href="/signup"><Button size="lg" className="h-12 px-6 text-sm sm:text-base bg-white text-black hover:bg-white/90 w-full sm:w-auto">Build your agent free</Button></Link>
          </div>
          <div className="mt-3 text-xs text-white/60">No credit card required</div>
        </div>
      </div>
    </section>
  );
}
