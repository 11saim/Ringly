"use client";

import { useRef, useState } from "react";
import {
  FileText,
  HelpCircle,
  Inbox,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

interface Document {
  id: string;
  name: string;
  type: "file" | "text";
  size?: string;
  status: "processed" | "pending" | "failed";
}

const initialFaqs: Faq[] = [
  { id: "f1", question: "What are your opening hours?", answer: "We're open Mon–Fri 9 AM – 6 PM, Sat 10 AM – 4 PM, and Sun 10 AM – 2 PM." },
  { id: "f2", question: "Do you accept walk-ins?", answer: "Yes, but appointments get priority. Walk-ins are served on a first-come basis." },
  { id: "f3", question: "How do I reschedule?", answer: "Just send us a message here or call us at least 24 hours before your appointment." },
];

const initialDocs: Document[] = [
  { id: "d1", name: "Service Menu 2026.pdf", type: "file", size: "245 KB", status: "processed" },
  { id: "d2", name: "Cancellation & Refund Policy", type: "text", status: "processed" },
  { id: "d3", name: "Staff bios and specializations", type: "text", status: "pending" },
  { id: "d4", name: "Product catalog.pdf", type: "file", size: "1.2 MB", status: "failed" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  processed: { label: "Processed", className: "bg-[var(--mist)] text-[var(--cedar)]" },
  pending: { label: "Pending", className: "bg-[var(--amber)]/10 text-[var(--amber)]" },
  failed: { label: "Failed", className: "bg-[var(--ember)]/10 text-[var(--ember)]" },
};

function SectionHeading({
  icon: Icon,
  title,
  description,
  hint,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--cedar)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          {title}
        </h3>
        <p className="text-xs text-[var(--ash)] mt-0.5">{description}</p>
        {hint && (
          <p className="text-[10px] text-[var(--cedar)] mt-1 italic">{hint}</p>
        )}
      </div>
    </div>
  );
}

export function KnowledgeBaseTab() {
  // FAQs
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  // Documents
  const [documents, setDocuments] = useState<Document[]>(initialDocs);
  const [pasteText, setPasteText] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Save state
  const [saving, setSaving] = useState(false);

  // ── FAQ actions ──

  const addFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setFaqs((prev) => [
      ...prev,
      { id: `f-${Date.now()}`, question: newQuestion.trim(), answer: newAnswer.trim() },
    ]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const startEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === editingId
          ? { ...f, question: editQuestion.trim(), answer: editAnswer.trim() }
          : f,
      ),
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // ── Document actions ──

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newDocs: Document[] = Array.from(files).map((file) => ({
      id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      type: "file" as const,
      size: file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "pending" as const,
    }));
    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const addPastedText = () => {
    if (!pasteText.trim()) return;
    setDocuments((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        name: pasteTitle.trim() || "Pasted text",
        type: "text",
        status: "pending",
      },
    ]);
    setPasteText("");
    setPasteTitle("");
  };

  const deleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* ── FAQs ── */}
      <section>
        <SectionHeading
          icon={HelpCircle}
          title="FAQs"
          description="Question/answer pairs the agent looks up directly. These are matched precisely when a customer asks a similar question."
          hint="Tip: Write questions the way customers actually ask them."
        />
        <Card>
          <CardContent className="p-5 space-y-0">
            {/* Existing FAQs */}
            {faqs.map((faq, i) => (
              <div key={faq.id}>
                {editingId === faq.id ? (
                  /* Edit mode */
                  <div className="py-3 space-y-2">
                    <Input
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      className="text-sm font-medium"
                      placeholder="Question"
                    />
                    <Textarea
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      className="text-sm min-h-[60px]"
                      placeholder="Answer"
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={saveEdit} disabled={!editQuestion.trim() || !editAnswer.trim()}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex items-start gap-3 py-3 group">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => startEdit(faq)}>
                      <p className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--cedar)] transition-colors">
                        {faq.question}
                      </p>
                      <p className="text-xs text-[var(--ash)] mt-0.5 line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-hover-bg transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                    </button>
                  </div>
                )}
                {i < faqs.length - 1 && <Separator />}
              </div>
            ))}

            {/* Add new FAQ */}
            <Separator className="mt-2" />
            <div className="pt-3 space-y-2">
              <p className="text-xs font-medium text-[var(--ash)] uppercase tracking-wider mb-2">
                Add new FAQ
              </p>
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Question"
                className="text-sm"
              />
              <Textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Answer"
                className="text-sm min-h-[60px]"
              />
              <Button
                size="sm"
                onClick={addFaq}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Documents ── */}
      <section>
        <SectionHeading
          icon={FileText}
          title="Documents"
          description="Reference documents the agent uses for broader, fuzzy questions. These are searched semantically — not exact-match like FAQs."
          hint="The agent searches these when no FAQ matches. Upload policy docs, menus, brochures, or paste freeform notes."
        />
        <Card>
          <CardContent className="p-5 space-y-5">
            {/* Upload area */}
            <div
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
                dragOver
                  ? "border-[var(--cedar)] bg-[var(--mist)]"
                  : "border-[var(--slate)] bg-[var(--linen)] hover:border-[var(--cedar)]",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload
                className={cn(
                  "h-6 w-6 mb-2",
                  dragOver ? "text-[var(--cedar)]" : "text-[var(--ash)]",
                )}
              />
              <p className="text-sm text-[var(--ink)] font-medium">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-[var(--ash)] mt-1">
                PDF, DOC, DOCX — up to 10 MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            {/* Paste text */}
            <div className="space-y-2">
              <Label htmlFor="paste-title">Or paste text content</Label>
              <Input
                id="paste-title"
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="Title (e.g. 'Staff Bios', 'Seasonal Menu')"
                className="text-sm"
              />
              <Textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste or type any text content the agent should know about..."
                className="text-sm min-h-[100px]"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={addPastedText}
                disabled={!pasteText.trim()}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add text source
              </Button>
            </div>

            {/* Document list */}
            {documents.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-[var(--ash)] uppercase tracking-wider mb-3">
                    Sources ({documents.length})
                  </p>
                  <div className="space-y-2">
                    {documents.map((doc) => {
                      const status = statusConfig[doc.status];
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-md border border-[var(--slate)] bg-white px-3 py-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[var(--linen)]">
                              {doc.type === "file" ? (
                                <FileText className="h-4 w-4 text-[var(--ash)]" />
                              ) : (
                                <Inbox className="h-4 w-4 text-[var(--ash)]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[var(--ink)] truncate">
                                {doc.name}
                              </p>
                              <p className="text-[10px] text-[var(--ash)]">
                                {doc.type === "file" ? doc.size : "Text content"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant="outline"
                              className={cn("text-[10px] border-0", status.className)}
                            >
                              {status.label}
                            </Badge>
                            <button
                              onClick={() => deleteDoc(doc.id)}
                              className="p-1 rounded hover:bg-hover-bg transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
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
