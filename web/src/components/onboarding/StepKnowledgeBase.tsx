"use client";

import { useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function StepKnowledgeBase({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  const [pasteText, setPasteText] = useState("");
  const [pasteLabel, setPasteLabel] = useState("");

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
          <Button variant="outline" size="sm" className="gap-1.5" onClick={addFaq}>
            <Plus className="h-3.5 w-3.5" />
            Add FAQ
          </Button>
        </div>
      </div>

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
