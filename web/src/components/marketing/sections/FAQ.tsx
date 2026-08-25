"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do I need a new WhatsApp number?",
    a: "No. Ringly connects to your existing WhatsApp Business number via the Meta Cloud API. Your customers don't need to change anything — they keep messaging the same number they always have.",
  },
  {
    q: "Will the AI get my prices and availability right?",
    a: "Yes. Unlike generic chatbots that guess from PDFs, Ringly uses a structured three-layer model. Your prices, availability, and policies are stored in a real database and queried directly. The AI never hallucinates transactional data.",
  },
  {
    q: "What happens when the AI can't handle something?",
    a: "The agent automatically detects when confidence is low, when a customer explicitly asks for a human, or when a conversation involves complaints. It silently hands off to your staff with full context, then resumes after the issue is resolved.",
  },
  {
    q: "Does it support Roman Urdu and mixed languages?",
    a: "Yes. Ringly natively handles Urdu, Roman Urdu, and English — including code-switching within the same message. This is a core feature, not an afterthought.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses are live within 10-15 minutes. You answer a few questions about your business, connect your WhatsApp number, and test your agent in a sandbox before going live.",
  },
  {
    q: "Can I customize the AI's behavior?",
    a: "Absolutely. You can set the tone (formal/casual), configure discount limits, define cancellation policies, set escalation triggers, and edit the agent's knowledge at any time — all through a simple dashboard, no code required.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 sm:py-28 px-5 sm:px-6" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <div
          className="text-center mb-14 sm:mb-16"
        >
          <h2 id="faq-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-slate-500">
            Everything you need to know about getting started.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3" role="list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden"
              role="listitem"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left transition-colors hover:bg-slate-50/50"
              >
                <span className="text-[14px] sm:text-[15px] font-semibold text-[#0F172A]">{faq.q}</span>
                <div
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                </div>
              </button>

              {openIndex === i && (
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                >
                  <div className="px-5 sm:px-6 pb-4 sm:pb-5 text-sm text-slate-500 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
