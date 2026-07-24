"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, Calendar, CreditCard, MapPin, Mic } from "lucide-react";
import type { Message } from "@/lib/inbox-data";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isCustomer = message.sender === "customer";
  const isAI = message.sender === "ai";

  if (message.type === "booking" && message.bookingData) {
    const b = message.bookingData;
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-center my-3"
      >
        <div className="rounded-[16px] border border-border/30 bg-card p-4 max-w-[320px] w-full shadow-[var(--shadow-xs)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-success/10">
              <Calendar size={13} strokeWidth={1.5} className="text-success" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-foreground">Booking Confirmed</p>
              <p className="text-[10px] text-muted-foreground/50">Appointment scheduled</p>
            </div>
          </div>
          <div className="space-y-2 rounded-[10px] bg-muted/40 p-3">
            <div className="flex justify-between">
              <span className="text-[11px] text-muted-foreground/50">Service</span>
              <span className="text-[11px] font-medium text-foreground">{b.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-muted-foreground/50">Date</span>
              <span className="text-[11px] font-medium text-foreground">{b.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-muted-foreground/50">Time</span>
              <span className="text-[11px] font-medium text-foreground">{b.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <CheckCircle2 size={12} strokeWidth={1.5} className="text-success" />
            <span className="text-[10px] font-medium text-success capitalize">{b.status}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (message.type === "payment" && message.paymentData) {
    const p = message.paymentData;
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn("flex", isCustomer ? "justify-end" : "justify-start", "my-1")}
      >
        <div className={cn(
          "rounded-[16px] border p-3 max-w-[280px]",
          isCustomer
            ? "bg-accent text-white border-accent"
            : "bg-card border-border/30",
        )}>
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={13} strokeWidth={1.5} />
            <span className="text-[11px] font-semibold">Payment</span>
          </div>
          <p className="text-[18px] font-bold">{p.amount}</p>
          <p className="text-[10px] opacity-60 mt-0.5">{p.method} • {p.status}</p>
        </div>
      </motion.div>
    );
  }

  if (message.type === "location" && message.locationData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={cn("flex", isCustomer ? "justify-end" : "justify-start", "my-1")}
      >
        <div className={cn(
          "rounded-[16px] border p-3 max-w-[260px]",
          isCustomer
            ? "bg-accent text-white border-accent"
            : "bg-card border-border/30",
        )}>
          <div className="flex items-center gap-2">
            <MapPin size={13} strokeWidth={1.5} />
            <div>
              <p className="text-[12px] font-medium">{message.locationData.name}</p>
              <p className="text-[10px] opacity-60">{message.locationData.address}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (message.type === "typing") {
    return (
      <div className="flex justify-start my-1">
        <div className="rounded-[16px] rounded-bl-[4px] bg-muted px-4 py-3">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex flex-col", isCustomer ? "items-end" : "items-start", "my-1")}
    >
      {/* Sender label */}
      {isAI && (
        <span className="text-[10px] font-medium text-primary-light/60 mb-1 ml-1 flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-primary-light" />
          AI Agent
        </span>
      )}

      {/* Bubble */}
      <div className={cn(
        "rounded-[18px] px-4 py-2.5 max-w-[420px] text-[13px] leading-relaxed",
        isCustomer
          ? "bg-accent text-white rounded-br-[4px]"
          : "bg-muted text-foreground rounded-bl-[4px]",
      )}>
        {message.text && (
          <p className="whitespace-pre-wrap">{message.text}</p>
        )}
        {message.type === "voice" && (
          <div className="flex items-center gap-2">
            <Mic size={13} strokeWidth={1.5} />
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
            <div className="h-3.5 w-3.5 rounded bg-muted-foreground/30" />
            <span className="text-[11px]">Photo</span>
          </div>
        )}
      </div>

      {/* Quick Replies */}
      {message.quickReplies && message.quickReplies.length > 0 && (
        <div className="flex gap-1.5 mt-2 ml-1">
          {message.quickReplies.map((qr) => (
            <button
              key={qr}
              className="rounded-full border border-border/40 bg-card px-3 py-1.5 text-[11px] font-medium text-foreground/70 transition-all hover:bg-muted hover:border-border/60 hover:text-foreground"
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Time */}
      <span className={cn(
        "text-[10px] mt-1 tabular-nums",
        isCustomer ? "text-muted-foreground/30 mr-1" : "text-muted-foreground/30 ml-1",
      )}>
        {message.time}
      </span>
    </motion.div>
  );
}
