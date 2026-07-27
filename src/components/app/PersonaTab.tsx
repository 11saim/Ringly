"use client";

import { useRef, useState } from "react";
import {
  Bot,
  Globe,
  MessageSquare,
  Smile,
  Tags,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTenant } from "@/lib/tenant-context";
import { cn } from "@/lib/utils";

const tones = [
  {
    id: "formal",
    label: "Formal",
    description: "Professional and courteous. Best for clinics and corporate services.",
    example: "Good morning. How may I assist you today?",
  },
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm and approachable. The default for most businesses.",
    example: "Hey there! Thanks for reaching out — how can I help?",
  },
  {
    id: "casual",
    label: "Casual",
    description: "Relaxed and conversational. Great for salons and local shops.",
    example: "Hi! What can I do for you today?",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Fun and energetic. For brands with personality.",
    example: "Heyyy! You've reached the right place — let's do this!",
  },
] as const;

const responseLengths = [
  {
    id: "concise",
    label: "Concise",
    description: "Short, direct answers. Gets to the point fast.",
  },
  {
    id: "detailed",
    label: "Detailed",
    description: "Thorough responses with context and follow-up options.",
  },
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

export function PersonaTab() {
  const tenant = useTenant();

  // Agent identity
  const [agentName, setAgentName] = useState("Bloom Assistant");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Tone
  const [tone, setTone] = useState<string>("friendly");

  // Messages
  const [greeting, setGreeting] = useState(
    "Hi! Welcome to {business_name}. How can I help you today?",
  );
  const [signoff, setSignoff] = useState("");

  // Preferences
  const [emojiEnabled, setEmojiEnabled] = useState(true);
  const [responseLength, setResponseLength] = useState<string>("concise");

  // Fallback
  const [fallback, setFallback] = useState(
    "I'm sorry, I'm not sure about that. Let me connect you with our team who can help.",
  );

  // Banned terms
  const [bannedTerms, setBannedTerms] = useState<string[]>([
    "competitor",
    "rival",
    "discount code",
  ]);
  const [termInput, setTermInput] = useState("");

  // Save state
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addTerm = () => {
    const term = termInput.trim().toLowerCase();
    if (term && !bannedTerms.includes(term)) {
      setBannedTerms((prev) => [...prev, term]);
      setTermInput("");
    }
  };

  const removeTerm = (term: string) => {
    setBannedTerms((prev) => prev.filter((t) => t !== term));
  };

  // Live preview: replace {business_name} with actual name
  const renderedGreeting = greeting.replace(/{business_name}/g, tenant.name);
  const renderedSignoff = signoff.replace(/{business_name}/g, tenant.name);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* ── Agent Identity ── */}
      <section>
        <SectionHeading
          icon={Bot}
          title="Agent Identity"
          description="How your agent identifies itself to customers."
        />
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="space-y-2">
                <Label>Avatar</Label>
                <div
                  className="relative flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-[var(--slate)] bg-[var(--linen)] overflow-hidden cursor-pointer transition-colors hover:border-[var(--cedar)]"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <>
                      <img
                        src={avatarPreview}
                        alt="Agent avatar preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAvatarPreview(null);
                          if (avatarInputRef.current) avatarInputRef.current.value = "";
                        }}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-[var(--ink)]/70 text-white flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-5 w-5 text-[var(--ash)] mx-auto" />
                      <p className="text-[10px] text-[var(--ash)] mt-1">Upload</p>
                    </div>
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name */}
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="agent-name">Display name</Label>
                <Input
                  id="agent-name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Bloom Assistant"
                />
                <p className="text-[10px] text-[var(--ash)]">
                  This name appears when the agent sends messages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Tone ── */}
      <section>
        <SectionHeading
          icon={MessageSquare}
          title="Tone"
          description="The personality your agent conveys in conversations."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={cn(
                "text-left rounded-lg border p-4 transition-all duration-150",
                tone === t.id
                  ? "border-[var(--cedar)] bg-[var(--mist)] ring-1 ring-[var(--cedar)]/20"
                  : "border-[var(--slate)] bg-white hover:border-[var(--border-strong)]",
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    "text-sm font-semibold font-[family-name:var(--font-dm-sans)]",
                    tone === t.id ? "text-[var(--cedar)]" : "text-[var(--ink)]",
                  )}
                >
                  {t.label}
                </span>
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    tone === t.id
                      ? "border-[var(--cedar)] bg-[var(--cedar)]"
                      : "border-[var(--slate)]",
                  )}
                >
                  {tone === t.id && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <p className="text-xs text-[var(--ash)] mb-2">{t.description}</p>
              <p className="text-xs text-[var(--ink)] italic bg-white/60 rounded px-2 py-1.5 border border-[var(--border-subtle)]">
                &ldquo;{t.example}&rdquo;
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Greeting Message ── */}
      <section>
        <SectionHeading
          icon={MessageSquare}
          title="Greeting Message"
          description="First thing customers see. Use {'{business_name}'} to insert your business name."
        />
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="greeting">Greeting</Label>
              <Textarea
                id="greeting"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            </div>

            {/* Live preview */}
            <div className="rounded-lg border border-[var(--cedar)]/20 bg-[var(--mist)]/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cedar)] mb-2">
                Live preview
              </p>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cedar)] text-white text-xs font-semibold">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt=""
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    agentName.charAt(0)
                  )}
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-[var(--slate)] shadow-xs max-w-sm">
                  <p className="text-[10px] font-medium text-[var(--cedar)] mb-0.5">
                    {agentName}
                  </p>
                  <p className="text-sm text-[var(--ink)] leading-relaxed">
                    {renderedGreeting || (
                      <span className="text-[var(--text-placeholder)] italic">
                        Type a greeting above...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Sign-off */}
            <div className="space-y-1.5">
              <Label htmlFor="signoff">
                Sign-off message{" "}
                <span className="text-[var(--ash)] font-normal">(optional)</span>
              </Label>
              <Textarea
                id="signoff"
                value={signoff}
                onChange={(e) => setSignoff(e.target.value)}
                placeholder="e.g. Thanks for chatting! Have a great day."
                className="min-h-[60px] text-sm"
              />
            </div>

            {signoff && (
              <div className="rounded-lg border border-[var(--slate)] bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ash)] mb-2">
                  Sign-off preview
                </p>
                <p className="text-sm text-[var(--ink)]">
                  {renderedSignoff}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ── Preferences ── */}
      <section>
        <SectionHeading
          icon={Smile}
          title="Preferences"
          description="Fine-tune how your agent communicates."
        />
        <Card>
          <CardContent className="p-5 space-y-5">
            {/* Emoji toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow emoji in responses</Label>
                <p className="text-xs text-[var(--ash)]">
                  Agent may use emojis to convey tone.
                </p>
              </div>
              <Switch checked={emojiEnabled} onCheckedChange={setEmojiEnabled} />
            </div>

            <div className="h-px bg-[var(--border-subtle)]" />

            {/* Response length */}
            <div className="space-y-2">
              <Label>Response length</Label>
              <div className="grid grid-cols-2 gap-2">
                {responseLengths.map((rl) => (
                  <button
                    key={rl.id}
                    onClick={() => setResponseLength(rl.id)}
                    className={cn(
                      "text-left rounded-lg border p-3 transition-all duration-150",
                      responseLength === rl.id
                        ? "border-[var(--cedar)] bg-[var(--mist)] ring-1 ring-[var(--cedar)]/20"
                        : "border-[var(--slate)] bg-white hover:border-[var(--border-strong)]",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-sm font-medium font-[family-name:var(--font-dm-sans)]",
                          responseLength === rl.id
                            ? "text-[var(--cedar)]"
                            : "text-[var(--ink)]",
                        )}
                      >
                        {rl.label}
                      </span>
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors",
                          responseLength === rl.id
                            ? "border-[var(--cedar)] bg-[var(--cedar)]"
                            : "border-[var(--slate)]",
                        )}
                      >
                        {responseLength === rl.id && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[var(--ash)]">{rl.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Fallback Message ── */}
      <section>
        <SectionHeading
          icon={Globe}
          title="Fallback Message"
          description="What the agent says when it can't answer a question."
        />
        <Card>
          <CardContent className="p-5 space-y-3">
            <Textarea
              value={fallback}
              onChange={(e) => setFallback(e.target.value)}
              className="min-h-[80px] text-sm"
            />
            <p className="text-[10px] text-[var(--ash)]">
              Keep this helpful and reassuring — it's often the last thing a confused customer sees.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Banned Terms ── */}
      <section>
        <SectionHeading
          icon={Tags}
          title="Banned Terms"
          description="Words or phrases the agent will never use. Prevents inappropriate or off-brand language."
        />
        <Card>
          <CardContent className="p-5 space-y-3">
            {/* Tag list */}
            {bannedTerms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {bannedTerms.map((term) => (
                  <span
                    key={term}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--slate)] bg-[var(--linen)] px-2.5 py-1 text-xs font-medium text-[var(--ink)]"
                  >
                    {term}
                    <button
                      onClick={() => removeTerm(term)}
                      className="rounded p-0.5 hover:bg-hover-bg transition-colors"
                    >
                      <X className="h-3 w-3 text-[var(--ash)]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2">
              <Input
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                placeholder="Type a word or phrase, press Enter to add"
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTerm();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={addTerm}
                disabled={!termInput.trim() || bannedTerms.includes(termInput.trim().toLowerCase())}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
            <p className="text-[10px] text-[var(--ash)]">
              {bannedTerms.length} term{bannedTerms.length !== 1 ? "s" : ""} banned. The agent will
              rephrase rather than use these words.
            </p>
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
