"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Bot,
  Clock,
  FileText,
  Hand,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ── Types ──

type ConversationMode = "agent" | "human" | "resolved";

interface DbConversation {
  id: string;
  contact_id: string;
  status: "agent" | "human" | "resolved";
  started_at: string;
  last_message_at: string;
  handed_off_at: string | null;
  contacts: { name: string | null; phone: string; first_contact_at: string }[] | null;
}

interface DbMessage {
  id: string;
  conversation_id: string;
  sender_type: "customer" | "agent" | "human_staff";
  content: string;
  is_internal_note: boolean;
  created_at: string;
}

interface InboxMessage {
  id: string;
  sender: "agent" | "customer" | "human";
  text: string;
  time: string;
  status?: "sending" | "sent" | "failed";
}

interface DisplayConversation {
  id: string;
  contact_id: string;
  contact: string;
  phone: string;
  initials: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  mode: ConversationMode;
  messages: InboxMessage[];
  notes: string[];
  firstContactAt: string;
}

// ── Helpers ──

const modeConfig: Record<
  ConversationMode,
  { label: string; className: string; dotClass: string }
> = {
  agent: {
    label: "Agent handling",
    className: "bg-[var(--mist)] text-[var(--cedar)]",
    dotClass: "bg-[var(--cedar)]",
  },
  human: {
    label: "Human handling",
    className: "bg-[var(--amber)]/10 text-[var(--amber)]",
    dotClass: "bg-[var(--amber)]",
  },
  resolved: {
    label: "Resolved",
    className: "bg-[var(--linen)] text-[var(--ash)]",
    dotClass: "bg-[var(--ash)]",
  },
};

function deriveInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function mapSenderType(
  senderType: "customer" | "agent" | "human_staff",
): "customer" | "agent" | "human" {
  if (senderType === "human_staff") return "human";
  return senderType;
}

function buildDisplayConversation(
  conv: DbConversation,
  messages: DbMessage[],
): DisplayConversation {
  const contact = Array.isArray(conv.contacts) ? conv.contacts[0] : conv.contacts;
  const name = contact?.name ?? "Unknown";
  const phone = contact?.phone ?? "";

  const regularMsgs = messages
    .filter((m) => !m.is_internal_note)
    .map((m) => ({
      id: m.id,
      sender: mapSenderType(m.sender_type),
      text: m.content,
      time: formatTime(m.created_at),
    }));

  const notes = messages
    .filter((m) => m.is_internal_note)
    .map((m) => m.content);

  const sorted = [...messages].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const lastNonInternal = sorted.find((m) => !m.is_internal_note);

  const lastSender = lastNonInternal?.sender_type;
  const unread = lastSender === "customer";

  return {
    id: conv.id,
    contact_id: conv.contact_id,
    contact: name,
    phone,
    initials: deriveInitials(name),
    lastMessage: lastNonInternal?.content ?? "No messages yet",
    lastTime: conv.last_message_at
      ? formatRelativeTime(conv.last_message_at)
      : "",
    unread,
    mode: conv.status,
    messages: regularMsgs,
    notes,
    firstContactAt: (Array.isArray(conv.contacts) ? conv.contacts[0] : conv.contacts)?.first_contact_at ?? conv.started_at,
  };
}

// ── Component ──

