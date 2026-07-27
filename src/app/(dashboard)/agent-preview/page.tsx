"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Calendar,
  ChevronDown,
  Flag,
  RotateCcw,
  Send,
  Settings2,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ── Types ──

type ContextType = "service" | "product";

interface ChatMessage {
  id: string;
  sender: "customer" | "agent";
  text: string;
  time: string;
  flag?: { tab: string; label: string };
}

// ── Canned responses by context + keyword matching ──

const serviceResponses: { keywords: string[]; reply: string; flag: { tab: string; label: string } }[] = [
  {
    keywords: ["book", "appointment", "schedule", "available", "slot"],
    reply: "I'd be happy to help you book an appointment! We have availability tomorrow at 10 AM, 2 PM, and 4 PM. Which time works best for you?",
    flag: { tab: "offerings", label: "Offerings tab" },
  },
  {
    keywords: ["price", "cost", "how much", "rate"],
    reply: "Our services range from $15 for a basic haircut to $120 for balayage. Would you like me to walk you through the full menu?",
    flag: { tab: "offerings", label: "Offerings tab" },
  },
  {
    keywords: ["cancel", "reschedule", "change"],
    reply: "No problem — I can cancel or reschedule that for you. Could you let me know the date of the appointment you'd like to change?",
    flag: { tab: "policies", label: "Policies tab" },
  },
  {
    keywords: ["staff", "who", "stylist", "therapist"],
    reply: "Our team includes Sarah (colour specialist), Ali (cuts & styling), Maria (facials & skin), and Priya (nails). Would you like to book with a specific team member?",
    flag: { tab: "profile", label: "Profile tab" },
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    reply: "Hey there! Welcome to Bloom Studio. I'm your virtual assistant — I can help you book appointments, check prices, or answer questions about our services. What can I do for you?",
    flag: { tab: "persona", label: "Persona tab" },
  },
  {
    keywords: ["thank", "thanks", "bye", "goodbye"],
    reply: "You're welcome! If you need anything else, just drop me a message anytime. Have a wonderful day! 💛",
    flag: { tab: "persona", label: "Persona tab" },
  },
];

const productResponses: { keywords: string[]; reply: string; flag: { tab: string; label: string } }[] = [
  {
    keywords: ["order", "buy", "purchase", "shop"],
    reply: "Great choice! I can help you place an order. Which products are you interested in? I'll check stock and get everything set up for you.",
    flag: { tab: "offerings", label: "Offerings tab" },
  },
  {
    keywords: ["stock", "available", "in stock", "out of stock"],
    reply: "Let me check that for you. Our Vitamin C Serum and Keratin Shampoo are currently in stock. The Coconut Oil Mask is running low — would you like me to reserve one?",
    flag: { tab: "offerings", label: "Offerings tab" },
  },
  {
    keywords: ["price", "cost", "how much", "discount"],
    reply: "Our products range from $14 for pomades to $34 for serums. We're also running a 15% off promotion on all hair care this week!",
    flag: { tab: "offerings", label: "Offerings tab" },
  },
  {
    keywords: ["delivery", "shipping", "when", "track"],
    reply: "Orders are typically processed within 24 hours. You'll receive a tracking link via WhatsApp once it's dispatched. Is there a specific order you'd like to check on?",
    flag: { tab: "policies", label: "Policies tab" },
  },
  {
    keywords: ["return", "refund", "exchange"],
    reply: "We offer returns within 14 days of purchase for unopened items. Could you tell me more about what you'd like to return?",
    flag: { tab: "policies", label: "Policies tab" },
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    reply: "Hey there! Welcome to Bloom Studio. I'm your virtual shopping assistant — I can help you find products, check stock, or place orders. What are you looking for today?",
    flag: { tab: "persona", label: "Persona tab" },
  },
  {
    keywords: ["thank", "thanks", "bye", "goodbye"],
    reply: "You're welcome! If you need anything else, I'm always here. Happy shopping! 💛",
    flag: { tab: "persona", label: "Persona tab" },
  },
];

const defaultServiceReply = {
  reply: "Thanks for your message! I can help you with bookings, pricing, or any questions about our services. Could you tell me a bit more about what you're looking for?",
  flag: { tab: "knowledge", label: "Knowledge Base tab" },
};

const defaultProductReply = {
  reply: "Thanks for your message! I can help you with product info, stock availability, or placing an order. Could you tell me a bit more about what you need?",
  flag: { tab: "knowledge", label: "Knowledge Base tab" },
};

function getAgentResponse(input: string, context: ContextType) {
  const lower = input.toLowerCase();
  const responses = context === "service" ? serviceResponses : productResponses;
  for (const r of responses) {
    if (r.keywords.some((kw) => lower.includes(kw))) {
      return { reply: r.reply, flag: r.flag };
    }
  }
  return context === "service" ? defaultServiceReply : defaultProductReply;
}

// ── Component ──

