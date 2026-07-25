"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Brain, ChevronDown,
  RotateCcw, Send, User, CreditCard, Package,
  Calendar, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations } from "@/lib/inbox-data";

interface AIPanelProps {
  conversationId: string | null;
}

type TabType = "copilot" | "insights";

export function AIPanel({ conversationId }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("copilot");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const conversation = conversations.find((c) => c.id === conversationId);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-background">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-muted mb-4">
            <Sparkles size={22} strokeWidth={1.2} className="text-muted-foreground/30" />
          </div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">AI Assistant</h3>
          <p className="text-[12px] text-muted-foreground/45 leading-relaxed max-w-[200px]">
            Select a conversation to see AI insights and suggestions.
          </p>
        </div>
      </div>
    );
  }

  const sentimentColor = {
    positive: "text-accent",
    neutral: "text-muted-foreground",
    negative: "text-destructive",
  }[conversation.sentiment];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Tabs */}
      <div className="flex border-b border-border/40 px-3 bg-card/40 shrink-0">
        {([
          { id: "copilot" as TabType, label: "Copilot", icon: Sparkles },
          { id: "insights" as TabType, label: "Insights", icon: Brain },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-3 text-[11px] font-medium transition-colors duration-150",
              activeTab === id ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground",
            )}
          >
            <Icon size={12} strokeWidth={1.5} />
            {label}
            {activeTab === id && (
              <motion.div
                layoutId="ai-tab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-premium">
        <AnimatePresence mode="wait">
          {/* COPILOT TAB */}
          {activeTab === "copilot" && (
            <motion.div
              key="copilot"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-4"
            >
              {/* Suggested Reply */}
              <div className="rounded-[14px] border border-border/40 bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-primary-light/10">
                    <Sparkles size={10} strokeWidth={1.5} className="text-primary-light" />
                  </div>
                  <span className="text-[12px] font-semibold text-foreground">Suggested Reply</span>
                </div>
                <p className="text-[12px] text-foreground/60 leading-relaxed bg-muted/30 rounded-[10px] p-3 border border-border/15">
                  Hi Ahmed! Your appointment is confirmed for tomorrow at 10:00 AM for Balayage + Deep Conditioning. Total: $480. See you there!
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    className="flex items-center gap-1.5 rounded-[8px] bg-accent px-3 py-1.5 text-[11px] font-semibold text-white transition-all duration-150 hover:bg-accent-hover"
                  >
                    <Send size={10} strokeWidth={2} />
                    Apply
                  </button>
                  <button
                    className="flex items-center gap-1.5 rounded-[8px] bg-muted px-3 py-1.5 text-[11px] font-medium text-foreground/60 transition-all duration-150 hover:bg-muted/80 border border-border/20"
                  >
                    <RotateCcw size={10} strokeWidth={1.5} />
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Intent & Sentiment */}
              <div className="rounded-[14px] border border-border/30 bg-card overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-border/20">
                  <div className="p-3">
                    <span className="text-[9px] text-muted-foreground/50 font-medium uppercase tracking-wider block mb-1">Intent</span>
                    <p className="text-[12px] font-semibold text-foreground truncate">{conversation.intent}</p>
                  </div>
                  <div className="p-3">
                    <span className="text-[9px] text-muted-foreground/50 font-medium uppercase tracking-wider block mb-1">Sentiment</span>
                    <p className={cn("text-[12px] font-semibold capitalize", sentimentColor)}>
                      {conversation.sentiment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">Quick Actions</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { icon: ExternalLink, label: "Open KB", color: "text-info", bg: "bg-info/8" },
                    { icon: User, label: "Assign Human", color: "text-amber-500", bg: "bg-amber-500/8" },
                  ].map(({ icon: Icon, label, color, bg }) => (
                    <button
                      key={label}
                      className={cn(
                        "flex items-center gap-2 rounded-[10px] border border-border/30 bg-card px-3 py-2.5 text-left transition-all duration-150",
                        "hover:border-border/50 hover:bg-hover-bg/50",
                      )}
                    >
                      <div className={cn("flex h-6 w-6 items-center justify-center rounded-[6px]", bg)}>
                        <Icon size={12} strokeWidth={1.5} className={color} />
                      </div>
                      <span className="text-[11px] font-medium text-foreground/70">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="p-4 space-y-3"
            >
              {/* Customer Info */}
              <CollapsibleSection
                title="Customer Info"
                icon={User}
                isCollapsed={collapsedSections["info"]}
                onToggle={() => toggleSection("info")}
              >
                <div className="space-y-2">
                  <InfoRow label="Language" value={<span className="text-[12px] text-foreground/70">{conversation.customer.language}</span>} />
                  <InfoRow label="Response Time" value={<span className="text-[12px] text-foreground/70">{conversation.customer.responseTime}</span>} />
                  <InfoRow label="Visits" value={<span className="text-[12px] font-medium text-foreground">{conversation.customer.visitCount}</span>} />
                  <InfoRow label="Total Spent" value={<span className="text-[12px] font-semibold text-foreground">${conversation.customer.totalSpent.toLocaleString()}</span>} />
                </div>
              </CollapsibleSection>

              {/* Purchase History */}
              <CollapsibleSection
                title="Purchase History"
                icon={CreditCard}
                isCollapsed={collapsedSections["purchases"]}
                onToggle={() => toggleSection("purchases")}
              >
                <div className="space-y-1.5">
                  {conversation.customer.purchaseHistory.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-[10px] px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent/8">
                          <Package size={11} strokeWidth={1.5} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-foreground">{p.item}</p>
                          <p className="text-[10px] text-muted-foreground/40">{p.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-semibold text-foreground tabular-nums">${p.amount}</p>
                        <p className={cn(
                          "text-[9px] font-medium capitalize",
                          p.status === "paid" ? "text-accent" : p.status === "refunded" ? "text-destructive" : "text-amber-500",
                        )}>
                          {p.status}
                        </p>
                      </div>
                    </div>
                  ))}
                  {conversation.customer.purchaseHistory.length === 0 && (
                    <EmptyState icon={CreditCard} message="No purchases yet" />
                  )}
                </div>
              </CollapsibleSection>

              {/* Previous Bookings */}
              <CollapsibleSection
                title="Previous Bookings"
                icon={Calendar}
                isCollapsed={collapsedSections["bookings"]}
                onToggle={() => toggleSection("bookings")}
              >
                <div className="space-y-1.5">
                  {conversation.customer.previousBookings.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-[10px] px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary-light/8">
                          <Calendar size={11} strokeWidth={1.5} className="text-primary-light" />
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-foreground">{b.service}</p>
                          <p className="text-[10px] text-muted-foreground/40">{b.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-foreground/60 tabular-nums">${b.price}</span>
                        <span className={cn(
                          "text-[9px] font-semibold capitalize px-1.5 py-0.5 rounded-full",
                          b.status === "completed" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground/50",
                        )}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {conversation.customer.previousBookings.length === 0 && (
                    <EmptyState icon={Calendar} message="No previous bookings" />
                  )}
                </div>
              </CollapsibleSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Helper Components ── */

function CollapsibleSection({
  title,
  icon: Icon,
  isCollapsed,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  isCollapsed?: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-border/30 bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors duration-150 hover:bg-muted/30"
      >
        <div className="flex items-center gap-2">
          <Icon size={13} strokeWidth={1.5} className="text-muted-foreground/50" />
          <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} strokeWidth={1.5} className="text-muted-foreground/30" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-muted-foreground/55">{label}</span>
      {value}
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-muted/50 mb-2">
        <Icon size={16} strokeWidth={1.5} className="text-muted-foreground/25" />
      </div>
      <p className="text-[11px] text-muted-foreground/40">{message}</p>
    </div>
  );
}
