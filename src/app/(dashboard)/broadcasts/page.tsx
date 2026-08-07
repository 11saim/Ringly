"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCheck,
  Clock,
  Eye,
  Info,
  MessageSquare,
  Send,
  SendHorizonal,
  Trash2,
  Users,
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
import { Skeleton } from "@/components/ui/skeleton";
import { mockTemplates } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ── Helpers ──

const audienceOptions = [
  { label: "All contacts", count: 0 },
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

// ── Types ──

interface DbBroadcast {
  id: string;
  message_template: string;
  scheduled_at: string | null;
  sent_at: string | null;
  status: "draft" | "scheduled" | "sent";
  created_at: string;
}

interface DisplayBroadcast {
  id: string;
  message: string;
  template: string | null;
  audience: string;
  audienceSize: number;
  sentAt: string;
  delivered: number;
  read: number;
  status: "sent" | "scheduled" | "draft";
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

// ── Loading Skeleton ──

function BroadcastsSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="mb-6">
        <Skeleton className="h-7 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <section className="mb-8">
        <Skeleton className="h-10 w-full mb-4" />
        <Card>
          <CardContent className="p-5 space-y-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </section>
      <section>
        <Skeleton className="h-10 w-full mb-4" />
        <Card>
          <CardContent className="p-5">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// ── Main Page ──

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<DisplayBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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

  const fetchBroadcasts = useCallback(async () => {
    const supabase = createClient();

    // Fetch contact count for "All contacts" audience
    const { count } = await supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("is_blocked", false);

    audienceOptions[0].count = count ?? 0;

    // Fetch broadcasts with recipient counts
    const { data: bcRows } = await supabase
      .from("broadcasts")
      .select("id, message_template, scheduled_at, sent_at, status, created_at")
      .order("created_at", { ascending: false });

    if (!bcRows || bcRows.length === 0) {
      setBroadcasts([]);
      setLoading(false);
      return;
    }

    const bcIds = bcRows.map((b) => b.id);

    // Fetch recipient counts per broadcast
    const { data: recipientRows } = await supabase
      .from("broadcast_recipients")
      .select("broadcast_id, delivered, read")
      .in("broadcast_id", bcIds);

    // Aggregate counts
    const deliveredMap: Record<string, number> = {};
    const readMap: Record<string, number> = {};
    for (const r of recipientRows ?? []) {
      if (r.delivered) deliveredMap[r.broadcast_id] = (deliveredMap[r.broadcast_id] ?? 0) + 1;
      if (r.read) readMap[r.broadcast_id] = (readMap[r.broadcast_id] ?? 0) + 1;
    }

    // Fetch recipient counts per broadcast for audienceSize
    const recipientCountMap: Record<string, number> = {};
    for (const r of recipientRows ?? []) {
      recipientCountMap[r.broadcast_id] = (recipientCountMap[r.broadcast_id] ?? 0) + 1;
    }

    const rows = bcRows as DbBroadcast[];
    setBroadcasts(
      rows.map((b) => ({
        id: b.id,
        message: b.message_template,
        template: null,
        audience: "All contacts",
        audienceSize: recipientCountMap[b.id] ?? 0,
        sentAt: b.sent_at ?? b.scheduled_at ?? b.created_at,
        delivered: deliveredMap[b.id] ?? 0,
        read: readMap[b.id] ?? 0,
        status: b.status as "sent" | "scheduled" | "draft",
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBroadcasts();
  }, [fetchBroadcasts]);

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((b) => {
      if (statusFilter === "all") return true;
      return b.status === statusFilter;
    });
  }, [broadcasts, statusFilter]);

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

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);

    const supabase = createClient();
    const now = new Date().toISOString();
    const scheduledAt = sendNow
      ? null
      : new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();
    const status = sendNow ? "sent" : "scheduled";

    // Insert broadcast row
    const { data: bcData, error: bcError } = await supabase
      .from("broadcasts")
      .insert({
        message_template: message.trim(),
        scheduled_at: scheduledAt,
        sent_at: sendNow ? now : null,
        status,
      })
      .select("id, message_template, scheduled_at, sent_at, status, created_at")
      .single();

    if (bcError || !bcData) {
      setSending(false);
      return;
    }

    // Fetch all non-blocked contact IDs
    const { data: contactRows } = await supabase
      .from("contacts")
      .select("id")
      .eq("is_blocked", false);

    // Insert broadcast_recipients for each contact
    if (contactRows && contactRows.length > 0) {
      const recipients = contactRows.map((c) => ({
        broadcast_id: bcData.id,
        contact_id: c.id,
        delivered: false,
        read: false,
      }));

      await supabase.from("broadcast_recipients").insert(recipients);
    }

    // Update local state
    const newBroadcast: DisplayBroadcast = {
      id: bcData.id,
      message: bcData.message_template,
      template:
        selectedTemplate !== "none"
          ? mockTemplates.find((t) => t.id === selectedTemplate)?.name ?? null
          : null,
      audience: "All contacts",
      audienceSize: contactRows?.length ?? 0,
      sentAt: bcData.sent_at ?? bcData.scheduled_at ?? bcData.created_at,
      delivered: 0,
      read: 0,
      status: bcData.status as "sent" | "scheduled" | "draft",
    };
    setBroadcasts((prev) => [newBroadcast, ...prev]);
    setMessage("");
    setSelectedTemplate("none");
    setAudience("All contacts");
    setSendNow(true);
    setScheduleDate("");
    setScheduleTime("10:00");
    setSending(false);
  };

  const deleteBroadcast = async (id: string) => {
    const supabase = createClient();
    await supabase.from("broadcast_recipients").delete().eq("broadcast_id", id);
    await supabase.from("broadcasts").delete().eq("id", id);
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <BroadcastsSkeleton />;

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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--ash)] bg-[var(--linen)] rounded-md px-2 py-1">
                  <Info className="h-3 w-3" />
                  <span>WhatsApp sending not yet live</span>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                  className="gap-1.5"
                >
                  {sending ? (
                    "Sending..."
                  ) : sendNow ? (
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