export default function AgentPreviewPage() {
  const [context, setContext] = useState<ContextType>("service");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Initial greeting on context change
  useEffect(() => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const greeting: ChatMessage = {
      id: `greet-${context}`,
      sender: "agent",
      text:
        context === "service"
          ? "Hey there! Welcome to Bloom Studio. I'm your virtual assistant — I can help you book appointments, check prices, or answer questions about our services. What can I do for you?"
          : "Hey there! Welcome to Bloom Studio. I'm your virtual shopping assistant — I can help you find products, check stock, or place orders. What are you looking for today?",
      time,
      flag: { tab: "persona", label: "Persona tab" },
    };
    setMessages([greeting]);
  }, [context]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "customer",
      text: input.trim(),
      time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate agent typing delay
    setTimeout(() => {
      const { reply, flag } = getAgentResponse(userMsg.text, context);
      const agentTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "agent",
        text: reply,
        time: agentTime,
        flag,
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleReset = () => {
    setMessages([]);
    setIsTyping(false);
    // Re-trigger greeting
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    setTimeout(() => {
      const greeting: ChatMessage = {
        id: `greet-reset-${Date.now()}`,
        sender: "agent",
        text:
          context === "service"
            ? "Hey there! Welcome to Bloom Studio. I'm your virtual assistant — I can help you book appointments, check prices, or answer questions about our services. What can I do for you?"
            : "Hey there! Welcome to Bloom Studio. I'm your virtual shopping assistant — I can help you find products, check stock, or place orders. What are you looking for today?",
        time,
        flag: { tab: "persona", label: "Persona tab" },
      };
      setMessages([greeting]);
    }, 100);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          Agent Preview
        </h1>
        <p className="text-sm text-[var(--ash)] mt-1">
          Test how your agent responds to customer messages in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        {/* ── Chat Widget ── */}
        <Card className="flex flex-col h-[calc(100vh-12rem)]">
          <CardContent className="flex flex-col h-full p-0">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-[var(--slate)] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--mist)] text-[var(--cedar)]">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                    Bloom Studio Agent
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--cedar)] animate-agent-pulse" />
                    <span className="text-[10px] text-[var(--cedar)] font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset conversation
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => {
                const isAgent = msg.sender === "agent";
                const isCustomer = msg.sender === "customer";

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      isCustomer ? "justify-start" : "justify-end",
                    )}
                  >
                    <div className="max-w-[75%] group">
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2",
                          isCustomer &&
                            "bg-white border border-[var(--slate)] text-[var(--ink)]",
                          isAgent &&
                            "bg-[var(--cedar)] text-white",
                        )}
                      >
                        {isAgent && (
                          <div className="flex items-center gap-1 mb-1">
                            <Bot className="h-3 w-3 opacity-70" />
                            <span className="text-[10px] opacity-70 font-medium">
                              Agent
                            </span>
                          </div>
                        )}
                        {isCustomer && (
                          <div className="flex items-center gap-1 mb-1">
                            <User className="h-3 w-3 text-[var(--ash)]" />
                            <span className="text-[10px] text-[var(--ash)] font-medium">
                              You (simulated customer)
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

                      {/* Flag action — agent messages only */}
                      {isAgent && msg.flag && (
                        <div className="mt-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/settings?tab=${msg.flag.tab}`}
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-[var(--ash)] hover:text-[var(--cedar)] hover:bg-[var(--mist)] transition-colors"
                          >
                            <Flag className="h-2.5 w-2.5" />
                            Flag this response
                            <span className="text-[var(--ash)]">→</span>
                            <span className="font-medium">{msg.flag.label}</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-end">
                  <div className="bg-[var(--cedar)] text-white rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Bot className="h-3 w-3 opacity-70" />
                      <span className="text-[10px] opacity-70 font-medium">
                        Agent
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce [animation-delay:0ms]" />
                      <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[var(--slate)] bg-white px-4 py-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    context === "service"
                      ? "Try: 'I want to book an appointment' or 'How much is a haircut?'"
                      : "Try: 'Do you have the Vitamin C Serum?' or 'I want to place an order'"
                  }
                  className="min-h-[40px] max-h-[120px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Sidebar Controls ── */}
        <div className="space-y-4">
          {/* Context toggle */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-[var(--ash)]" />
                <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--ash)]">
                  Agent context
                </Label>
              </div>
              <p className="text-[10px] text-[var(--ash)]">
                Toggle between business types to test different agent personas
                and responses.
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setContext("service")}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                    context === "service"
                      ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                      : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
                  )}
                >
                  <Calendar className="h-3.5 w-3.5 inline mr-1.5" />
                  Service
                </button>
                <button
                  onClick={() => setContext("product")}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                    context === "product"
                      ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                      : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
                  )}
                >
                  <Tag className="h-3.5 w-3.5 inline mr-1.5" />
                  Product
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Quick prompts */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--ash)]" />
                <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--ash)]">
                  Quick prompts
                </Label>
              </div>
              <div className="space-y-1.5">
                {(context === "service"
                  ? [
                      "Hi, how are you?",
                      "I want to book an appointment",
                      "How much is a balayage?",
                      "Can I cancel my booking?",
                      "Who's your best stylist?",
                    ]
                  : [
                      "Hi, how are you?",
                      "Do you have the Vitamin C Serum in stock?",
                      "How much is the keratin shampoo?",
                      "I want to place an order",
                      "What's your return policy?",
                    ]
                ).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className="w-full text-left rounded-md border border-[var(--slate)] px-3 py-2 text-xs text-[var(--ink)] hover:border-[var(--cedar)] hover:bg-[var(--mist)] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-[var(--ash)]" />
                <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--ash)]">
                  How this works
                </Label>
              </div>
              <div className="space-y-2 text-[11px] text-[var(--ash)] leading-relaxed">
                <p>
                  This preview simulates a WhatsApp conversation with your AI
                  agent using your current settings.
                </p>
                <p>
                  Each agent response has a{" "}
                  <span className="inline-flex items-center gap-0.5 text-[var(--cedar)] font-medium">
                    <Flag className="h-2.5 w-2.5" /> Flag
                  </span>{" "}
                  link — hover over the message to see which Settings tab would
                  let you adjust that response.
                </p>
                <p>
                  In production, the agent will use your real Knowledge Base,
                  Persona, and Offerings data to generate responses.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
