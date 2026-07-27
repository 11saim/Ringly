"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mockConversations, type Conversation, type ConversationMode } from "@/lib/data";
import { cn } from "@/lib/utils";

const modeConfig: Record<ConversationMode, { label: string; className: string; dotClass: string }> = {
  agent: { label: "Agent handling", className: "bg-[var(--mist)] text-[var(--cedar)]", dotClass: "bg-[var(--cedar)]" },
  human: { label: "Human handling", className: "bg-[var(--amber)]/10 text-[var(--amber)]", dotClass: "bg-[var(--amber)]" },
  resolved: { label: "Resolved", className: "bg-[var(--linen)] text-[var(--ash)]", dotClass: "bg-[var(--ash)]" },
};

export default function InboxPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>("c1");
  const [showInfo, setShowInfo] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  const handleTakeOver = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mode: "human" as const } : c)),
    );
  };

  const handleHandBack = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mode: "agent" as const } : c)),
    );
  };

  const handleSendReply = () => {
    if (!selected || !replyText.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "human" as const,
      text: replyText.trim(),
      time: "Just now",
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, lastTime: "Just now" }
          : c,
      ),
    );
    setReplyText("");
  };

  const handleAddNote = () => {
    if (!selected || !noteText.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, notes: [...c.notes, noteText.trim()] }
          : c,
      ),
    );
    setNoteText("");
  };

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
            {conversations.filter((c) => c.unread > 0).length} unread
          </Badge>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
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
                    {conv.unread > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[var(--cedar)] border-2 border-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm truncate",
                          conv.unread > 0
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
                        <span className={cn("h-1.5 w-1.5 rounded-full", mode.dotClass)} />
                        {mode.label}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
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
                  <p className="text-sm font-medium text-[var(--ink)]">{selected.contact}</p>
                  <p className="text-[10px] text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">{selected.phone}</p>
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
                    showInfo ? "bg-[var(--mist)] text-[var(--cedar)]" : "hover:bg-hover-bg text-[var(--ash)]",
                  )}
                >
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {selected.messages.map((msg) => {
                const isAgent = msg.sender === "agent";
                const isHuman = msg.sender === "human";
                const isCustomer = msg.sender === "customer";

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
                        isCustomer && "bg-white border border-[var(--slate)] text-[var(--ink)]",
                        isAgent && "bg-[var(--cedar)] text-white",
                        isHuman && "bg-[var(--ink)] text-white",
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
                      <p
                        className={cn(
                          "text-[10px] mt-1 font-[family-name:var(--font-jetbrains-mono)]",
                          isCustomer ? "text-[var(--ash)]" : "opacity-60",
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
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
                  <span className="text-xs text-[var(--ink)]">Today</span>
                </div>
              </div>

              {/* Link to contacts */}
              <div className="px-4 py-3 border-b border-[var(--slate)]">
                <Link
                  href="/contacts"
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
