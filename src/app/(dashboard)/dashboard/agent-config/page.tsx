"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Brain,
  CalendarCheck,
  Check,
  FileText,
  Gauge,
  PhoneCall,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const panels = [
  { id: "brain", label: "Brain", icon: Brain },
  { id: "rules", label: "Rules", icon: ShieldCheck },
  { id: "tools", label: "Tools", icon: Zap },
  { id: "lab", label: "Live lab", icon: Activity },
] as const;

const actionsSeed = [
  { id: "booking", label: "Book appointments", icon: CalendarCheck, enabled: true, risk: "Confirm under $100" },
  { id: "orders", label: "Create orders", icon: ShoppingBag, enabled: true, risk: "Auto-approve catalog items" },
  { id: "voice", label: "Answer missed calls", icon: PhoneCall, enabled: true, risk: "Summarize every call" },
  { id: "refunds", label: "Issue refunds", icon: ShieldCheck, enabled: false, risk: "Always escalate first" },
];

const knowledge = [
  { name: "Catalog sync", meta: "6 live services · refreshes every 3 min", strength: 92 },
  { name: "Policies", meta: "Deposits, late arrivals, cancellations", strength: 86 },
  { name: "Staff calendar", meta: "Ana, Luis, Camila availability", strength: 78 },
];

type PanelId = (typeof panels)[number]["id"];
type ChatMessage = { from: "agent" | "owner"; text: string; action?: string };

