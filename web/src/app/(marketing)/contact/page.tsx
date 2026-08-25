"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Clock, Loader2, Mail, MapPin, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", business: "", size: "", channel: "WhatsApp", goal: "", urgency: "This month" });
  const progress = sent ? 100 : Math.round(((step + 1) / 3) * 100);
  const ready = useMemo(() => step === 0 ? form.name && form.email && form.business : step === 1 ? form.size && form.channel : form.goal.length > 8, [step, form]);

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 850);
  };

  return (
    <main className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,var(--accent-soft),transparent)]" />
      <section className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> Demo request</div>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.03] tracking-tight md:text-6xl">Tell us what your agent should do.</h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">No chat widget. Just a focused form, a fast reply, and a working demo built around your real business flow.</p>
          <div className="mt-10 grid gap-3">
            <Info icon={<Clock />} title="Reply window" body="Usually under 20 minutes on business days" />
            <Info icon={<Mail />} title="Email" body="hello@ringly.io" />
            <Info icon={<MapPin />} title="HQ" body="Barcelona · remote-first" />
            <Info icon={<ShieldCheck />} title="Private by default" body="Your submitted details are only used to prepare the demo" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-xl">
          <div className="border-b border-border p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span className="uppercase tracking-widest">Step {sent ? 3 : step + 1} of 3</span><span className="font-mono">{progress}%</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>
          </div>

          {sent ? (
            <div className="p-10 text-center animate-fade-up">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success"><Check className="h-8 w-8" /></div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight">Request received.</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">We&apos;ll reply to <span className="font-mono text-foreground">{form.email}</span> with next steps and a tailored demo plan.</p>
              <Button type="button" variant="outline" className="mt-7" onClick={() => { setSent(false); setStep(0); }}>Send another request</Button>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              {step === 0 && (
                <div className="space-y-4 animate-fade-up">
                  <Field label="Your name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ana Reyes" /></Field>
                  <Field label="Work email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ana@bloom.com" /></Field>
                  <Field label="Business name"><Input value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} placeholder="Bloom Studio" /></Field>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-6 animate-fade-up">
                  <Choice label="Team size" value={form.size} options={["Just me", "2-10", "11-50", "50+"]} onChange={(size) => setForm({ ...form, size })} />
                  <Choice label="Main channel" value={form.channel} options={["WhatsApp", "Voice", "Both", "Website"]} onChange={(channel) => setForm({ ...form, channel })} />
                  <Choice label="Timeline" value={form.urgency} options={["This week", "This month", "This quarter", "Exploring"]} onChange={(urgency) => setForm({ ...form, urgency })} />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4 animate-fade-up">
                  <Field label="What should the agent automate first?"><Textarea rows={7} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} maxLength={600} placeholder="Answer WhatsApp after hours, quote services, collect deposits, and book directly into our calendar…" /></Field>
                  <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm"><div className="font-semibold">Summary</div><div className="mt-1 text-muted-foreground">{form.business || "Business"} · {form.size || "team size"} · {form.channel} · {form.urgency}</div></div>
                </div>
              )}
              <div className="mt-8 flex items-center gap-2">
                {step > 0 && <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>Back</Button>}
                <div className="flex-1" />
                {step < 2 ? <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!ready}>Continue <ArrowRight className="ml-1 h-4 w-4" /></Button> : <Button type="button" onClick={submit} disabled={!ready || loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Send request</Button>}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Info({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return <div className="flex gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-card text-primary shadow-sm [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div><div className="text-sm font-semibold">{title}</div><div className="text-sm text-muted-foreground">{body}</div></div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}

function Choice({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <div><Label className="mb-2 block text-sm">{label}</Label><div className="grid grid-cols-2 gap-2 md:grid-cols-4">{options.map((option) => <button type="button" key={option} onClick={() => onChange(option)} className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${value === option ? "border-primary bg-accent-soft text-primary" : "border-border hover:border-primary/50"}`}>{option}</button>)}</div></div>;
}
