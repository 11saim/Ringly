"use client";

import { MessageCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StepWhatsApp({
  connected,
  onToggle,
}: {
  connected: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
        Connect WhatsApp
      </h2>
      <p className="text-sm text-[var(--ash)] mb-6">
        Link your WhatsApp Business number so the agent can receive and respond to messages.
      </p>

      <div
        className={cn(
          "rounded-xl border-2 p-6 transition-all",
          connected
            ? "border-[var(--cedar)] bg-[var(--mist)]"
            : "border-[var(--slate)] bg-white"
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              connected
                ? "bg-[var(--cedar)] text-white"
                : "bg-[var(--linen)] text-[var(--ash)]"
            )}
          >
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--ink)]">
              {connected ? "WhatsApp connected" : "Not connected"}
            </p>
            <p className="text-xs text-[var(--ash)] mt-1">
              {connected
                ? "Your WhatsApp Business account is linked and ready."
                : "You can connect this later in Settings → WhatsApp."}
            </p>
            <Button
              variant={connected ? "outline" : "default"}
              size="sm"
              className="mt-3"
              onClick={() => onToggle(!connected)}
            >
              {connected ? (
                <>
                  <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  Disconnect
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Connect now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-[var(--ash)]">
        This is a placeholder — real Meta Cloud API integration will be available soon.
      </p>
    </div>
  );
}
