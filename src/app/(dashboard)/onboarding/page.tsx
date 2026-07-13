"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Bot, CalendarCheck, Check, FileText, MessageSquare, Phone, Send, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  { id: "business", title: "Business profile", prompt: "What business should Compass represent?", placeholder: "Bloom Studio · hair salon in Barcelona" },
  { id: "catalog", title: "Catalog", prompt: "Paste a few services, products, or prices.", placeholder: "Haircut $18, balayage $45, blowout $12" },
  { id: "policy", title: "Rules", prompt: "What can the agent do automatically?", placeholder: "Book directly under $100. Escalate refunds and complaints." },
  { id: "number", title: "Launch channel", prompt: "Which number or channel should it answer?", placeholder: "+34 611 22 33 44" },
] as const;

function parseCatalog(text: string) {
  const matches = [...text.matchAll(/([A-Za-z][A-Za-z\s&'-]{1,34})\s*\$?(\d{1,4})/g)];
  return matches.slice(0, 5).map((m) => ({ name: m[1].trim().replace(/,$/, ""), price: Number(m[2]) }));
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const current = steps[step];
  const catalog = useMemo(() => parseCatalog(answers.catalog || ""), [answers.catalog]);
  const progress = Math.round((Object.keys(answers).length / steps.length) * 100);

  const submit = () => {
    if (!input.trim()) return;
    setAnswers((prev) => ({ ...prev, [current.id]: input.trim() }));
    setInput("");
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const done = Object.keys(answers).length === steps.length;

  return (
    <div className="min-h-screen bg-[color:var(--surface-2)]">
      <header className="flex items-center gap-4 border-b border-border bg-background px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground font-mono text-xs">⌘</span>Ringly</Link>
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className="font-mono text-xs text-muted-foreground">{progress}%</span>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[320px_1fr_420px]">
        <aside className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Setup path</div>
          {steps.map((item, i) => {
            const complete = Boolean(answers[item.id]);
            return (
              <button type="button" key={item.id} onClick={() => setStep(i)} className={`mb-2 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${step === i ? "border-primary bg-accent-soft text-primary" : "border-border hover:bg-muted"}`}>
                <span className={`grid h-8 w-8 place-items-center rounded-lg ${complete ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{complete ? <Check className="h-4 w-4" /> : i + 1}</span>
                <div><div className="text-sm font-semibold">{item.title}</div><div className="text-xs text-muted-foreground">{complete ? "Captured" : "Waiting"}</div></div>
              </button>
            );
          })}
        </aside>

        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <Badge className="bg-accent-soft text-primary hover:bg-accent-soft"><Bot className="mr-1 h-3.5 w-3.5" /> Compass builder</Badge>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight">Build your first agent from one guided console.</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Each answer updates the launch preview instantly, so the setup never feels empty.</p>

          <div className="mt-8 rounded-2xl border border-border bg-[color:var(--surface-2)] p-5">
            <div className="flex gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span><div><div className="font-semibold">{done ? "You&apos;re ready to launch" : current.prompt}</div><div className="mt-1 text-sm text-muted-foreground">{done ? "Review the right panel, then open the dashboard." : "Answer in natural language — the agent extracts structure for you."}</div></div></div>
            {!done ? (
              <div className="mt-5 flex gap-2">
                {current.id === "policy" ? <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={current.placeholder} rows={3} /> : <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder={current.placeholder} />}
                <Button type="button" onClick={submit} disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
              </div>
            ) : (
              <Button className="mt-5" size="lg" onClick={() => router.push("/dashboard")}>Launch dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
            )}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <Signal icon={<MessageSquare />} title="Replies" body="Tone trained" />
            <Signal icon={<FileText />} title="Catalog" body={`${catalog.length || 0} parsed`} />
            <Signal icon={<CalendarCheck />} title="Bookings" body="Rules set" />
            <Signal icon={<Phone />} title="Channel" body={answers.number ? "Connected" : "Pending"} />
          </div>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live launch preview</div>
          <div className="rounded-xl border border-border p-4"><div className="text-xs text-muted-foreground">Business</div><div className="mt-1 font-bold">{answers.business || "Waiting for profile"}</div></div>
          <div className="mt-3 rounded-xl border border-border p-4"><div className="mb-3 flex items-center justify-between"><span className="text-xs text-muted-foreground">Catalog</span><Badge variant="secondary">{catalog.length}</Badge></div>{catalog.length ? catalog.map((item) => <div key={item.name} className="mb-2 flex justify-between text-sm last:mb-0"><span>{item.name}</span><span className="font-mono">${item.price}</span></div>) : <div className="text-sm text-muted-foreground">Paste prices to populate this card.</div>}</div>
          <div className="mt-3 rounded-xl border border-border p-4"><div className="text-xs text-muted-foreground">Automation rules</div><div className="mt-2 text-sm">{answers.policy || "No rules yet."}</div></div>
          <div className="mt-3 rounded-xl border border-border bg-accent-soft p-4 text-primary"><div className="flex items-center gap-2 font-semibold"><Zap className="h-4 w-4" /> Next action</div><div className="mt-1 text-sm text-foreground/80">{done ? "Open dashboard and test the live agent." : "Continue setup to unlock launch."}</div></div>
        </aside>
      </main>
    </div>
  );
}

function Signal({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return <div className="rounded-xl border border-border bg-background p-4"><span className="text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div className="mt-3 text-sm font-semibold">{title}</div><div className="text-xs text-muted-foreground">{body}</div></div>;
}
