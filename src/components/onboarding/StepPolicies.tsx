"use client";

import {
  Shield,
  AlertTriangle,
  MessageSquareWarning,
  UserX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "./types";

const triggerDefs = [
  { type: "refund_request", label: "Refund request", icon: Shield, desc: "Customer asks for a refund." },
  { type: "angry_customer", label: "Angry customer", icon: MessageSquareWarning, desc: "Frustrated or upset language." },
  { type: "cant_answer", label: "Can't answer", icon: AlertTriangle, desc: "Confidence below threshold." },
  { type: "asks_for_human", label: "Asks for a human", icon: UserX, desc: "Explicit request for a person." },
] as const;

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

export function StepPolicies({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  const isProduct = data.businessType === "product";

  function toggleTrigger(idx: number) {
    const next = [...data.escalationTriggers];
    next[idx] = { ...next[idx], isEnabled: !next[idx].isEnabled };
    onChange({ escalationTriggers: next });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
          Policies & escalation
        </h2>
        <p className="text-sm text-[var(--ash)]">
          Define how the agent handles cancellations, refunds, and escalations.
        </p>
      </div>

      {/* Cancellation */}
      <div>
        <SectionHeading
          icon={Shield}
          title="Cancellation policy"
          description="Shown to customers when they request to cancel."
        />
        <Textarea
          placeholder="Customers may cancel up to 24 hours before their appointment at no charge."
          value={data.cancellationPolicy}
          onChange={(e) => onChange({ cancellationPolicy: e.target.value })}
          className="min-h-[80px]"
        />
      </div>

      {/* Refund — Product only */}
      {isProduct && (
        <>
          <Separator />
          <div>
            <SectionHeading
              icon={Shield}
              title="Refund policy"
              description="Shown to customers when they request a refund."
            />
            <Textarea
              placeholder="Full refund within 7 days of purchase with receipt."
              value={data.refundPolicy}
              onChange={(e) => onChange({ refundPolicy: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
        </>
      )}

      <Separator />

      {/* Escalation triggers */}
      <div>
        <SectionHeading
          icon={AlertTriangle}
          title="Escalation triggers"
          description="Choose when the agent should hand off to a human."
        />
        <div className="space-y-2">
          {triggerDefs.map(({ type, label, icon: Icon, desc }, idx) => {
            const trigger = data.escalationTriggers.find((t) => t.triggerType === type);
            const isEnabled = trigger?.isEnabled ?? false;
            return (
              <div
                key={type}
                className={cn(
                  "rounded-lg border px-4 py-3 transition-all",
                  isEnabled
                    ? "border-[var(--cedar)]/30 bg-[var(--mist)]"
                    : "border-[var(--slate)] bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isEnabled ? "text-[var(--cedar)]" : "text-[var(--ash)]"
                      )}
                    />
                    <div>
                      <p className="text-xs font-semibold text-[var(--ink)]">{label}</p>
                      <p className="text-[10px] text-[var(--ash)]">{desc}</p>
                    </div>
                  </div>
                  <Switch checked={isEnabled} onCheckedChange={() => toggleTrigger(idx)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Notify target */}
      <div>
        <SectionHeading
          icon={UserX}
          title="Escalation contact"
          description="Who gets notified when the agent escalates."
        />
        <Input
          placeholder="Email or phone number"
          value={data.escalationNotifyTarget}
          onChange={(e) => onChange({ escalationNotifyTarget: e.target.value })}
        />
      </div>
    </div>
  );
}
