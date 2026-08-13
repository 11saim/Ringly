"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  FileText,
  HelpCircle,
  Inbox,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

interface Document {
  id: string;
  name: string;
  source_type: "upload" | "paste";
  status: "processed" | "pending" | "failed";
  file_url?: string | null;
  signedUrl?: string | null;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error: string | null;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const statusConfig: Record<string, { label: string; className: string }> = {
  processed: {
    label: "Processed",
    className: "bg-[var(--mist)] text-[var(--cedar)]",
  },
  pending: {
    label: "Pending",
    className: "bg-[var(--amber)]/10 text-[var(--amber)]",
  },
  failed: {
    label: "Failed",
    className: "bg-[var(--ember)]/10 text-[var(--ember)]",
  },
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

function validateFile(file: File): string | null {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
    return `"${file.name}" is not a supported file type. Please upload PDF, DOC, or DOCX.`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `"${file.name}" exceeds the ${MAX_SIZE_MB} MB size limit.`;
  }
  return null;
}

export function KnowledgeBaseTab() {
  const [loading, setLoading] = useState(true);

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const [documents, setDocuments] = useState<Document[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: faqRows } = await supabase
      .from("kb_faqs")
      .select("id, question, answer")
      .eq("tenant_id", user.id);

    if (faqRows) setFaqs(faqRows);

    const { data: docRows } = await supabase
      .from("kb_documents")
      .select("id, source_type, status, name, created_at, file_url")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false });

    if (docRows) {
      const docs: Document[] = docRows.map((d) => ({
        id: d.id,
        name: d.name || (d.source_type === "paste" ? "Pasted text" : "Untitled"),
        source_type: d.source_type as "upload" | "paste",
        status: d.status as "processed" | "pending" | "failed",
        file_url: d.file_url,
      }));

      const docsWithUrls = await Promise.all(
        docs.map(async (doc) => {
          if (doc.source_type === "upload" && doc.file_url) {
            const { data } = await supabase.storage
              .from("kb-documents")
              .createSignedUrl(doc.file_url, 3600);
            return { ...doc, signedUrl: data?.signedUrl ?? null };
          }
          return doc;
        }),
      );

      setDocuments(docsWithUrls);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  // ── FAQ actions ──

  const addFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: newFaq } = await supabase
      .from("kb_faqs")
      .insert({
        tenant_id: user.id,
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      })
      .select()
      .single();

    if (newFaq) {
      setFaqs((prev) => [...prev, newFaq]);
    }
    setNewQuestion("");
    setNewAnswer("");
  };

  const startEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const supabase = createClient();
    await supabase
      .from("kb_faqs")
      .update({
        question: editQuestion.trim(),
        answer: editAnswer.trim(),
      })
      .eq("id", editingId);

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

  const deleteFaq = async (id: string) => {
    const supabase = createClient();
    await supabase.from("kb_faqs").delete().eq("id", id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // ── Document actions ──

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUploadError(null);
    const fileList = Array.from(files);

    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of fileList) {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    if (validationErrors.length > 0) {
      setUploadError(validationErrors.join(" "));
    }

    for (const file of validFiles) {
      const uploadId = crypto.randomUUID();
      const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
      const storagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

      setUploadingFiles((prev) => [
        ...prev,
        { id: uploadId, name: file.name, progress: 0, error: null },
      ]);

      const { error: uploadErr } = await supabase.storage
        .from("kb-documents")
        .upload(storagePath, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadErr) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadId
              ? { ...f, error: uploadErr.message || "Upload failed", progress: -1 }
              : f,
          ),
        );
        continue;
      }

      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === uploadId ? { ...f, progress: 100 } : f)),
      );

      const { data: newDoc } = await supabase
        .from("kb_documents")
        .insert({
          tenant_id: user.id,
          source_type: "upload",
          file_url: storagePath,
          name: file.name,
          status: "pending",
        })
        .select()
        .single();

      if (newDoc) {
        const { data: urlData } = await supabase.storage
          .from("kb-documents")
          .createSignedUrl(storagePath, 3600);

        setDocuments((prev) => [
          ...prev,
          {
            id: newDoc.id,
            name: newDoc.name || file.name,
            source_type: "upload",
            status: "pending",
            file_url: storagePath,
            signedUrl: urlData?.signedUrl ?? null,
          },
        ]);
      }

      setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    void addFiles(e.dataTransfer.files);
  };

  const addPastedText = async () => {
    if (!pasteText.trim()) return;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: newDoc } = await supabase
      .from("kb_documents")
      .insert({
        tenant_id: user.id,
        source_type: "paste",
        raw_text: pasteText,
        name: pasteTitle.trim() || "Pasted text",
        status: "pending",
      })
      .select()
      .single();

    if (newDoc) {
      setDocuments((prev) => [
        ...prev,
        {
          id: newDoc.id,
          name: newDoc.name || "Pasted text",
          source_type: "paste",
          status: "pending",
        },
      ]);
    }
    setPasteText("");
    setPasteTitle("");
  };

  const deleteDoc = async (doc: Document) => {
    const supabase = createClient();

    if (doc.source_type === "upload" && doc.file_url) {
      await supabase.storage.from("kb-documents").remove([doc.file_url]);
    }

    await supabase.from("kb_documents").delete().eq("id", doc.id);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-5 w-5 text-[var(--ash)] animate-spin" />
      </div>
    );
  }

  const isUploading = uploadingFiles.length > 0;

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
            {faqs.map((faq, i) => (
              <div key={faq.id}>
                {editingId === faq.id ? (
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
                      <Button
                        size="sm"
                        onClick={() => void saveEdit()}
                        disabled={
                          !editQuestion.trim() || !editAnswer.trim()
                        }
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 py-3 group">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => startEdit(faq)}
                    >
                      <p className="text-sm font-medium text-[var(--ink)] group-hover:text-[var(--cedar)] transition-colors">
                        {faq.question}
                      </p>
                      <p className="text-xs text-[var(--ash)] mt-0.5 line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                    <button
                      onClick={() => void deleteFaq(faq.id)}
                      className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-hover-bg transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                    </button>
                  </div>
                )}
                {i < faqs.length - 1 && <Separator />}
              </div>
            ))}

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
                onClick={() => void addFaq()}
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
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 mb-2 text-[var(--cedar)] animate-spin" />
              ) : (
                <Upload
                  className={cn(
                    "h-6 w-6 mb-2",
                    dragOver ? "text-[var(--cedar)]" : "text-[var(--ash)]",
                  )}
                />
              )}
              <p className="text-sm text-[var(--ink)] font-medium">
                {isUploading ? "Uploading files..." : "Drop files here or click to upload"}
              </p>
              <p className="text-xs text-[var(--ash)] mt-1">
                PDF, DOC, DOCX — up to {MAX_SIZE_MB} MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => void addFiles(e.target.files)}
              />
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="flex items-start gap-2 rounded-md border border-[var(--ember)]/30 bg-[var(--ember)]/5 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-[var(--ember)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--ember)]">{uploadError}</p>
              </div>
            )}

            {/* In-progress uploads */}
            {uploadingFiles.length > 0 && (
              <div className="space-y-2">
                {uploadingFiles.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 rounded-md border border-[var(--cedar)]/20 bg-[var(--mist)]/30 px-3 py-2.5"
                  >
                    <Loader2 className="h-4 w-4 text-[var(--cedar)] animate-spin shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)] truncate">
                        {f.name}
                      </p>
                      {f.error ? (
                        <p className="text-[10px] text-[var(--ember)]">{f.error}</p>
                      ) : (
                        <div className="mt-1.5 h-1 w-full rounded-full bg-[var(--slate)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--cedar)] transition-all duration-300"
                            style={{ width: f.progress >= 0 ? `${f.progress}%` : "100%" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                onClick={() => void addPastedText()}
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
                              {doc.source_type === "upload" ? (
                                <FileText className="h-4 w-4 text-[var(--ash)]" />
                              ) : (
                                <Inbox className="h-4 w-4 text-[var(--ash)]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              {doc.source_type === "upload" && doc.signedUrl ? (
                                <a
                                  href={doc.signedUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-[var(--ink)] truncate hover:text-[var(--cedar)] transition-colors block"
                                >
                                  {doc.name}
                                </a>
                              ) : (
                                <p className="text-sm font-medium text-[var(--ink)] truncate">
                                  {doc.name}
                                </p>
                              )}
                              <p className="text-[10px] text-[var(--ash)]">
                                {doc.source_type === "upload"
                                  ? "File upload"
                                  : "Text content"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] border-0",
                                status.className,
                              )}
                            >
                              {status.label}
                            </Badge>
                            <button
                              onClick={() => void deleteDoc(doc)}
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
          <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
