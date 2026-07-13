"use client";

import { AppShell } from "@/components/app/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Users, Bell, CreditCard, Palette, Shield, Plug, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;
type TabId = typeof TABS[number]["id"];

export default function SettingsPage() {
  const [tab, setTab] = useState<TabId>("profile");
  const [saved, setSaved] = useState(false);
  const save = () => {
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 1500);
  };

  const team = [
    { name: "Ana Reyes", role: "Owner", email: "ana@bloom.com", initial: "A" },
    { name: "Luis Perez", role: "Staff", email: "luis@bloom.com", initial: "L" },
    { name: "Camila Ortiz", role: "Staff", email: "camila@bloom.com", initial: "C" },
  ];

  const integrations = [
    { name: "Google Calendar", desc: "Sync bookings to your calendar", connected: true },
    { name: "Stripe", desc: "Take deposits and payments", connected: true },
    { name: "Slack", desc: "Ping team on escalations", connected: false },
    { name: "Shopify", desc: "Sync products as catalog", connected: false },
  ];

  return (
    <AppShell title="Settings" subtitle="Workspace preferences and integrations">
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <div className="rounded-xl border border-border bg-card p-2 h-fit sticky top-20">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-accent-soft text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        <div className="min-w-0">
          {tab === "profile" && (
            <div className="rounded-xl border border-border bg-card p-6 max-w-2xl space-y-4 animate-fade-in">
              <SectionTitle title="Profile" desc="How your workspace shows up." />
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-[#8b5cf6] text-white text-xl font-bold">
                  B
                </div>
                <Button variant="outline" size="sm">
                  Change avatar
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Business name</Label>
                  <Input defaultValue="Bloom Studio" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Email</Label>
                  <Input defaultValue="ana@bloom.com" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Timezone</Label>
                  <Input defaultValue="Europe/Madrid" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Currency</Label>
                  <Input defaultValue="EUR (€)" />
                </div>
              </div>
              <Button onClick={save} className="bg-primary hover:bg-primary/90">
                {saved ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" /> Saved
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          )}

          {tab === "team" && (
            <div className="rounded-xl border border-border bg-card animate-fade-in">
              <div className="p-6 pb-4 flex items-center justify-between">
                <SectionTitle title="Team" desc="Invite teammates to manage the agent." />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Invite
                </Button>
              </div>
              <div className="divide-y divide-border">
                {team.map((m) => (
                  <div key={m.email} className="px-6 py-3 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-primary font-semibold">
                      {m.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </div>
                    <Badge variant={m.role === "Owner" ? "default" : "secondary"}>
                      {m.role}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="rounded-xl border border-border bg-card p-6 max-w-2xl space-y-1 animate-fade-in">
              <SectionTitle title="Notifications" desc="How we reach you." />
              {[
                "Email me on escalations",
                "Daily digest",
                "Weekly analytics report",
                "New booking alerts",
                "SMS for high-value bookings",
              ].map((n) => (
                <div
                  key={n}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <span className="text-sm">{n}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          )}

          {tab === "billing" && (
            <div className="space-y-4 animate-fade-in max-w-2xl">
              <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-accent-soft to-card p-6">
                <SectionTitle title="Billing" desc="Plan, usage and invoices." />
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Current plan</div>
                    <div className="text-3xl font-bold">Growth</div>
                    <div className="text-sm text-muted-foreground">
                      $49/mo · Renews May 12
                    </div>
                  </div>
                  <Button variant="outline">Upgrade</Button>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Messages this month</span>
                    <span className="font-mono">4,215 / 10,000</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "42%" }} />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="text-sm font-semibold mb-3">Recent invoices</div>
                {["Apr 2026 · $49.00", "Mar 2026 · $49.00", "Feb 2026 · $49.00"].map(
                  (i) => (
                    <div
                      key={i}
                      className="flex justify-between py-2 border-b border-border last:border-0 text-sm"
                    >
                      <span>{i}</span>
                      <Button size="sm" variant="ghost">
                        Download
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {tab === "integrations" && (
            <div className="animate-fade-in grid md:grid-cols-2 gap-3">
              {integrations.map((i) => (
                <div key={i.name} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold">{i.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {i.desc}
                      </div>
                    </div>
                    {i.connected ? (
                      <Badge className="bg-success/15 text-success hover:bg-success/15">
                        Connected
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant={i.connected ? "outline" : "default"}
                      className={i.connected ? "" : "bg-primary hover:bg-primary/90"}
                    >
                      {i.connected ? "Manage" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "security" && (
            <div className="rounded-xl border border-border bg-card p-6 max-w-2xl space-y-4 animate-fade-in">
              <SectionTitle title="Security" desc="Protect your workspace." />
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <div className="text-sm font-medium">Two-factor authentication</div>
                  <div className="text-xs text-muted-foreground">
                    Require a code at sign in.
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <div className="text-sm font-medium">Session timeout</div>
                  <div className="text-xs text-muted-foreground">
                    Sign out after 30 days of inactivity.
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <Label className="mb-1.5 block">Change password</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="password" placeholder="Current" />
                  <Input type="password" placeholder="New" />
                </div>
                <Button className="mt-3 bg-primary hover:bg-primary/90">
                  Update password
                </Button>
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div className="rounded-xl border border-border bg-card p-6 max-w-2xl space-y-4 animate-fade-in">
              <SectionTitle title="Appearance" desc="Theme and density." />
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark mode</span>
                <Switch />
              </div>
              <div>
                <Label className="mb-2 block text-sm">Accent color</Label>
                <div className="flex gap-2">
                  {[
                    "#4f46e5",
                    "#059669",
                    "#dc2626",
                    "#d97706",
                    "#8b5cf6",
                    "#0891b2",
                  ].map((c) => (
                    <button
                      key={c}
                      className="h-8 w-8 rounded-full ring-2 ring-transparent hover:ring-primary transition"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <div className="text-lg font-bold">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}
