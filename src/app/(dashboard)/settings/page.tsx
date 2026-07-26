"use client";

import { AppShell } from "@/components/app/AppShell";
import { Settings as SettingsIcon, User, Bell, Shield, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";

const sections = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Your name, email, and avatar",
    fields: [
      { label: "Name", value: "Ahmed Naveed" },
      { label: "Email", value: "ahmed@ringly.ai" },
      { label: "Role", value: "Owner" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "How you receive updates",
    fields: [
      { label: "Email notifications", value: "Enabled" },
      { label: "Push notifications", value: "Enabled" },
      { label: "Weekly digest", value: "Disabled" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Password and authentication",
    fields: [
      { label: "Password", value: "Last changed 30 days ago" },
      { label: "Two-factor auth", value: "Enabled" },
    ],
  },
  {
    id: "language",
    label: "Language & Region",
    icon: Globe,
    description: "Language and timezone",
    fields: [
      { label: "Language", value: "English" },
      { label: "Timezone", value: "UTC+5 (Pakistan)" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="space-y-4 max-w-2xl">
        {sections.map((section) => (
          <div key={section.id} className={cn(CARD, "overflow-hidden")}>
            <div className="px-5 py-4 border-b border-border/25">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-muted/50">
                  <section.icon size={15} strokeWidth={1.5} className="text-muted-foreground/40" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-foreground">{section.label}</h3>
                  <p className="text-[11px] text-muted-foreground/45">{section.description}</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border/15">
              {section.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-[13px] text-muted-foreground/60">{field.label}</span>
                  <span className="text-[13px] font-medium text-foreground">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
