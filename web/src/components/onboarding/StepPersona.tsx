"use client";

import { Bot, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "./types";

const tones = [
  { id: "formal", label: "Formal", example: "Good morning. How may I assist you today?" },
  { id: "friendly", label: "Friendly", example: "Hey there! Thanks for reaching out — how can I help?" },
  { id: "casual", label: "Casual", example: "Hi! What can I do for you today?" },
  { id: "playful", label: "Playful", example: "Heyyy! You've reached the right place — let's do this!" },
] as const;

const responseLengths = [
  { id: "concise", label: "Concise", desc: "Short, direct answers." },
  { id: "detailed", label: "Detailed", desc: "Thorough responses with context." },
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

export function StepPersona({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
          Agent persona
        </h2>
        <p className="text-sm text-[var(--ash)]">
          Configure how your AI agent looks and sounds.
        </p>
      </div>

      {/* Identity */}
      <div>
        <SectionHeading
          icon={Bot}
          title="Identity"
          description="Name and tone of your agent."
        />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="agentName">Display name</Label>
            <Input
              id="agentName"
              placeholder="Bloom Assistant"
              value={data.agentDisplayName}
              onChange={(e) => onChange({ agentDisplayName: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Tone</Label>
            <div className="grid grid-cols-2 gap-2">
              {tones.map(({ id, label, example }) => (
                <button
                  key={id}
                  onClick={() => onChange({ tone: id })}
                  className={cn(
                    "rounded-lg border-2 p-3 text-left transition-all",
                    data.tone === id
                      ? "border-[var(--cedar)] bg-[var(--mist)]"
                      : "border-[var(--slate)] bg-white hover:border-[var(--cedar)]/40"
                  )}
                >
                  <p className="text-xs font-semibold text-[var(--ink)]">{label}</p>
                  <p className="text-[10px] text-[var(--ash)] mt-0.5 leading-relaxed italic">
                    &ldquo;{example}&rdquo;
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Response length</Label>
            <div className="grid grid-cols-2 gap-2">
              {responseLengths.map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => onChange({ responseLength: id })}
                  className={cn(
                    "rounded-lg border-2 px-4 py-2.5 text-left transition-all",
                    data.responseLength === id
                      ? "border-[var(--cedar)] bg-[var(--mist)]"
                      : "border-[var(--slate)] bg-white hover:border-[var(--cedar)]/40"
                  )}
                >
                  <p className="text-xs font-semibold text-[var(--ink)]">{label}</p>
                  <p className="text-[10px] text-[var(--ash)]">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Messages */}
      <div>
        <SectionHeading
          icon={Smile}
          title="Messages"
          description="Customize greetings, sign-offs, and fallback responses."
        />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="greeting">Greeting message</Label>
            <Textarea
              id="greeting"
              placeholder="Hi! Welcome to {business_name}. How can I help you today?"
              value={data.greetingMessage}
              onChange={(e) => onChange({ greetingMessage: e.target.value })}
              className="min-h-[60px]"
            />
            <p className="text-[10px] text-[var(--ash)]">
              Use {"{business_name}"} to insert your business name.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signoff">Sign-off message</Label>
            <Input
              id="signoff"
              placeholder="Thanks for reaching out! Have a great day."
              value={data.signoffMessage}
              onChange={(e) => onChange({ signoffMessage: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fallback">Fallback message</Label>
            <Textarea
              id="fallback"
              placeholder="I'm not sure about that, but I can connect you with someone who can help."
              value={data.fallbackMessage}
              onChange={(e) => onChange({ fallbackMessage: e.target.value })}
              className="min-h-[60px]"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[var(--slate)] bg-white px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-[var(--ink)]">Use emoji</p>
              <p className="text-[10px] text-[var(--ash)]">Allow the agent to use emoji in responses.</p>
            </div>
            <Switch
              checked={data.useEmoji}
              onCheckedChange={(v) => onChange({ useEmoji: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
