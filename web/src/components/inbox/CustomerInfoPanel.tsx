"use client";

import { motion } from "framer-motion";
import {
  Phone, Calendar, MessageSquare, ExternalLink, Edit3,
  X, Clock, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { conversations } from "@/lib/inbox-data";

interface CustomerInfoPanelProps {
  conversationId: string | null;
  onClose: () => void;
}

export function CustomerInfoPanel({ conversationId, onClose }: CustomerInfoPanelProps) {
  const conversation = conversations.find((c) => c.id === conversationId);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-background">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-muted mb-4">
            <MessageSquare size={22} strokeWidth={1.2} className="text-muted-foreground/30" />
          </div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Customer Info</h3>
          <p className="text-[12px] text-muted-foreground/45 leading-relaxed max-w-[200px]">
            Select a conversation to see customer details.
          </p>
        </div>
      </div>
    );
  }

  const c = conversation.customer;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/25 shrink-0">
        <h2 className="text-[13px] font-semibold text-foreground">Customer Info</h2>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-[6px] text-muted-foreground/40 transition-all duration-150 hover:bg-hover-bg hover:text-foreground"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-premium">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center px-5 pt-6 pb-4">
          <div className="relative mb-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-muted text-[18px] font-semibold text-foreground/60">
              {c.initials}
            </div>
            {c.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-card bg-accent" />
            )}
          </div>
          <h3 className="text-[15px] font-semibold text-foreground mb-0.5">{c.name}</h3>
          <p className="text-[12px] text-muted-foreground/50">{c.phone}</p>
          {c.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    tag === "VIP"
                      ? "bg-amber-500/10 text-amber-600"
                      : tag === "New"
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground/50",
                  )}
                >
                  <Tag size={8} strokeWidth={1.5} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-2 gap-px bg-border/15 rounded-[12px] overflow-hidden">
            {[
              { label: "Conversations", value: String(conversation.customer.visitCount), icon: MessageSquare },
              { label: "Bookings", value: String(conversation.customer.previousBookings.length), icon: Calendar },
              { label: "Total Spent", value: `$${conversation.customer.totalSpent.toLocaleString()}`, icon: Clock },
              { label: "Last Seen", value: conversation.customer.lastSeen, icon: Clock },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center bg-card p-3">
                <stat.icon size={13} strokeWidth={1.5} className="text-muted-foreground/30 mb-1.5" />
                <span className="text-[14px] font-bold text-foreground tabular-nums">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground/40 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Booking */}
        {c.previousBookings.length > 0 && (
          <div className="px-5 pb-4">
            <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider block mb-2">Last Booking</span>
            <div className="rounded-[12px] border border-border/25 bg-card p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent/8">
                  <Calendar size={13} strokeWidth={1.5} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground truncate">{c.previousBookings[0].service}</p>
                  <p className="text-[10px] text-muted-foreground/40">{c.previousBookings[0].date}</p>
                </div>
                <span className="text-[12px] font-semibold text-foreground tabular-nums">${c.previousBookings[0].price}</span>
              </div>
            </div>
          </div>
        )}

        {/* Response Time */}
        <div className="px-5 pb-4">
          <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider block mb-2">Details</span>
          <div className="rounded-[12px] border border-border/25 bg-card divide-y divide-border/15">
            {[
              { label: "Language", value: c.language },
              { label: "Response Time", value: c.responseTime },
              { label: "Status", value: conversation.status },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-[12px] text-muted-foreground/55">{item.label}</span>
                <span className="text-[12px] font-medium text-foreground capitalize">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 border-t border-border/25 shrink-0 space-y-2">
        <button
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[12px] font-semibold",
            "bg-accent text-white transition-all duration-150",
            "hover:bg-accent-hover",
          )}
        >
          <ExternalLink size={13} strokeWidth={1.8} />
          Open Customer
        </button>
        <button
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[12px] font-medium",
            "border border-border/40 bg-card text-foreground/70 transition-all duration-150",
            "hover:bg-hover-bg hover:text-foreground hover:border-border/60",
          )}
        >
          <Edit3 size={13} strokeWidth={1.8} />
          Edit Customer
        </button>
      </div>
    </div>
  );
}