export default function InboxPage() {
  const supabase = useMemo(() => createClient(), []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<DisplayConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  // ── Fetch conversations + messages ──

  const fetchConversations = useCallback(async () => {
    setLoading(true);

    const [convResult, msgResult] = await Promise.all([
      supabase
        .from("conversations")
        .select(
          "id, contact_id, status, started_at, last_message_at, handed_off_at, contacts(name, phone, first_contact_at)",
        )
        .order("last_message_at", { ascending: false }),
      supabase
        .from("messages")
        .select("id, conversation_id, sender_type, content, is_internal_note, created_at")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const dbConvs = (convResult.data ?? []) as DbConversation[];
    const dbMsgs = (msgResult.data ?? []) as DbMessage[];

    const msgsByConv: Record<string, DbMessage[]> = {};
    for (const m of dbMsgs) {
      if (!msgsByConv[m.conversation_id]) msgsByConv[m.conversation_id] = [];
      msgsByConv[m.conversation_id].push(m);
    }

    setConversations(
      dbConvs.map((conv) =>
        buildDisplayConversation(conv, msgsByConv[conv.id] ?? []),
      ),
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConversations();
  }, [fetchConversations]);

  // ── Fetch messages for selected conversation ──

  const fetchMessages = useCallback(
    async (convId: string) => {
      const { data } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_type, content, is_internal_note, created_at")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      const dbMsgs = (data ?? []) as DbMessage[];

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const regularMsgs = dbMsgs
            .filter((m) => !m.is_internal_note)
            .map((m) => ({
              id: m.id,
              sender: mapSenderType(m.sender_type),
              text: m.content,
              time: formatTime(m.created_at),
            }));
          const notes = dbMsgs
            .filter((m) => m.is_internal_note)
            .map((m) => m.content);
          return { ...c, messages: regularMsgs, notes };
        }),
      );
    },
    [supabase],
  );

  // ── Realtime subscriptions ──

  useEffect(() => {
    if (!selectedId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages(selectedId);

    // Subscribe to new messages in the open conversation
    const msgChannel = supabase
      .channel(`inbox-messages-${selectedId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          const msg = payload.new as DbMessage;

          // Dedupe: skip if this message already exists (e.g. from optimistic insert)
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== selectedId) return c;
              if (c.messages.some((m) => m.id === msg.id)) return c;

              if (msg.is_internal_note) {
                return { ...c, notes: [...c.notes, msg.content] };
              }
              return {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: msg.id,
                    sender: mapSenderType(msg.sender_type),
                    text: msg.content,
                    time: formatTime(msg.created_at),
                    status: "sent" as const,
                  },
                ],
                lastMessage: msg.content,
                lastTime: "Just now",
              };
            }),
          );
        },
      )
      .subscribe();

    // Subscribe to conversation updates (last_message_at, status changes)
    const convChannel = supabase
      .channel("inbox-conversations")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          const updated = payload.new as DbConversation;
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== updated.id) return c;
              return {
                ...c,
                mode: updated.status,
                lastTime: updated.last_message_at
                  ? formatRelativeTime(updated.last_message_at)
                  : c.lastTime,
              };
            }),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
        },
        () => {
          // New conversation — refetch the full list
          void fetchConversations();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(convChannel);
    };
  }, [selectedId, supabase, fetchMessages, fetchConversations]);

  // ── Auto-scroll on new messages ──

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  // ── Handlers ──

  const handleTakeOver = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("conversations")
        .update({
          status: "human",
          handed_off_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) return;

      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, mode: "human" as const } : c,
        ),
      );
    },
    [supabase],
  );

  const handleHandBack = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("conversations")
        .update({ status: "agent", handed_off_at: null })
        .eq("id", id);

      if (error) return;

      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, mode: "agent" as const } : c,
        ),
      );
    },
    [supabase],
  );

  const handleSendReply = useCallback(async () => {
    if (!selected || !replyText.trim()) return;
    const text = replyText.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic: add message to UI immediately
    const optimisticMsg: InboxMessage = {
      id: tempId,
      sender: "human",
      text,
      time: "Just now",
      status: "sending",
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, optimisticMsg], lastMessage: text, lastTime: "Just now" }
          : c,
      ),
    );
    setReplyText("");

    // Background: call API route
    let res: Response;
    try {
      res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selected.id, text }),
      });
    } catch {
      // Network error — mark as failed
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selected.id
            ? { ...c, messages: c.messages.map((m) => m.id === tempId ? { ...m, status: "failed" as const } : m) }
            : c,
        ),
      );
      return;
    }

    const body = await res.json().catch(() => null);

    if (!res.ok || !body?.ok) {
      console.error(
        "[Inbox] Send failed:",
        body?.error ?? body?.warning ?? `HTTP ${res.status}`,
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selected.id
            ? { ...c, messages: c.messages.map((m) => m.id === tempId ? { ...m, status: "failed" as const } : m) }
            : c,
        ),
      );
      return;
    }

    if (body.warning) {
      console.warn("[Inbox] Send partial:", body.warning);
    }

    // Replace temp ID with real message ID from server
    const realId = body.messageId as string;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: c.messages.map((m) => m.id === tempId ? { ...m, id: realId, status: "sent" as const } : m) }
          : c,
      ),
    );
  }, [selected, replyText]);

  const handleAddNote = useCallback(async () => {
    if (!selected || !noteText.trim()) return;
    const text = noteText.trim();

    const { error } = await supabase.from("messages").insert({
      conversation_id: selected.id,
      sender_type: "human_staff",
      content: text,
      is_internal_note: true,
    });

    if (error) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, notes: [...c.notes, text] } : c,
      ),
    );
    setNoteText("");
  }, [selected, noteText, supabase]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-6">
      {/* ── Conversation List ── */}
      <div
        className={cn(
          "flex flex-col border-r border-[var(--slate)] bg-white",
          "w-full md:w-[340px] md:min-w-[340px]",
          selectedId && "hidden md:flex",
        )}
      >
        {/* List header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--slate)]">
          <h2 className="text-sm font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
            Inbox
          </h2>
          <Badge variant="secondary" className="text-[10px]">
            {conversations.filter((c) => c.unread).length} unread
          </Badge>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-[var(--linen)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-[var(--linen)] rounded" />
                    <div className="h-2.5 w-40 bg-[var(--linen)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--linen)]">
                <Clock className="h-5 w-5 text-[var(--ash)]" />
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--ink)]">
                No conversations yet
              </p>
              <p className="mt-1 text-xs text-[var(--ash)] text-center max-w-[220px]">
                Conversations will appear here as customers start messaging
                your WhatsApp number.
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const mode = modeConfig[conv.mode];
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 transition-colors duration-100",
                    "border-b border-[var(--border-subtle)]",
                    selectedId === conv.id
                      ? "bg-[var(--mist)]"
                      : "hover:bg-hover-bg",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)] text-sm font-semibold font-[family-name:var(--font-dm-sans)]">
                        {conv.initials}
                      </div>
                      {conv.unread && (
                        <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[var(--cedar)] border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm truncate",
                            conv.unread
                              ? "font-semibold text-[var(--ink)]"
                              : "font-medium text-[var(--ink)]",
                          )}
                        >
                          {conv.contact}
                        </span>
                        <span className="text-[10px] text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)] shrink-0">
                          {conv.lastTime}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--ash)] truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                      <div className="mt-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
                            mode.className,
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              mode.dotClass,
                            )}
                          />
                          {mode.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Chat Thread + Info Panel ── */}
      {selected ? (
        <div className="flex flex-1 min-w-0">
          {/* Main chat area */}
          <div className="flex flex-1 flex-col min-w-0 bg-[var(--parchment)]">
            {/* Thread header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--slate)] bg-white">
              <div className="flex items-center gap-3">
                {/* Back button — mobile only */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="md:hidden p-1 -ml-1 rounded-md hover:bg-hover-bg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-[var(--ink)]" />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)] text-xs font-semibold font-[family-name:var(--font-dm-sans)]">
                  {selected.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {selected.contact}
                  </p>
                  <p className="text-[10px] text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">
                    {selected.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.mode === "agent" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTakeOver(selected.id)}
                    className="gap-1.5 text-xs"
                  >
                    <Hand className="h-3.5 w-3.5" />
                    Take over
                  </Button>
                ) : selected.mode === "human" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleHandBack(selected.id)}
                    className="gap-1.5 text-xs"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    Hand back to agent
                  </Button>
                ) : null}
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    showInfo
                      ? "bg-[var(--mist)] text-[var(--cedar)]"
                      : "hover:bg-hover-bg text-[var(--ash)]",
                  )}
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {selected.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-sm text-[var(--ash)]">No messages yet.</p>
                </div>
              )}
              {selected.messages.map((msg) => {
                const isAgent = msg.sender === "agent";
                const isHuman = msg.sender === "human";
                const isCustomer = msg.sender === "customer";
                const isFailed = msg.status === "failed";
                const isSending = msg.status === "sending";

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      isCustomer ? "justify-start" : "justify-end",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2",
                        isCustomer &&
                          "bg-white border border-[var(--slate)] text-[var(--ink)]",
                        isAgent && "bg-[var(--cedar)] text-white",
                        isHuman && !isFailed && "bg-[var(--ink)] text-white",
                        isFailed && "bg-[var(--ink)]/80 text-white opacity-70 border border-[var(--ember)]/40",
                        isSending && "bg-[var(--ink)]/80 text-white opacity-60",
                      )}
                    >
                      {/* Sender label */}
                      {(isAgent || isHuman) && (
                        <div className="flex items-center gap-1 mb-1">
                          {isAgent ? (
                            <Bot className="h-3 w-3 opacity-70" />
                          ) : (
                            <User className="h-3 w-3 opacity-70" />
                          )}
                          <span className="text-[10px] opacity-70 font-medium">
                            {isAgent ? "Agent" : "You"}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <p
                          className={cn(
                            "text-[10px] font-[family-name:var(--font-jetbrains-mono)]",
                            isCustomer ? "text-[var(--ash)]" : "opacity-60",
                          )}
                        >
                          {msg.time}
                        </p>
                        {isFailed && (
                          <span className="text-[10px] text-[var(--ember)] font-medium">
                            Failed to send
                          </span>
                        )}
                        {isSending && (
                          <span className="h-2.5 w-2.5 rounded-full border border-white/40 border-t-white/80 animate-spin" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div className="border-t border-[var(--slate)] bg-white px-4 py-3">
              {selected.mode === "human" ? (
                <div className="flex items-end gap-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="min-h-[40px] max-h-[120px] resize-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="h-10 w-10 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-[var(--ash)]">
                  <Hand className="h-3.5 w-3.5" />
                  Take over this conversation to reply manually
                </div>
              )}
            </div>
          </div>

          {/* ── Customer Info Side Panel ── */}
          {showInfo && (
            <div className="w-[280px] border-l border-[var(--slate)] bg-white flex flex-col overflow-y-auto shrink-0 hidden lg:flex">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--slate)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ash)]">
                  Contact
                </span>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1 rounded-md hover:bg-hover-bg transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-[var(--ash)]" />
                </button>
              </div>

              {/* Avatar + name */}
              <div className="px-4 py-5 text-center border-b border-[var(--slate)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)] text-lg font-semibold font-[family-name:var(--font-dm-sans)] mx-auto">
                  {selected.initials}
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                  {selected.contact}
                </p>
                <p className="text-xs text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)] mt-0.5">
                  {selected.phone}
                </p>
              </div>

              {/* Info rows */}
              <div className="px-4 py-3 space-y-3 border-b border-[var(--slate)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--ash)]">Status</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
                      modeConfig[selected.mode].className,
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", modeConfig[selected.mode].dotClass)} />
                    {modeConfig[selected.mode].label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--ash)]">Messages</span>
                  <span className="text-xs font-medium text-[var(--ink)] font-[family-name:var(--font-jetbrains-mono)]">
                    {selected.messages.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--ash)]">First contact</span>
                  <span className="text-xs text-[var(--ink)]">
                    {new Date(selected.firstContactAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Link to contacts */}
              <div className="px-4 py-3 border-b border-[var(--slate)]">
                <Link
                  href={`/contacts`}
                  className="flex items-center gap-2 text-xs text-[var(--cedar)] hover:text-[var(--forest)] transition-colors"
                >
                  View full contact profile →
                </Link>
              </div>

              {/* Internal notes */}
              <div className="flex-1 px-4 py-3">
                <div className="flex items-center gap-1.5 mb-3">
                  <FileText className="h-3.5 w-3.5 text-[var(--ash)]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ash)]">
                    Internal Notes
                  </span>
                </div>

                {/* Existing notes */}
                {selected.notes.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {selected.notes.map((note, i) => (
                      <div
                        key={i}
                        className="rounded-md bg-amber/5 border border-amber/10 px-3 py-2"
                      >
                        <p className="text-xs text-[var(--ink)] leading-relaxed">{note}</p>
                        <p className="text-[10px] text-[var(--ash)] mt-1 font-[family-name:var(--font-jetbrains-mono)]">
                          Pinned note
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add note */}
                <div className="space-y-2">
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add an internal note..."
                    className="min-h-[60px] resize-none text-xs bg-amber/5 border-amber/10 placeholder:text-amber/30"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                    className="w-full text-xs"
                  >
                    Add note
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty state — no conversation selected */
        <div className="hidden md:flex flex-1 items-center justify-center bg-[var(--parchment)]">
          <div className="text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--linen)] mx-auto">
              <Clock className="h-5 w-5 text-[var(--ash)]" />
            </div>
            <p className="mt-3 text-sm text-[var(--ash)]">Select a conversation</p>
          </div>
        </div>
      )}
    </div>
  );
}
