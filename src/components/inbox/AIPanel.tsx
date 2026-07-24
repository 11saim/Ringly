"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Brain, TrendingUp, Globe,
  ChevronRight, RotateCcw, AlignLeft,
  User, CreditCard, Package, Send, Zap,
  Star, Shield, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations, aiSuggestions, recommendedActions } from "@/lib/inbox-data";

interface AIPanelProps {
  conversationId: string | null;
}

export function AIPanel({ conversationId }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<"insights" | "suggestions" | "actions">("insights");
  const conversation = conversations.find((c) => c.id === conversationId);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-primary/[0.06] mb-4">
          <Sparkles size={22} strokeWidth={1.5} className="text-primary-light/60" />
        </div>
        <h3 className="text-[14px] font-semibold text-foreground mb-1">AI Assistant</h3>
        <p className="text-[12px] text-muted-foreground/45 leading-relaxed max-w-[200px]">
          Select a conversation to see AI insights, suggestions, and recommended actions.
        </p>
      </div>
    );
  }

  const sentimentColor = {
    positive: "text-success",
    neutral: "text-muted-foreground",
    negative: "text-destructive",
  }[conversation.sentiment];

  const sentimentBg = {
    positive: "bg-success/8",
    neutral: "bg-muted",
    negative: "bg-destructive/8",
  }[conversation.sentiment];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border/30 px-4">
        {(["insights", "suggestions", "actions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative px-3 py-3 text-[12px] font-medium capitalize transition-colors",
              activeTab === tab ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground",
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="ai-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-4"
            >
              {/* Customer Summary */}
              <div>
                <h4 className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">Customer Summary</h4>
                <div className="space-y-2.5">
                  <InfoRow icon={Brain} label="Sentiment" value={
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize", sentimentBg, sentimentColor)}>
                      {conversation.sentiment}
                    </span>
                  } />
                  <InfoRow icon={Zap} label="Intent" value={<span className="text-[12px] font-medium text-foreground">{conversation.intent}</span>} />
                  <InfoRow icon={Globe} label="Language" value={<span className="text-[12px] text-foreground/70">{conversation.customer.language}</span>} />
                  <InfoRow icon={TrendingUp} label="Confidence" value={
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "88%" }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full rounded-full bg-primary-light"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-foreground/70">88%</span>
                    </div>
                  } />
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <h4 className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">Purchase History</h4>
                <div className="space-y-1.5">
                  {conversation.customer.purchaseHistory.map((p, i) => (
                    <div key={i} className="flex items-center justify-between rounded-[8px] px-3 py-2 bg-muted/40">
                      <div>
                        <p className="text-[12px] font-medium text-foreground">{p.item}</p>
                        <p className="text-[10px] text-muted-foreground/40">{p.date}</p>
                      </div>
                      <span className="text-[12px] font-semibold text-foreground tabular-nums">${p.amount}</span>
                    </div>
                  ))}
                  {conversation.customer.purchaseHistory.length === 0 && (
                    <p className="text-[11px] text-muted-foreground/40 py-2">No purchases yet</p>
                  )}
                </div>
              </div>

              {/* Previous Bookings */}
              <div>
                <h4 className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">Previous Bookings</h4>
                <div className="space-y-1.5">
                  {conversation.customer.previousBookings.map((b, i) => (
                    <div key={i} className="flex items-center justify-between rounded-[8px] px-3 py-2 bg-muted/40">
                      <div>
                        <p className="text-[12px] font-medium text-foreground">{b.service}</p>
                        <p className="text-[10px] text-muted-foreground/40">{b.date}</p>
                      </div>
                      <span className="text-[10px] font-medium text-success capitalize">{b.status}</span>
                    </div>
                  ))}
                  {conversation.customer.previousBookings.length === 0 && (
                    <p className="text-[11px] text-muted-foreground/40 py-2">No previous bookings</p>
                  )}
                </div>
              </div>

              {/* Conversation Insights */}
              <div>
                <h4 className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">Conversation Insights</h4>
                <div className="grid grid-cols-2 gap-2">
                  <InsightCard label="AI Confidence" value="88%" icon={Brain} color="text-primary-light" />
                  <InsightCard label="Satisfaction" value="4.2/5" icon={Star} color="text-accent-amber" />
                  <InsightCard label="Lifetime Value" value={`$${conversation.customer.lifetimeValue.toLocaleString()}`} icon={TrendingUp} color="text-success" />
                  <InsightCard label="Risk Score" value="Low" icon={Shield} color="text-success" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "suggestions" && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-3"
            >
              {aiSuggestions.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[14px] border border-border/30 bg-card p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {s.type === "reply" && <Sparkles size={12} strokeWidth={1.5} className="text-primary-light" />}
                      {s.type === "action" && <Zap size={12} strokeWidth={1.5} className="text-accent-amber" />}
                      {s.type === "knowledge" && <Brain size={12} strokeWidth={1.5} className="text-info" />}
                      <span className="text-[11px] font-semibold text-foreground">{s.title}</span>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground/40 tabular-nums">{s.confidence}%</span>
                  </div>
                  <p className="text-[12px] text-foreground/70 leading-relaxed">{s.content}</p>
                  {s.source && (
                    <p className="text-[10px] text-muted-foreground/40 flex items-center gap-1">
                      <Brain size={9} strokeWidth={1.5} />
                      {s.source}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5">
                    {s.type === "reply" && (
                      <>
                        <button className="flex items-center gap-1 rounded-[8px] bg-accent px-2.5 py-1.5 text-[10px] font-semibold text-white transition-all hover:bg-accent-hover">
                          <Send size={9} strokeWidth={2} />
                          Send
                        </button>
                        <button className="flex items-center gap-1 rounded-[8px] bg-muted px-2.5 py-1.5 text-[10px] font-medium text-foreground/60 transition-all hover:bg-muted/80">
                          <RotateCcw size={9} strokeWidth={1.5} />
                          Regenerate
                        </button>
                        <button className="flex items-center gap-1 rounded-[8px] bg-muted px-2.5 py-1.5 text-[10px] font-medium text-foreground/60 transition-all hover:bg-muted/80">
                          <AlignLeft size={9} strokeWidth={1.5} />
                          Shorter
                        </button>
                      </>
                    )}
                    {s.type === "action" && (
                      <button className="flex items-center gap-1 rounded-[8px] bg-primary/[0.06] px-2.5 py-1.5 text-[10px] font-medium text-primary-light transition-all hover:bg-primary/[0.1]">
                        <Zap size={9} strokeWidth={2} />
                        Execute
                      </button>
                    )}
                    {s.type === "knowledge" && (
                      <button className="flex items-center gap-1 rounded-[8px] bg-muted px-2.5 py-1.5 text-[10px] font-medium text-foreground/60 transition-all hover:bg-muted/80">
                        <ChevronRight size={9} strokeWidth={2} />
                        Share
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "actions" && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-2"
            >
              {recommendedActions.map((a, i) => {
                const icons: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
                  calendar: Calendar,
                  "credit-card": CreditCard,
                  user: User,
                  package: Package,
                  send: Send,
                };
                const Icon = icons[a.icon] || Zap;
                const colors: Record<string, string> = {
                  calendar: "#22c55e",
                  "credit-card": "#6366f1",
                  user: "#f59e0b",
                  package: "#8b5cf6",
                  send: "#3b82f6",
                };
                const color = colors[a.icon] || "#6b7689";

                return (
                  <motion.button
                    key={a.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center gap-3 rounded-[12px] border border-border/30 bg-card px-4 py-3 text-left transition-all hover:border-border/50 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-[8px]"
                      style={{ backgroundColor: `${color}10` }}
                    >
                      <Icon size={15} strokeWidth={1.5} className={cn(color)} />
                    </div>
                    <span className="text-[13px] font-medium text-foreground flex-1">{a.label}</span>
                    <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground/30" />
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={12} strokeWidth={1.5} className="text-muted-foreground/40" />
        <span className="text-[12px] text-muted-foreground/60">{label}</span>
      </div>
      {value}
    </div>
  );
}

function InsightCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; color: string }) {
  return (
    <div className="rounded-[10px] bg-muted/40 p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={11} strokeWidth={1.5} className={color} />
        <span className="text-[10px] text-muted-foreground/50">{label}</span>
      </div>
      <p className="text-[16px] font-bold text-foreground tabular-nums">{value}</p>
    </div>
  );
}
