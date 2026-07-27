"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Clock,
  FileText,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Shield,
  ShieldOff,
  Tag,
  User,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { mockContacts, type Contact } from "@/lib/data";
import { cn } from "@/lib/utils";

const tagColors: Record<string, string> = {
  Regular: "bg-[var(--mist)] text-[var(--cedar)]",
  VIP: "bg-[var(--amber)]/10 text-[var(--amber)]",
  New: "bg-[var(--linen)] text-[var(--ash)]",
  Corporate: "bg-[var(--ink)]/5 text-[var(--ink)]",
  Blocked: "bg-[var(--ember)]/10 text-[var(--ember)]",
};

const allTags = ["Regular", "VIP", "New", "Corporate", "Blocked"];

export default function ContactsPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState(mockContacts);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);
      const matchesTag = !tagFilter || c.tags.includes(tagFilter);
      return matchesSearch && matchesTag;
    });
  }, [contacts, search, tagFilter]);

  const toggleBlock = (id: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              blocked: !c.blocked,
              tags: c.blocked
                ? c.tags.filter((t) => t !== "Blocked")
                : [...c.tags, "Blocked"],
            }
          : c,
      ),
    );
    // Update selected if open
    setSelectedContact((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            blocked: !prev.blocked,
            tags: prev.blocked
              ? prev.tags.filter((t) => t !== "Blocked")
              : [...prev.tags, "Blocked"],
          }
        : prev,
    );
  };

  const addNote = () => {
    if (!selectedContact || !noteInput.trim()) return;
    const note = noteInput.trim();
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id
          ? { ...c, notes: [...c.notes, note] }
          : c,
      ),
    );
    setSelectedContact((prev) =>
      prev ? { ...prev, notes: [...prev.notes, note] } : prev,
    );
    setNoteInput("");
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <>
          <div>
            <Skeleton className="h-7 w-24 mb-2" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
          <Card>
            <CardContent className="p-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--slate)] last:border-0">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <div className="ml-auto text-right">
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
      <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
            Contacts
          </h1>
          <p className="mt-1 text-sm text-[var(--ash)]">
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ash)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                tagFilter === tag
                  ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                  : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
              )}
            >
              <Tag className="h-3 w-3" />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>First Contact</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Spend / Bookings</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)]">
                        <Users className="h-5 w-5 text-[var(--ash)]" />
                      </div>
                      <p className="text-sm font-medium text-[var(--ink)]">
                        {search || tagFilter
                          ? "No contacts match your search."
                          : "Your contact list is empty."}
                      </p>
                      <p className="text-xs text-[var(--ash)] max-w-[240px]">
                        {search || tagFilter
                          ? "Try adjusting your search or clearing the tag filter."
                          : "Contacts will appear here as customers reach out on WhatsApp."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className={cn(
                      "cursor-pointer",
                      c.blocked && "opacity-50",
                    )}
                    onClick={() => setSelectedContact(c)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)] text-xs font-semibold font-[family-name:var(--font-dm-sans)]">
                          {c.initials}
                        </div>
                        <span className="font-medium text-[var(--ink)]">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-[var(--ash)]">
                      {c.phone}
                    </TableCell>
                    <TableCell className="text-xs text-[var(--ash)]">
                      {c.firstContact}
                    </TableCell>
                    <TableCell className="text-xs text-[var(--ash)]">
                      {c.lastContact}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={cn(
                              "text-[10px] border-0",
                              tagColors[tag] || "bg-[var(--linen)] text-[var(--ash)]",
                            )}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="text-sm font-medium font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                          ${c.totalSpend}
                        </p>
                        <p className="text-[10px] text-[var(--ash)]">
                          {c.bookingCount} booking{c.bookingCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBlock(c.id);
                        }}
                        className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                        title={c.blocked ? "Unblock" : "Block"}
                      >
                        {c.blocked ? (
                          <ShieldOff className="h-3.5 w-3.5 text-[var(--ember)]" />
                        ) : (
                          <Shield className="h-3.5 w-3.5 text-[var(--ash)]" />
                        )}
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

      {/* ── Contact Detail Sheet ── */}
      <Sheet open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
          {selectedContact && (
            <>
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-[var(--slate)] px-6 py-4">
                <SheetHeader className="space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)] text-base font-semibold font-[family-name:var(--font-dm-sans)]">
                      {selectedContact.initials}
                    </div>
                    <div className="flex-1">
                      <SheetTitle className="text-base font-[family-name:var(--font-dm-sans)]">
                        {selectedContact.name}
                      </SheetTitle>
                      <p className="text-xs text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">
                        {selectedContact.phone}
                      </p>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              <div className="px-6 py-4 space-y-6">
                {/* Tags + Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContact.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={cn(
                          "text-[10px] border-0",
                          tagColors[tag] || "bg-[var(--linen)] text-[var(--ash)]",
                        )}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/inbox?id=${selectedContact.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-[var(--cedar)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--forest)] transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Message
                    </Link>
                    <Button
                      size="sm"
                      variant={selectedContact.blocked ? "outline" : "destructive"}
                      onClick={() => toggleBlock(selectedContact.id)}
                      className="gap-1.5 text-xs"
                    >
                      {selectedContact.blocked ? (
                        <>
                          <ShieldOff className="h-3.5 w-3.5" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Shield className="h-3.5 w-3.5" />
                          Block
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                    <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                      ${selectedContact.totalSpend}
                    </p>
                    <p className="text-[10px] text-[var(--ash)]">Total spend</p>
                  </div>
                  <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                    <p className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                      {selectedContact.bookingCount}
                    </p>
                    <p className="text-[10px] text-[var(--ash)]">Bookings</p>
                  </div>
                  <div className="rounded-md bg-[var(--linen)] px-3 py-2 text-center">
                    <p className="text-xs font-medium text-[var(--ink)]">
                      {selectedContact.firstContact}
                    </p>
                    <p className="text-[10px] text-[var(--ash)]">First contact</p>
                  </div>
                </div>

                <Separator />

                {/* Chat History */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-[var(--cedar)]" />
                    <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                      Chat History
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {selectedContact.chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex",
                          msg.sender === "customer" ? "justify-start" : "justify-end",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-lg px-3 py-2",
                            msg.sender === "customer" && "bg-[var(--linen)] text-[var(--ink)]",
                            msg.sender === "agent" && "bg-[var(--cedar)] text-white",
                            msg.sender === "human" && "bg-[var(--ink)] text-white",
                          )}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            {msg.sender === "agent" && <Bot className="h-3 w-3 opacity-70" />}
                            {msg.sender === "human" && <User className="h-3 w-3 opacity-70" />}
                            <span className="text-[10px] opacity-70 capitalize">{msg.sender}</span>
                          </div>
                          <p className="text-xs leading-relaxed">{msg.text}</p>
                          <p className="text-[10px] mt-0.5 opacity-50 font-[family-name:var(--font-jetbrains-mono)]">
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    {selectedContact.chatHistory.length === 0 && (
                      <p className="text-xs text-[var(--ash)] text-center py-4">No messages yet.</p>
                    )}
                  </div>
                </section>

                <Separator />

                {/* Booking History */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-[var(--cedar)]" />
                    <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                      Booking History
                    </h3>
                  </div>
                  {selectedContact.bookingHistory.length > 0 ? (
                    <div className="space-y-2">
                      {selectedContact.bookingHistory.map((b, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md border border-[var(--slate)] bg-white px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-[var(--ink)]">{b.service}</p>
                            <p className="text-[10px] text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">
                              {b.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                              ${b.amount}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] border-0",
                                b.status === "Completed"
                                  ? "bg-[var(--mist)] text-[var(--cedar)]"
                                  : b.status === "Confirmed"
                                    ? "bg-[var(--mist)] text-[var(--cedar)]"
                                    : "bg-amber/10 text-[var(--amber)]",
                              )}
                            >
                              {b.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--ash)] text-center py-4">No bookings yet.</p>
                  )}
                </section>

                <Separator />

                {/* Staff Notes */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-[var(--cedar)]" />
                    <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                      Staff Notes
                    </h3>
                  </div>
                  {selectedContact.notes.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {selectedContact.notes.map((note, i) => (
                        <div
                          key={i}
                          className="rounded-md bg-[var(--amber)]/5 border border-[var(--amber)]/10 px-3 py-2"
                        >
                          <p className="text-xs text-[var(--ink)] leading-relaxed">{note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add a staff note..."
                      className="min-h-[60px] resize-none text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={addNote}
                      disabled={!noteInput.trim()}
                      className="shrink-0 h-9"
                    >
                      Add
                    </Button>
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      </>
      )}
    </div>
  );
}
