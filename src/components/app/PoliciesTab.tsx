"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Flag,
  MessageSquareWarning,
  Shield,
  UserX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTenant } from "@/lib/tenant-context";
import { cn } from "@/lib/utils";

const defaultTriggers = [
  {
    id: "refund",
    label: "Refund request",
    description: "Customer asks for a refund or money back.",
    icon: Shield,
    enabled: true,
  },
  {
    id: "angry",
    label: "Angry customer",
    description: "Sentiment detection — frustrated or upset language.",
    icon: MessageSquareWarning,
    enabled: true,
  },
  {
    id: "cant_answer",
    label: "Agent can't answer",
    description: "Confidence below threshold or topic not in knowledge base.",
    icon: AlertTriangle,
    enabled: true,
  },
  {
    id: "ask_human",
    label: "Customer asks for a human",
    description: "Explicit request like 'speak to someone' or 'talk to a person'.",
    icon: UserX,
    enabled: false,
  },
];

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--cedar)]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          {title}
        </h3>
        <p className="text-xs text-[var(--ash)] mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export function PoliciesTab() {
  const tenant = useTenant();
  const isProduct = tenant.businessType === "Product";

  // Policies
  const [cancellationPolicy, setCancellationPolicy] = useState(
    "Customers may cancel or reschedule up to 24 hours before their appointment at no charge. Cancellations within 24 hours incur a 50% fee. No-shows are charged in full.",
  );
  const [refundPolicy, setRefundPolicy] = useState(
    "Full refund within 7 days of purchase with receipt. Store credit within 14 days. No refunds on opened or used products. Sale items are final sale.",
  );

  // Triggers
  const [triggers, setTriggers] = useState(defaultTriggers);

  // Custom trigger phrases
  const [customPhrases, setCustomPhrases] = useState<string[]>([
    "speak to manager",
    "this is unacceptable",
  ]);
  const [phraseInput, setPhraseInput] = useState("");

  // Escalation contact
  const [escalationContact, setEscalationContact] = useState("inbox");

  // Save state
  const [saving, setSaving] = useState(false);

  const toggleTrigger = (id: string) => {
    setTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );
  };

  const addPhrase = () => {
    const phrase = phraseInput.trim().toLowerCase();
    if (phrase && !customPhrases.includes(phrase)) {
      setCustomPhrases((prev) => [...prev, phrase]);
      setPhraseInput("");
    }
  };

  const removePhrase = (phrase: string) => {
    setCustomPhrases((prev) => prev.filter((p) => p !== phrase));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* ── Cancellation Policy ── */}
      <section>
        <SectionHeading
          icon={Shield}
          title="Cancellation Policy"
          description="Shown to customers when they try to cancel a booking. The agent enforces these rules automatically."
        />
        <Card>
          <CardContent className="p-5 space-y-3">
            <Textarea
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
              className="min-h-[100px] text-sm"
            />
            <p className="text-[10px] text-[var(--ash)]">
              Be specific about timeframes and fees — the agent will quote
              this policy directly.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Refund Policy (Product only) ── */}
      {isProduct && (
        <section>
          <SectionHeading
            icon={Shield}
            title="Refund Policy"
            description="Shown to customers requesting a refund. The agent will reference this when handling refund conversations."
          />
          <Card>
            <CardContent className="p-5 space-y-3">
              <Textarea
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                className="min-h-[100px] text-sm"
              />
              <p className="text-[10px] text-[var(--ash)]">
                Include conditions, timeframes, and any exceptions. The agent
                follows these rules unless a human overrides.
              </p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Escalation Triggers ── */}
      <section>
        <SectionHeading
          icon={Flag}
          title="Escalation Triggers"
          description="Conditions that automatically hand the conversation from the agent to a human."
        />
        <Card>
          <CardContent className="p-5 space-y-0">
            {triggers.map((trigger, i) => {
              const Icon = trigger.icon;
              return (
                <div key={trigger.id}>
                  <div className="flex items-start gap-4 py-3.5">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
                        trigger.enabled
                          ? "bg-[var(--mist)] text-[var(--cedar)]"
                          : "bg-[var(--linen)] text-[var(--ash)]",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)]">
                        {trigger.label}
                      </p>
                      <p className="text-xs text-[var(--ash)] mt-0.5">
                        {trigger.description}
                      </p>
                    </div>
                    <Switch
                      checked={trigger.enabled}
                      onCheckedChange={() => toggleTrigger(trigger.id)}
                    />
                  </div>
                  {i < triggers.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* ── Custom Trigger Phrases ── */}
      <section>
        <SectionHeading
          icon={MessageSquareWarning}
          title="Custom Trigger Phrases"
          description="When a customer says one of these exact phrases, the agent escalates immediately."
        />
        <Card>
          <CardContent className="p-5 space-y-3">
            {customPhrases.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customPhrases.map((phrase) => (
                  <span
                    key={phrase}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--slate)] bg-[var(--linen)] px-2.5 py-1 text-xs font-medium text-[var(--ink)]"
                  >
                    &ldquo;{phrase}&rdquo;
                    <button
                      onClick={() => removePhrase(phrase)}
                      className="rounded p-0.5 hover:bg-hover-bg transition-colors"
                    >
                      <X className="h-3 w-3 text-[var(--ash)]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input
                value={phraseInput}
                onChange={(e) => setPhraseInput(e.target.value)}
                placeholder='e.g. "let me speak to your manager"'
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPhrase();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={addPhrase}
                disabled={
                  !phraseInput.trim() ||
                  customPhrases.includes(phraseInput.trim().toLowerCase())
                }
                className="shrink-0"
              >
                Add
              </Button>
            </div>
            <p className="text-[10px] text-[var(--ash)]">
              {customPhrases.length} phrase{customPhrases.length !== 1 ? "s" : ""} configured.
              Phrases are matched case-insensitively.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Escalation Contact ── */}
      <section>
        <SectionHeading
          icon={UserX}
          title="Escalation Contact"
          description="Who gets notified when a conversation is escalated."
        />
        <Card>
          <CardContent className="p-5">
            <div className="max-w-sm space-y-3">
              <Select value={escalationContact} onValueChange={setEscalationContact}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">
                    Business owner (you)
                  </SelectItem>
                  <SelectItem value="inbox">
                    Just flag in Inbox — no notification
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-[var(--ash)]">
                {escalationContact === "owner"
                  ? "You'll receive a notification and the conversation will appear in your Inbox."
                  : "Escalated conversations are flagged in the Inbox but no push notification is sent."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Sticky Save Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--slate)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-end gap-3 px-6">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