export default function AgentPage() {
  const [panel, setPanel] = useState<PanelId>("brain");
  const [autonomy, setAutonomy] = useState([62]);
  const [tone, setTone] = useState("Warm expert");
  const [channels, setChannels] = useState({ whatsapp: true, voice: true, web: false });
  const [actions, setActions] = useState(actionsSeed);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "agent", text: "Compass is staged with your live catalog, calendar, and policies.", action: "Ready" },
    { from: "owner", text: "A customer asks for balayage this Saturday after 3." },
    { from: "agent", text: "Saturday 3:30 PM with Ana is open. I quoted $45, held the slot, and asked for confirmation.", action: "book_appointment" },
  ]);

  const activeActions = actions.filter((a) => a.enabled).length;
  const readiness = Math.min(99, 58 + activeActions * 8 + Math.round(autonomy[0] / 5));
  const responseStyle = useMemo(() => (autonomy[0] > 70 ? "decisive" : autonomy[0] < 35 ? "careful" : "balanced"), [autonomy]);

  const save = () => {
    setSaved(true);
    toast.success("Agent configuration saved");
    setTimeout(() => setSaved(false), 1400);
  };

  const dryRun = () => {
    setMessages((items) => [
      ...items,
      { from: "owner", text: "Run a full checkout + booking simulation." },
      { from: "agent", text: `Simulation complete. ${activeActions} tools executed safely with ${readiness}% readiness.`, action: "dry_run" },
    ]);
    setPanel("lab");
  };

  const fakeUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast.success("Knowledge source parsed and attached");
    }, 1000);
  };

  const send = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    setMessages((items) => [
      ...items,
      { from: "owner", text },
      {
        from: "agent",
        text: `Using a ${responseStyle} ${tone.toLowerCase()} voice: I can answer that, check availability, and take the next safe action now.`,
        action: autonomy[0] > 55 ? "action_ready" : "needs_confirmation",
      },
    ]);
  };

  return (
    <AppShell
      title="Agent Studio"
      subtitle={`${readiness}% launch readiness · ${activeActions} tools armed`}
      actions={
        <>
          <Button type="button" size="sm" variant="outline" onClick={dryRun}>
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Dry run
          </Button>
          <Button type="button" size="sm" onClick={save}>
            {saved ? <Check className="mr-1 h-3.5 w-3.5" /> : <Save className="mr-1 h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-xl border border-border bg-card p-5 md:p-7">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_60%_20%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_35%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge className="bg-accent-soft text-primary hover:bg-accent-soft">Live staging area</Badge>
              <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
                Tune the agent like a control room, not a settings page.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Persona, knowledge, permissions, and test conversations stay in one interactive workspace.
              </p>
              <div className="mt-6 grid max-w-2xl grid-cols-3 gap-3">
                <Metric label="Resolution" value="84%" />
                <Metric label="Avg reply" value="1.4s" />
                <Metric label="Escalations" value="12" />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background/80 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Autonomy level</span>
                <span className="font-mono text-foreground">{autonomy[0]}%</span>
              </div>
              <Slider value={autonomy} onValueChange={setAutonomy} min={10} max={95} step={1} className="mt-4" />
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                <Stage active={autonomy[0] < 40} title="Ask" body="low risk" />
                <Stage active={autonomy[0] >= 40 && autonomy[0] < 72} title="Confirm" body="balanced" />
                <Stage active={autonomy[0] >= 72} title="Act" body="fast lane" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[260px_1fr_430px]">
          <aside className="space-y-3">
            <div className="rounded-xl border border-border bg-card p-2">
              {panels.map((item) => {
                const Icon = item.icon;
                const active = panel === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPanel(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      active ? "bg-accent-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {active && <ArrowRight className="ml-auto h-4 w-4" />}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Gauge className="h-4 w-4 text-primary" /> Launch score
              </div>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${readiness}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Knowledge and guardrails are strong. Add one escalation rule to reach 100%.
              </div>
            </div>
          </aside>

          <main className="min-h-[620px] rounded-xl border border-border bg-card p-5 md:p-6">
            {panel === "brain" && (
              <div className="space-y-6 animate-fade-up">
                <Header
                  icon={<Brain />}
                  title="Brain & personality"
                  body="Shape the words customers hear and the confidence behind each decision."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Agent name">
                    <Input defaultValue="Compass" />
                  </Field>
                  <Field label="Default language">
                    <Input defaultValue="English + Spanish auto-detect" />
                  </Field>
                </div>
                <div>
                  <Label className="mb-2 block text-sm">Tone stack</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Warm expert", "Luxury concierge", "Fast operator", "Playful host", "Strict policy", "Calm support"].map(
                      (item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setTone(item)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            tone === item
                              ? "border-primary bg-accent-soft text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <Field label="Operating instructions">
                  <Textarea
                    rows={7}
                    className="font-mono text-sm"
                    defaultValue={
                      "Reply in under 3 sentences.\nConfirm total price before booking.\nUse the customer's name when known.\nIf confidence drops below 70%, escalate with a short summary."
                    }
                  />
                </Field>
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(channels).map(([key, val]) => (
                    <div key={key} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize">{key}</span>
                        <Switch checked={val} onCheckedChange={(v) => setChannels((c) => ({ ...c, [key]: v }))} />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {val ? "Active in test replies" : "Muted for now"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {panel === "rules" && (
              <div className="space-y-5 animate-fade-up">
                <Header
                  icon={<ShieldCheck />}
                  title="Guardrails"
                  body="Every automatic action is fenced by confirmation, confidence, and escalation rules."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Escalate immediately when">
                    <Textarea
                      rows={8}
                      defaultValue={
                        "- customer mentions complaint, refund, lawyer, manager\n- booking value is above $150\n- calendar has overlapping staff assignments\n- response confidence is below 70%"
                      }
                    />
                  </Field>
                  <Field label="Never promise">
                    <Textarea
                      rows={8}
                      defaultValue={
                        "- discounts not listed in catalog\n- exact medical or legal advice\n- availability without checking calendar\n- refund approval without owner confirmation"
                      }
                    />
                  </Field>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Policy title="PII redaction" value="Enabled" />
                  <Policy title="Human audit trail" value="Required" />
                  <Policy title="Payment cap" value="$100" />
                </div>
              </div>
            )}

            {panel === "tools" && (
              <div className="space-y-5 animate-fade-up">
                <Header
                  icon={<Zap />}
                  title="Tools & knowledge"
                  body="Connect what the agent can read and what it is trusted to do."
                />
                <button
                  type="button"
                  onClick={fakeUpload}
                  className="w-full rounded-xl border-2 border-dashed border-border p-6 text-center transition hover:border-primary hover:bg-accent-soft"
                >
                  <Upload className="mx-auto h-8 w-8 text-primary" />
                  <div className="mt-2 text-sm font-semibold">
                    {uploading ? "Parsing new knowledge…" : "Upload policy, menu, FAQ, or price sheet"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    The parser adds facts to the live test agent.
                  </div>
                </button>
                <div className="space-y-2">
                  {knowledge.map((item) => (
                    <KnowledgeRow key={item.name} {...item} />
                  ))}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <div key={action.id} className="rounded-xl border border-border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-primary">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div>
                              <div className="text-sm font-semibold">{action.label}</div>
                              <div className="text-xs text-muted-foreground">{action.risk}</div>
                            </div>
                          </div>
                          <Switch
                            checked={action.enabled}
                            onCheckedChange={(enabled) =>
                              setActions((items) =>
                                items.map((x) => (x.id === action.id ? { ...x, enabled } : x))
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {panel === "lab" && (
              <div className="space-y-5 animate-fade-up">
                <Header
                  icon={<Activity />}
                  title="Decision lab"
                  body="Watch each response, tool call, confidence score, and escalation decision."
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <Policy title="Current tone" value={tone} />
                  <Policy title="Mode" value={responseStyle} />
                  <Policy title="Tools armed" value={String(activeActions)} />
                </div>
                <div className="rounded-xl border border-border bg-[color:var(--surface-2)] p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Action timeline
                  </div>
                  {[
                    "Intent detected",
                    "Catalog checked",
                    "Calendar matched",
                    autonomy[0] > 55 ? "Action queued" : "Owner confirmation requested",
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-3 border-l border-border pb-4 pl-4 last:pb-0">
                      <span className="-ml-[23px] grid h-4 w-4 place-items-center rounded-full bg-primary text-primary-foreground text-[9px]">
                        {i + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="flex min-h-[620px] flex-col rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </span>
                  Test conversation
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setMessages([{ from: "agent", text: "Reset complete. Send a customer scenario.", action: "Ready" }])
                  }
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-auto bg-[color:var(--surface-2)] p-4">
              {messages.map((message, i) => (
                <div key={i} className={`max-w-[88%] ${message.from === "owner" ? "ml-auto" : ""}`}>
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      message.from === "owner"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card"
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.action && (
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
                      <Sparkles className="h-2.5 w-2.5 text-primary" /> {message.action}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-border p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {["Quote balayage", "Move a booking", "Refund request"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setDraft(item)}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] hover:border-primary hover:text-primary"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a customer scenario…"
                />
                <Button type="button" onClick={send}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/80 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-xl font-bold">{value}</div>
    </div>
  );
}

function Stage({ active, title, body }: { active: boolean; title: string; body: string }) {
  return (
    <div className={`rounded-lg border p-3 transition ${active ? "border-primary bg-accent-soft text-primary" : "border-border"}`}>
      <div className="font-semibold">{title}</div>
      <div className="text-[10px] text-muted-foreground">{body}</div>
    </div>
  );
}

function Header({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="border-b border-border pb-4">
      <div className="flex items-center gap-2 text-xl font-bold">
        <span className="[&>svg]:h-5 [&>svg]:w-5 text-primary">{icon}</span>
        {title}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      {children}
    </div>
  );
}

function Policy({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function KnowledgeRow({ name, meta, strength }: { name: string; meta: string; strength: number }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-primary">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{name}</div>
          <div className="truncate text-xs text-muted-foreground">{meta}</div>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{strength}%</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${strength}%` }} />
      </div>
    </div>
  );
}
