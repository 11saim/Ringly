"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, FileJson, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { OnboardingData, FaqItem } from "./types";

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

interface FaqImportResult {
  successCount: number;
  failures: { index: number; reason: string }[];
}

function FaqBulkImportDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onImport: (items: Record<string, unknown>[]) => FaqImportResult;
}) {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState<FaqImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);

  const exampleJson = [
    { question: "What are your business hours?", answer: "We're open Monday to Saturday, 10am to 8pm." },
    { question: "Do you accept walk-ins?", answer: "Yes, walk-ins are welcome, but appointments are prioritized." },
  ];

  const handleImport = () => {
    setParseError(null);
    setResult(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setParseError("Invalid JSON. Please check the syntax and try again.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setParseError("Expected a JSON array. Please provide an array of objects.");
      return;
    }

    if (parsed.length === 0) {
      setParseError("The array is empty. Please add at least one FAQ.");
      return;
    }

    const importResult = onImport(parsed);
    setResult(importResult);

    if (importResult.failures.length === 0) {
      setTimeout(() => {
        setJsonInput("");
        setResult(null);
        onOpenChange(false);
      }, 1200);
    }
  };

  const handleClose = () => {
    setJsonInput("");
    setResult(null);
    setParseError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            Import FAQs from JSON
          </DialogTitle>
          <DialogDescription>
            Paste a JSON array of FAQ entries to add them all at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowExample(!showExample)}
            className="flex items-center gap-1.5 text-xs text-[var(--cedar)] hover:text-[var(--ink)] transition-colors"
          >
            {showExample ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            See example format
          </button>

          {showExample && (
            <pre className="rounded-md bg-[var(--linen)] border border-[var(--slate)] p-3 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)] overflow-x-auto max-h-40 overflow-y-auto">
              {JSON.stringify(exampleJson, null, 2)}
            </pre>
          )}

          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`Paste your JSON array here...\n\nExample:\n${JSON.stringify(exampleJson, null, 2)}`}
            className="min-h-[180px] font-[family-name:var(--font-jetbrains-mono)] text-xs"
          />

          {parseError && (
            <div className="rounded-md border border-[var(--ember)]/30 bg-[var(--ember)]/5 px-3 py-2.5">
              <p className="text-xs text-[var(--ember)]">{parseError}</p>
            </div>
          )}

          {result && (
            <div className="space-y-2">
              {result.successCount > 0 && (
                <div className="rounded-md border border-[var(--cedar)]/30 bg-[var(--mist)]/30 px-3 py-2.5">
                  <p className="text-xs text-[var(--cedar)] font-medium">
                    Successfully added {result.successCount} {result.successCount === 1 ? "FAQ" : "FAQs"}.
                  </p>
                </div>
              )}
              {result.failures.length > 0 && (
                <div className="rounded-md border border-[var(--ember)]/30 bg-[var(--ember)]/5 px-3 py-2.5 max-h-40 overflow-y-auto">
                  <p className="text-xs text-[var(--ember)] font-medium mb-1">
                    {result.failures.length} {result.failures.length === 1 ? "row" : "rows"} failed validation:
                  </p>
                  {result.failures.map((f) => (
                    <p key={f.index} className="text-[11px] text-[var(--ember)]/80">
                      Row {f.index + 1}: {f.reason}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            {result && result.failures.length === 0 ? "Close" : "Cancel"}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!jsonInput.trim() || (result !== null && result.failures.length === 0)}
            className="gap-1.5"
          >
            <FileJson className="h-3.5 w-3.5" />
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function StepKnowledgeBase({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData> | ((prev: OnboardingData) => Partial<OnboardingData>)) => void;
}) {
  const [pasteText, setPasteText] = useState("");
  const [pasteLabel, setPasteLabel] = useState("");
  const [faqImportOpen, setFaqImportOpen] = useState(false);

  function addFaq() {
    onChange({ faqs: [...data.faqs, { question: "", answer: "" }] });
  }

  function updateFaq(idx: number, patch: Partial<FaqItem>) {
    const next = [...data.faqs];
    next[idx] = { ...next[idx], ...patch };
    onChange({ faqs: next });
  }

  function removeFaq(idx: number) {
    onChange({ faqs: data.faqs.filter((_, i) => i !== idx) });
  }

  function handleFaqBulkImport(items: Record<string, unknown>[]): FaqImportResult {
    const successes: number[] = [];
    const failures: FaqImportResult["failures"] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item || typeof item !== "object") {
        failures.push({ index: i, reason: "Item is not an object" });
        continue;
      }

      if (typeof item.question !== "string" || !item.question.trim()) {
        failures.push({ index: i, reason: "Missing or invalid \"question\" (must be a non-empty string)" });
        continue;
      }

      if (typeof item.answer !== "string" || !item.answer.trim()) {
        failures.push({ index: i, reason: "Missing or invalid \"answer\" (must be a non-empty string)" });
        continue;
      }

      successes.push(i);
    }

    const newFaqs: FaqItem[] = successes.map((i) => {
      const item = items[i];
      return {
        question: (item.question as string).trim(),
        answer: (item.answer as string).trim(),
      };
    });
    onChange((prev) => ({ ...prev, faqs: [...prev.faqs, ...newFaqs] }));

    return { successCount: successes.length, failures };
  }

  function addPasteDocument() {
    if (!pasteText.trim()) return;
    onChange({
      documents: [
        ...data.documents,
        { sourceType: "paste", rawText: pasteText.trim() },
      ],
    });
    setPasteText("");
    setPasteLabel("");
  }

  function removeDocument(idx: number) {
    onChange({ documents: data.documents.filter((_, i) => i !== idx) });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
          Knowledge base
        </h2>
        <p className="text-sm text-[var(--ash)]">
          Help your agent answer questions accurately. Everything here is optional — you can add more later.
        </p>
      </div>

      {/* FAQs */}
      <div>
        <SectionHeading
          icon={BookOpen}
          title="FAQs"
          description="Common questions and answers your agent should know."
        />
        <div className="space-y-3">
          {data.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[var(--slate)] bg-white p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <Input
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, { question: e.target.value })}
                  className="h-8 text-xs"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 text-xs text-[var(--ember)]"
                  onClick={() => removeFaq(idx)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Textarea
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => updateFaq(idx, { answer: e.target.value })}
                className="min-h-[50px] text-xs"
              />
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setFaqImportOpen(true)}>
              <FileJson className="h-3.5 w-3.5" />
              Import JSON
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addFaq}>
              <Plus className="h-3.5 w-3.5" />
              Add FAQ
            </Button>
          </div>
        </div>
      </div>

      <FaqBulkImportDialog
        open={faqImportOpen}
        onOpenChange={setFaqImportOpen}
        onImport={handleFaqBulkImport}
      />

      <Separator />

      {/* Paste text documents */}
      <div>
        <SectionHeading
          icon={BookOpen}
          title="Documents"
          description="Paste text content (menus, policies, product info) for the agent to reference."
        />
        <div className="space-y-2">
          {data.documents.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-[var(--slate)] bg-white px-3 py-2"
            >
              <p className="text-xs text-[var(--ink)] truncate flex-1">
                {doc.rawText.slice(0, 60)}...
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 shrink-0 text-[10px] text-[var(--ember)]"
                onClick={() => removeDocument(idx)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Textarea
            placeholder="Paste document text here..."
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            className="min-h-[80px] text-xs"
          />
          {pasteText.trim() && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={addPasteDocument}
            >
              <Plus className="h-3.5 w-3.5" />
              Add document
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
