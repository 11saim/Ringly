"use client";

import { AppShell } from "@/components/app/AppShell";
import { conversations } from "@/lib/mock";
import { ConfidenceBar } from "@/components/app/ConfidenceBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function InboxPage() {
  const [selected, setSelected] = useState(conversations[0]);
  const [tab, setTab] = useState("open");
  const filtered = tab === "all" ? conversations : conversations.filter((c) => c.status === tab);
  return (
    <AppShell title="Inbox" subtitle={`${conversations.length} conversations`}>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <div className="grid md:grid-cols-[340px_1fr] gap-4">
            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              {filtered.map((c) => (
                <button key={c.id} onClick={() => setSelected(c)} className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted transition ${selected.id === c.id ? "bg-muted" : ""}`}>
                  <span className={`mt-0.5 grid h-8 w-8 place-items-center rounded-full text-white text-[10px] ${c.channel === "whatsapp" ? "bg-whatsapp" : "bg-voice"}`}>{c.channel === "whatsapp" ? "W" : "V"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{c.customer}</span>
                      {c.ai && <ConfidenceBar level={c.confidence as 1 | 2 | 3} />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{c.preview}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">{c.time}</div>
                </button>
              ))}
              {filtered.length === 0 && <div className="p-6 text-sm text-muted-foreground text-center">No conversations here.</div>}
            </div>
            <ThreadView conv={selected} />
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function ThreadView({ conv }: { conv: typeof conversations[number] }) {
  return (
    <div className="rounded-xl border border-border bg-card flex flex-col min-h-[560px]">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <div className="text-sm font-semibold">{conv.customer}</div>
          <div className="text-xs text-muted-foreground capitalize">{conv.channel} · {conv.status}</div>
        </div>
        <Button size="sm" variant="outline" className="border-warning text-warning hover:bg-warning/10">Take over</Button>
      </div>
      <div className="flex-1 p-5 space-y-3 bg-[color:var(--surface-2)]">
        <div className="max-w-[75%] rounded-2xl bg-accent-soft px-3 py-2 text-sm">{conv.preview}</div>
        <div className="max-w-[75%] ml-auto rounded-2xl bg-card border border-border px-3 py-2 text-sm">Absolutely — I can help with that. One moment while I check availability.</div>
        <div className="max-w-[75%] ml-auto rounded-2xl bg-card border border-border px-3 py-2 text-sm">Saturday 3:30 PM with Ana works. Should I lock it in?</div>
        <div className="max-w-[75%] rounded-2xl bg-accent-soft px-3 py-2 text-sm">Yes please 🙌</div>
        <div className="max-w-[75%] ml-auto rounded-2xl bg-card border border-border px-3 py-2 text-sm">Booked!</div>
        <div className="ml-auto max-w-fit"><span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success text-xs font-medium px-2 py-1"><CalendarIcon size={12} /> Booked: Sat 3:30 PM · Ana</span></div>
      </div>
      <div className="border-t border-border p-3 flex gap-2 bg-card">
        <input className="flex-1 rounded-md border border-input px-3 py-2 text-sm" placeholder="Type a message (agent is handling this thread)…" />
        <Button className="bg-primary hover:bg-primary/90">Send</Button>
      </div>
    </div>
  );
}
