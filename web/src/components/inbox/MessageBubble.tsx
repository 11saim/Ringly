"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, Calendar, CreditCard, MapPin, Mic,
  Copy, Reply, Smile, Trash2,
} from "lucide-react";
import type { Message } from "@/lib/inbox-data";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isCustomer = message.sender === "customer";

  if (message.type === "booking" && message.bookingData) {
    const b = message.bookingData;
    return (
      <div className="flex justify-center my-4">
        <div className="rounded-[16px] border border-accent/20 bg-card p-5 max-w-[320px] w-full shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent/10">
              <Calendar size={16} strokeWidth={1.5} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-foreground">Booking Confirmed</p>
              <p className="text-[11px] text-muted-foreground/50">Appointment scheduled</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-semibold text-accent uppercase tracking-wider">
              {b.status}
            </span>
          </div>
          <div className="space-y-2.5 rounded-[12px] bg-muted/40 p-3.5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground/50">Service</span>
              <span className="text-[12px] font-semibold text-foreground">{b.service}</span>
            </div>
            <div className="h-px bg-border/20" />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground/50">Date</span>
              <span className="text-[12px] font-semibold text-foreground">{b.date}</span>
            </div>
            <div className="h-px bg-border/20" />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground/50">Time</span>
              <span className="text-[12px] font-semibold text-foreground">{b.time}</span>
            </div>
            {b.price && (
              <>
                <div className="h-px bg-border/20" />
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground/50">Price</span>
                  <span className="text-[14px] font-bold text-foreground">{b.price}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <CheckCircle2 size={15} strokeWidth={1.5} className="text-accent" />
            <span className="text-[12px] font-semibold text-accent capitalize">{b.status}</span>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "payment" && message.paymentData) {
    const p = message.paymentData;
    return (
      <div className={cn("flex", isCustomer ? "justify-end" : "justify-start", "my-1.5")}>
        <div className={cn(
          "rounded-[16px] border p-4 max-w-[260px]",
          isCustomer
            ? "bg-accent text-white border-accent"
            : "bg-card border-border/40 shadow-[var(--shadow-card)]",
        )}>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={14} strokeWidth={1.5} />
            <span className="text-[12px] font-semibold">Payment</span>
          </div>
          <p className="text-[22px] font-bold">{p.amount}</p>
          <p className="text-[10px] opacity-60 mt-0.5">{p.method} · {p.status}</p>
        </div>
      </div>
    );
  }

  if (message.type === "location" && message.locationData) {
    return (
      <div className={cn("flex", isCustomer ? "justify-end" : "justify-start", "my-1.5")}>
        <div className={cn(
          "rounded-[16px] border p-4 max-w-[240px]",
          isCustomer
            ? "bg-accent text-white border-accent"
            : "bg-card border-border/40 shadow-[var(--shadow-card)]",
        )}>
          <div className="flex items-center gap-2.5">
            <MapPin size={14} strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-medium">{message.locationData.name}</p>
              <p className="text-[10px] opacity-60">{message.locationData.address}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "typing") {
    return (
      <div className="flex justify-start my-1.5">
        <div className="rounded-[16px] rounded-bl-[4px] bg-muted px-4 py-3">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "200ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-typing-dot" style={{ animationDelay: "400ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col", isCustomer ? "items-end" : "items-start", "my-1.5 group/msg")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bubble */}
      <div className={cn(
        "rounded-[18px] px-4 py-2.5 max-w-[380px] text-[13px] leading-relaxed relative",
        "transition-shadow duration-150",
        isCustomer
          ? "bg-accent text-white rounded-br-[6px]"
          : "bg-muted text-foreground rounded-bl-[6px] shadow-[var(--shadow-xs)]",
        "group-hover/msg:shadow-[var(--shadow-card)]",
      )}>
        {message.text && (
          <p className="whitespace-pre-wrap">{message.text}</p>
        )}
        {message.type === "voice" && (
          <div className="flex items-center gap-2">
            <Mic size={14} strokeWidth={1.5} />
            <div className="flex gap-[3px] items-center h-4">
              {[3,7,5,10,4,8,6,11,3,7,5,9,4,8,6,10,3,7,5,8].map((h, i) => (
                <div
                  key={i}
                  className={cn("w-[2px] rounded-full", isCustomer ? "bg-white/40" : "bg-muted-foreground/30")}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <span className="text-[10px] opacity-60">0:12</span>
          </div>
        )}
        {message.type === "image" && (
          <div className="flex items-center gap-2 opacity-60">
            <div className="h-4 w-4 rounded bg-muted-foreground/30" />
            <span className="text-[11px]">Photo</span>
          </div>
        )}

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 2 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 2 }}
              transition={{ duration: 0.1 }}
              className={cn(
                "absolute -bottom-8 flex items-center gap-0.5 rounded-[8px] border border-border/40 bg-card px-1 py-0.5 shadow-[var(--shadow-card)]",
                isCustomer ? "right-0" : "left-0",
              )}
            >
              {[
                { icon: Copy, label: "Copy" },
                { icon: Reply, label: "Reply" },
                { icon: Smile, label: "React" },
                { icon: Trash2, label: "Delete" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  title={label}
                  className="flex h-6 w-6 items-center justify-center rounded-[6px] text-muted-foreground/40 transition-all duration-100 hover:bg-hover-bg hover:text-foreground"
                >
                  <Icon size={11} strokeWidth={1.5} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Replies */}
      {message.quickReplies && message.quickReplies.length > 0 && (
        <div className="flex gap-1.5 mt-2 ml-1">
          {message.quickReplies.map((qr) => (
            <button
              key={qr}
              className="rounded-full border border-accent/25 bg-accent/5 px-3 py-1.5 text-[11px] font-medium text-accent transition-all duration-150 hover:bg-accent/10 hover:border-accent/40"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Time */}
      <span className={cn(
        "text-[10px] mt-1 tabular-nums font-medium",
        isCustomer ? "text-muted-foreground/35 mr-1" : "text-muted-foreground/35 ml-1",
      )}>
        {message.time}
      </span>
    </div>
  );
}
