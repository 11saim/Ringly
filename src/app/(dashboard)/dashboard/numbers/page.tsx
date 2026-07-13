"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, PhoneCall, Plus, Radio, Route as RouteIcon, Signal, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { numbers as initialNumbers } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type NumberRow = typeof initialNumbers[number];

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<NumberRow[]>(initialNumbers);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [channel, setChannel] = useState<"whatsapp" | "voice">("whatsapp");
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("");
  const [copied, setCopied] = useState(false);
  const code = "AL-4821";

  const startConnect = () => {
    setStep(0);
    setChannel("whatsapp");
    setPhone("");
    setLabel("");
    setCopied(false);
    setOpen(true);
  };

  const submit = () => {
    if (!phone.trim()) return;
    const next: NumberRow = { id: `n${Date.now()}`, label: label.trim() || (channel === "whatsapp" ? "New WhatsApp" : "New voice line"), value: phone.trim(), channel, active: true, msgs: [9, 14, 18, 16, 24, 28, 31] };
    setNumbers((rows) => [next, ...rows]);
    setOpen(false);
    toast.success(`${next.value} connected`);
  };

  return (
    <AppShell title="Numbers" subtitle={`${numbers.length} connected lines · ${numbers.filter((n) => n.active).length} live`} actions={<Button type="button" size="sm" onClick={startConnect}><Plus className="mr-1 h-3.5 w-3.5" /> Connect number</Button>}>
      <div className="space-y-5">
        <section className="grid gap-3 md:grid-cols-4">
          <Metric icon={<Signal />} label="Delivery" value="99.98%" />
          <Metric icon={<MessageCircle />} label="Messages" value="1,214" />
          <Metric icon={<PhoneCall />} label="Calls" value="86" />
          <Metric icon={<Sparkles />} label="AI handled" value="82%" />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {numbers.map((number) => <NumberCard key={number.id} number={number} onToggle={() => setNumbers((rows) => rows.map((row) => row.id === number.id ? { ...row, active: !row.active } : row))} />)}
          <button type="button" onClick={startConnect} className="min-h-[310px] rounded-2xl border-2 border-dashed border-border bg-card p-6 text-left transition hover:border-primary hover:bg-accent-soft">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground"><Plus className="h-5 w-5" /></div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight">Connect another channel</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">Bring an existing WhatsApp Business number, port a voice line, or create a new number for the agent.</p>
            <div className="mt-6 flex gap-2 text-xs"><span className="rounded-full bg-background px-3 py-1">WhatsApp</span><span className="rounded-full bg-background px-3 py-1">Voice</span><span className="rounded-full bg-background px-3 py-1">Routing</span></div>
          </button>
        </section>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Connect a number</DialogTitle>
            <DialogDescription>Step {step + 1} of 3 · verify ownership, then Ringly starts routing test traffic.</DialogDescription>
          </DialogHeader>
          <div className="mb-2 grid grid-cols-3 gap-2">
            {["Channel", "Details", "Verify"].map((item, index) => <div key={item} className={`h-1.5 rounded-full ${index <= step ? "bg-primary" : "bg-muted"}`} />)}
          </div>
          {step === 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              <ChannelButton active={channel === "whatsapp"} icon={<MessageCircle />} title="WhatsApp Business" body="Use your existing customer chat line" onClick={() => setChannel("whatsapp")} />
              <ChannelButton active={channel === "voice"} icon={<PhoneCall />} title="Voice line" body="Answer missed calls and transcribe summaries" onClick={() => setChannel("voice")} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Phone number"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 611 22 33 44" /></Field>
              <Field label="Internal label"><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Main WhatsApp" /></Field>
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">The agent will only receive test traffic until you finish verification.</div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <div className="text-sm text-muted-foreground">Send this code from <span className="font-mono text-foreground">{phone}</span>:</div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-background p-3">
                  <span className="flex-1 font-mono text-2xl font-bold tracking-[0.25em]">{code}</span>
                  <Button type="button" size="sm" variant="outline" onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success"><Radio className="h-4 w-4 animate-pulse-dot" /> Listening for verification message…</div>
            </div>
          )}
          <DialogFooter>
            {step > 0 && <Button type="button" variant="ghost" onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2)}>Back</Button>}
            <div className="flex-1" />
            {step < 2 ? <Button type="button" onClick={() => setStep((s) => (s + 1) as 0 | 1 | 2)} disabled={step === 1 && !phone.trim()}>Continue</Button> : <Button type="button" onClick={submit}>Finish connection</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function NumberCard({ number, onToggle }: { number: NumberRow; onToggle: () => void }) {
  const total = number.msgs.reduce((sum, value) => sum + value, 0);
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`grid h-12 w-12 place-items-center rounded-xl text-primary-foreground ${number.channel === "whatsapp" ? "bg-whatsapp" : "bg-voice"}`}>{number.channel === "whatsapp" ? <MessageCircle /> : <PhoneCall />}</span>
            <div><h2 className="font-bold">{number.label}</h2><div className="font-mono text-xs text-muted-foreground">{number.value}</div></div>
          </div>
          <Switch checked={number.active} onCheckedChange={onToggle} />
        </div>
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_170px]">
        <div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Mini label="7d volume" value={String(total)} />
            <Mini label="Peak" value={String(Math.max(...number.msgs))} />
            <Mini label="Latency" value="1.8s" />
          </div>
          <div className="mt-5"><div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Message flow</div><BarChart data={number.msgs} /></div>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"><RouteIcon className="h-3.5 w-3.5" /> Routing</div>
          <div className="mt-4 space-y-3 text-sm"><RouteStep title="Inbound" body="Agent first" /><RouteStep title="Fallback" body="Owner + transcript" /><RouteStep title="After hours" body="Auto answer" /></div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border p-4">
        <Button type="button" size="sm" variant="outline" onClick={() => toast.success(`Test ping sent to ${number.label}`)}><Zap className="mr-1 h-3.5 w-3.5" /> Test</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => toast.success("Routing settings opened")}>Configure</Button>
      </div>
    </article>
  );
}

function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return <div className="flex h-24 items-end gap-2 rounded-xl bg-muted/50 p-3">{data.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t-md bg-primary transition-all" style={{ height: `${Math.max(16, (value / max) * 76)}px` }} /><span className="font-mono text-[9px] text-muted-foreground">{index + 1}</span></div>)}</div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div><div className="font-mono text-lg font-bold">{value}</div></div></div></div>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-muted/60 p-3"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div><div className="font-mono font-bold">{value}</div></div>;
}

function RouteStep({ title, body }: { title: string; body: string }) {
  return <div><div className="font-semibold">{title}</div><div className="text-xs text-muted-foreground">{body}</div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}

function ChannelButton({ active, icon, title, body, onClick }: { active: boolean; icon: React.ReactNode; title: string; body: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border p-4 text-left transition ${active ? "border-primary bg-accent-soft text-primary" : "border-border hover:border-primary/50"}`}><span className="grid h-10 w-10 place-items-center rounded-lg bg-background text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div className="mt-3 font-semibold">{title}</div><div className="mt-1 text-xs text-muted-foreground">{body}</div></button>;
}
