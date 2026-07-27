"use client";

import { useMemo, useState } from "react";
import {
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Edit,
  Eye,
  Filter,
  MessageSquare,
  Plus,
  Send,
  SendHorizonal,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  mockBroadcasts,
  mockTemplates,
  type Broadcast,
} from "@/lib/data";
import { cn } from "@/lib/utils";

// ── Helpers ──

const audienceOptions = [
  { label: "All contacts", count: 142 },
  { label: "VIP", count: 18 },
  { label: "Regular", count: 56 },
  { label: "New", count: 12 },
  { label: "Corporate", count: 8 },
];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ── Section Heading ──

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

// ── Main Page ──

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState(mockBroadcasts);

  // ── Compose state ──
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("none");
  const [audience, setAudience] = useState("All contacts");
  const [sendNow, setSendNow] = useState(true);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  // ── History state ──
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((b) => {
      if (statusFilter === "all") return true;
      return b.status === statusFilter;
    });
  }, [broadcasts, statusFilter]);

  const templateBody =
    selectedTemplate !== "none"
      ? mockTemplates.find((t) => t.id === selectedTemplate)?.body ?? ""
      : "";

  const applyTemplate = (templateId: string) => {
    if (templateId === "none") {
      setSelectedTemplate("none");
      return;
    }
    const tpl = mockTemplates.find((t) => t.id === templateId);
    if (tpl) {
      setSelectedTemplate(templateId);
      setMessage(tpl.body);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const aud = audienceOptions.find((a) => a.label === audience);
    const newBroadcast: Broadcast = {
      id: `bc-${Date.now()}`,
      message: message.trim(),
      template:
        selectedTemplate !== "none"
          ? mockTemplates.find((t) => t.id === selectedTemplate)?.name ?? null
          : null,
      audience,
      audienceSize: aud?.count ?? 0,
      sentAt: sendNow
        ? new Date().toISOString()
        : new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString(),
      delivered: 0,
      read: 0,
      status: sendNow ? "sent" : "scheduled",
    };
    setBroadcasts((prev) => [newBroadcast, ...prev]);
    setMessage("");
    setSelectedTemplate("none");
    setAudience("All contacts");
    setSendNow(true);
    setScheduleDate("");
    setScheduleTime("10:00");
  };

  const deleteBroadcast = (id: string) =>
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          Broadcasts
        </h1>
        <p className="text-sm text-[var(--ash)] mt-1">
          Send messages and promotions to your customers on WhatsApp.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          COMPOSE PANEL
          ══════════════════════════════════════════════════════════════════════ */}

      <section className="mb-8">
        <SectionHeading
          icon={SendHorizonal}
          title="Compose broadcast"
          description="Create a new message to send to your audience."
        />

        <Card>
          <CardContent className="p-5 space-y-5">
            {/* Template selector */}
            <div className="space-y-1.5">
              <Label>Message template</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedTemplate}
                  onValueChange={applyTemplate}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No template</SelectItem>
                    {mockTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate !== "none" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewTemplate(selectedTemplate)}
                    className="gap-1 h-9 text-xs shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>
                )}
              </div>
              {selectedTemplate !== "none" && (
                <p className="text-[10px] text-[var(--ash)]">
                  Template body loaded — edit the message below to customise it.
                </p>
              )}
            </div>

            {/* Message textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Message</Label>
                <span
                  className={cn(
                    "text-[10px] font-[family-name:var(--font-jetbrains-mono)]",
                    message.length > 1000
                      ? "text-[var(--ember)]"
                      : "text-[var(--ash)]",
                  )}
                >
                  {message.length}/1000
                </span>
              </div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your broadcast message here... Use {customer_name} for personalisation."
                className="min-h-[140px] text-sm"
              />
              <p className="text-[10px] text-[var(--ash)]">
                Use placeholders:{" "}
                <code className="font-[family-name:var(--font-jetbrains-mono)] bg-[var(--linen)] px-1 py-0.5 rounded">
                  {"{customer_name}"}
                </code>
                ,{" "}
                <code className="font-[family-name:var(--font-jetbrains-mono)] bg-[var(--linen)] px-1 py-0.5 rounded">
                  {"{business_name}"}
                </code>
              </p>
            </div>

            <Separator />

            {/* Audience selector */}
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audienceOptions.map((a) => (
                    <SelectItem key={a.label} value={a.label}>
                      {a.label}
                      <span className="text-[var(--ash)] ml-1.5">
                        ({a.count})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {audienceOptions.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => setAudience(a.label)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      audience === a.label
                        ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                        : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
                    )}
                  >
                    {a.label}
                    <span className="ml-1 opacity-60">{a.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Schedule */}
            <div className="space-y-3">
              <Label>When to send</Label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={sendNow}
                    onChange={() => setSendNow(true)}
                    className="accent-[var(--cedar)]"
                  />
                  <span className="text-sm text-[var(--ink)]">Send now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!sendNow}
                    onChange={() => setSendNow(false)}
                    className="accent-[var(--cedar)]"
                  />
                  <span className="text-sm text-[var(--ink)]">Schedule</span>
                </label>
              </div>
              {!sendNow && (
                <div className="flex items-end gap-3 animate-fade-in">
                  <div className="space-y-1.5">
                    <Label className="text-[10px]">Date</Label>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-[160px] text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px]">Time</Label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-[120px] text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Send button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[var(--ash)]">
                <Users className="h-3.5 w-3.5" />
                <span>
                  Will reach{" "}
                  <span className="font-semibold text-[var(--ink)]">
                    {audienceOptions.find((a) => a.label === audience)?.count ??
                      0}
                  </span>{" "}
                  contacts
                </span>
              </div>
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className="gap-1.5"
              >
                {sendNow ? (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send now
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5" />
                    Schedule
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SENT HISTORY
          ══════════════════════════════════════════════════════════════════════ */}

      <section>
        <SectionHeading
          icon={MessageSquare}
          title="Broadcast history"
          description="Review past and upcoming broadcasts."
        />

        {/* Status filter */}
        <div className="flex gap-1.5 mb-4">
          {(["all", "sent", "scheduled", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                statusFilter === s
                  ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                  : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="p-5">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Message</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="text-right">Delivered</TableHead>
                  <TableHead className="text-right">Read</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBroadcasts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)]">
                          <MessageSquare className="h-5 w-5 text-[var(--ash)]" />
                        </div>
                        <p className="text-sm font-medium text-[var(--ink)]">
                          {statusFilter !== "all"
                            ? `No ${statusFilter} broadcasts.`
                            : "No broadcasts sent yet."}
                        </p>
                        <p className="text-xs text-[var(--ash)] max-w-[260px]">
                          {statusFilter !== "all"
                            ? "Try a different filter or send your first broadcast."
                            : "Your first broadcast will appear here once it's sent or scheduled."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBroadcasts.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <p className="text-sm text-[var(--ink)] line-clamp-2 leading-snug">
                          {b.message}
                        </p>
                        {b.template && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] mt-1"
                          >
                            {b.template}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[var(--ink)]">
                          {b.audience}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                          {b.audienceSize}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-[var(--ink)]">
                          {formatDateTime(b.sentAt)}
                        </div>
                        <div className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-[var(--ash)]">
                          {formatTime(b.sentAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {b.status === "sent" ? (
                          <div className="flex items-center justify-end gap-1">
                            <Check className="h-3 w-3 text-[var(--cedar)]" />
                            <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                              {b.delivered}
                            </span>
                            <span className="text-[10px] text-[var(--ash)]">
                             /{b.audienceSize}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-[var(--ash)]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {b.status === "sent" ? (
                          <div className="flex items-center justify-end gap-1">
                            <CheckCheck className="h-3 w-3 text-[var(--cedar)]" />
                            <span className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                              {b.read}
                            </span>
                            <span className="text-[10px] text-[var(--ash)]">
                             /{b.audienceSize}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-[var(--ash)]">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] capitalize",
                            b.status === "sent" &&
                              "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]",
                            b.status === "scheduled" &&
                              "border-[var(--amber)] bg-[var(--amber)]/10 text-[var(--amber)]",
                            b.status === "draft" &&
                              "border-[var(--slate)] bg-[var(--linen)] text-[var(--ash)]",
                          )}
                        >
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => deleteBroadcast(b.id)}
                          className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TEMPLATE PREVIEW DIALOG
          ══════════════════════════════════════════════════════════════════════ */}

      <Dialog
        open={!!previewTemplate}
        onOpenChange={(v) => {
          if (!v) setPreviewTemplate(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Template preview</DialogTitle>
            <DialogDescription>
              This is how the template will appear before personalisation.
            </DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="rounded-lg bg-[var(--linen)] p-4 text-sm text-[var(--ink)] leading-relaxed whitespace-pre-wrap">
              {mockTemplates.find((t) => t.id === previewTemplate)?.body}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setPreviewTemplate(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
