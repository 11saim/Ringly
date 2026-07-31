"use client";

import {
  Building2,
  Clock,
  Globe,
  MessageCircle,
  Bot,
  Package,
  Scissors,
  Shield,
  BookOpen,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "./types";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function ReviewSection({
  icon: Icon,
  title,
  editStep,
  onEdit,
  children,
}: {
  icon: React.ElementType;
  title: string;
  editStep: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[var(--cedar)]" />
          <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
            {title}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-[10px] text-[var(--cedar)]"
          onClick={() => onEdit(editStep)}
        >
          <Pencil className="h-2.5 w-2.5" />
          Edit
        </Button>
      </div>
      <div className="rounded-lg border border-[var(--slate)] bg-white p-3 text-xs text-[var(--ink)] space-y-1">
        {children}
      </div>
    </div>
  );
}

export function StepReview({
  data,
  onEdit,
}: {
  data: OnboardingData;
  onEdit: (step: number) => void;
}) {
  const isService = data.businessType === "service";
  const openDays = Object.entries(data.hours)
    .filter(([, h]) => !h.closed)
    .map(([d]) => dayNames[Number(d)]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
          Review your setup
        </h2>
        <p className="text-sm text-[var(--ash)]">
          Everything looks good? Hit &ldquo;Go live&rdquo; to finish and start using your agent.
        </p>
      </div>

      <div className="space-y-4">
        <ReviewSection icon={Building2} title="Business type" editStep={0} onEdit={onEdit}>
          <p className="capitalize">{data.businessType} business</p>
        </ReviewSection>

        <ReviewSection icon={MessageCircle} title="WhatsApp" editStep={1} onEdit={onEdit}>
          <p>{data.whatsappConnected ? "Connected" : "Not connected (can set up later)"}</p>
        </ReviewSection>

        <ReviewSection icon={Globe} title="Business profile" editStep={2} onEdit={onEdit}>
          {data.description && <p>{data.description}</p>}
          {data.industry && <p>Industry: {data.industry}</p>}
          <p>Open: {openDays.length > 0 ? openDays.join(", ") : "No hours set"}</p>
          {data.timezone && <p>Timezone: {data.timezone}</p>}
          {data.currency && <p>Currency: {data.currency}</p>}
          {isService && data.address && <p>Address: {data.address}</p>}
        </ReviewSection>

        <ReviewSection icon={Bot} title="Agent persona" editStep={3} onEdit={onEdit}>
          <p>Name: {data.agentDisplayName}</p>
          <p className="capitalize">Tone: {data.tone}</p>
          <p className="capitalize">Response length: {data.responseLength}</p>
          <p>Emoji: {data.useEmoji ? "Yes" : "No"}</p>
        </ReviewSection>

        <ReviewSection
          icon={isService ? Scissors : Package}
          title={isService ? "Services" : "Products"}
          editStep={4}
          onEdit={onEdit}
        >
          {isService ? (
            data.services.length > 0 ? (
              data.services.map((s, i) => (
                <p key={i}>
                  {s.name || "Untitled"} — {s.durationMinutes} min, ${s.price}
                </p>
              ))
            ) : (
              <p className="text-[var(--ash)]">No services added</p>
            )
          ) : data.products.length > 0 ? (
            data.products.map((p, i) => (
              <p key={i}>
                {p.name || "Untitled"} — ${p.price}, {p.stockQuantity} in stock
              </p>
            ))
          ) : (
            <p className="text-[var(--ash)]">No products added</p>
          )}
        </ReviewSection>

        <ReviewSection icon={Shield} title="Policies" editStep={5} onEdit={onEdit}>
          {data.cancellationPolicy && (
            <p className="line-clamp-2">{data.cancellationPolicy}</p>
          )}
          {isService && data.refundPolicy && (
            <p className="line-clamp-2">{data.refundPolicy}</p>
          )}
          <p>
            Escalation triggers:{" "}
            {data.escalationTriggers
              .filter((t) => t.isEnabled)
              .map((t) => t.triggerType.replace(/_/g, " "))
              .join(", ") || "None"}
          </p>
        </ReviewSection>

        <ReviewSection icon={BookOpen} title="Knowledge base" editStep={6} onEdit={onEdit}>
          <p>{data.faqs.length} FAQ(s), {data.documents.length} document(s)</p>
          {data.faqs.length === 0 && data.documents.length === 0 && (
            <p className="text-[var(--ash)]">Skipped — can add later in Settings</p>
          )}
        </ReviewSection>
      </div>
    </div>
  );
}
