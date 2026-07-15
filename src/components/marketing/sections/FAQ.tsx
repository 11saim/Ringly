"use client";

import { motion, AnimatePresence } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 sm:mb-16"
        >
          <h2 id="faq-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-4 leading-[1.15]">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-slate-500">
            Everything you need to know about getting started.
          </p>
        </motion.div>

        <div className="space-y-2.5 sm:space-y-3" role="list">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
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
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-5 sm:px-6 pb-4 sm:pb-5 text-sm text-slate-500 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
