"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Columns3, ListChecks, Plus, Table2, UsersRound } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { bookings, days, hours, staff } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TABS = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "staff", label: "Staff view", icon: UsersRound },
  { id: "kanban", label: "Kanban", icon: Columns3 },
  { id: "table", label: "Table", icon: Table2 },
] as const;

const lanes = ["Requested", "Confirmed", "In chair", "Completed"] as const;

type TabId = typeof TABS[number]["id"];
type Booking = typeof bookings[number] & { id: string; customer: string; service: string; staff: string; time: string; day: string; status: string };

export default function BookingsPage() {
  const [tab, setTab] = useState<TabId>("calendar");
  const [newOpen, setNewOpen] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(true);
  const [list, setList] = useState<Booking[]>(bookings);
  const [form, setForm] = useState({ customer: "", service: "", staff: staff[0], day: days[1], time: hours[2], notes: "" });

  const pending = list.filter((b) => b.status === "pending");
  const confirmed = list.filter((b) => b.status === "confirmed").length;
  const byStaff = useMemo(() => staff.map((name) => ({ name, count: list.filter((b) => b.staff === name).length })), [list]);

  const createBooking = () => {
    if (!form.customer.trim() || !form.service.trim()) return;
    const next: Booking = { id: `b${Date.now()}`, customer: form.customer.trim(), service: form.service.trim(), staff: form.staff, day: form.day, time: form.time, status: "confirmed" };
    setList((items) => [next, ...items]);
    setForm({ customer: "", service: "", staff: staff[0], day: days[1], time: hours[2], notes: "" });
    setNewOpen(false);
    toast.success(`Booking created for ${next.customer}`);
  };

  const confirmWaitlist = (id: string) => {
    setList((items) => items.map((booking) => booking.id === id ? { ...booking, status: "confirmed" } : booking));
    toast.success("Waitlist request confirmed");
  };

  return (
    <AppShell title="Bookings" subtitle={`${list.length} upcoming · ${confirmed} confirmed · ${pending.length} waitlisted`} actions={<Button type="button" size="sm" onClick={() => setNewOpen(true)}><Plus className="mr-1 h-3.5 w-3.5" /> New booking</Button>}>
      <div className="space-y-5">
        <section className="grid gap-3 md:grid-cols-4">
          <Metric icon={<CalendarDays />} label="This week" value={String(list.length)} />
          <Metric icon={<Check />} label="Confirmed" value={String(confirmed)} />
          <Metric icon={<Clock />} label="Open waitlist" value={String(pending.length)} />
          <Metric icon={<ListChecks />} label="Utilization" value="78%" />
        </section>

        <section className="rounded-xl border border-border bg-card p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-background p-1">
              {TABS.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    aria-pressed={active}
                  >
                    <Icon className="h-3.5 w-3.5" /> {item.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" size="sm" variant="outline" className="h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
              <Badge variant="secondary" className="px-3 py-1 font-mono">Jul 15—21</Badge>
              <Button type="button" size="sm" variant="outline" className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowWaitlist((v) => !v)}>{showWaitlist ? "Hide" : "Show"} waitlist</Button>
            </div>
          </div>
        </section>

        <div className={`grid gap-5 ${showWaitlist ? "xl:grid-cols-[1fr_300px]" : ""}`}>
          <div className="min-w-0">
            {tab === "calendar" && <CalendarView list={list} />}
            {tab === "staff" && <StaffView list={list} staffLoad={byStaff} />}
            {tab === "kanban" && <KanbanView list={list} />}
            {tab === "table" && <TableView list={list} />}
          </div>

          {showWaitlist && (
            <aside className="h-fit rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between"><div className="text-sm font-semibold">Waitlist</div><Badge variant="secondary">{pending.length}</Badge></div>
              <div className="space-y-3">
                {pending.length === 0 && <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">No pending requests.</div>}
                {pending.map((booking) => (
                  <div key={booking.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="font-semibold">{booking.customer}</div>
                    <div className="text-xs text-muted-foreground">{booking.service} · {booking.day} {booking.time}</div>
                    <div className="mt-3 flex gap-2">
                      <Button type="button" size="sm" className="h-7 text-xs" onClick={() => confirmWaitlist(booking.id)}>Confirm</Button>
                      <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => setList((items) => items.filter((b) => b.id !== booking.id))}>Decline</Button>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>New booking</DialogTitle>
            <DialogDescription>Create a booking and place it instantly on every view.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Customer"><Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Sofia N." /></Field>
              <Field label="Service"><Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="Balayage" /></Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Select label="Staff" value={form.staff} values={staff} onChange={(staffName) => setForm({ ...form, staff: staffName })} />
              <Select label="Day" value={form.day} values={days} onChange={(day) => setForm({ ...form, day })} />
              <Select label="Time" value={form.time} values={hours} onChange={(time) => setForm({ ...form, time })} />
            </div>
            <Field label="Internal note"><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional context for staff" /></Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button type="button" onClick={createBooking} disabled={!form.customer.trim() || !form.service.trim()}>Create booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function CalendarView({ list }: { list: Booking[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid min-w-[780px]" style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(108px, 1fr))` }}>
        <div className="border-b border-border bg-muted/40" />
        {days.map((day) => <div key={day} className="border-b border-l border-border bg-muted/40 px-3 py-3 text-xs font-semibold text-muted-foreground">{day}</div>)}
        {hours.map((hour) => (
          <div key={hour} className="contents">
            <div className="border-t border-border px-2 py-4 text-xs font-mono text-muted-foreground">{hour}</div>
            {days.map((day) => {
              const slot = list.find((b) => b.day === day && b.time === hour);
              return <Slot key={`${day}-${hour}`} booking={slot} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffView({ list, staffLoad }: { list: Booking[]; staffLoad: { name: string; count: number }[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {staffLoad.map((person) => <Metric key={person.name} icon={<UsersRound />} label={person.name} value={`${person.count} jobs`} />)}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid min-w-[700px]" style={{ gridTemplateColumns: `64px repeat(${staff.length}, minmax(150px, 1fr))` }}>
          <div className="border-b border-border bg-muted/40" />
          {staff.map((person) => <div key={person} className="border-b border-l border-border bg-muted/40 px-3 py-3 text-xs font-semibold">{person}</div>)}
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="border-t border-border px-2 py-4 text-xs font-mono text-muted-foreground">{hour}</div>
              {staff.map((person) => <Slot key={`${person}-${hour}`} booking={list.find((b) => b.staff === person && b.time === hour)} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KanbanView({ list }: { list: Booking[] }) {
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{lanes.map((lane, laneIndex) => <div key={lane} className="min-h-[420px] rounded-xl border border-border bg-card p-3"><div className="mb-3 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{lane}</div><Badge variant="secondary">{list.slice(laneIndex, laneIndex + 3).length}</Badge></div><div className="space-y-2">{list.slice(laneIndex, laneIndex + 3).map((booking) => <BookingCard key={`${lane}-${booking.id}`} booking={booking} />)}</div></div>)}</div>;
}

function TableView({ list }: { list: Booking[] }) {
  return <div className="overflow-hidden rounded-xl border border-border bg-card"><table className="w-full min-w-[760px] text-sm"><thead className="bg-muted/40 text-xs text-muted-foreground"><tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Service</th><th className="px-4 py-3 text-left">Staff</th><th className="px-4 py-3 text-left">When</th><th className="px-4 py-3 text-right">Status</th></tr></thead><tbody>{list.map((booking) => <tr key={booking.id} className="border-t border-border"><td className="px-4 py-3 font-semibold">{booking.customer}</td><td className="px-4 py-3">{booking.service}</td><td className="px-4 py-3">{booking.staff}</td><td className="px-4 py-3 font-mono text-xs">{booking.day} {booking.time}</td><td className="px-4 py-3 text-right"><Status status={booking.status} /></td></tr>)}</tbody></table></div>;
}

function Slot({ booking }: { booking?: Booking }) {
  return <div className="min-h-[58px] border-l border-t border-border p-1.5">{booking && <BookingCard booking={booking} compact />}</div>;
}

function BookingCard({ booking, compact = false }: { booking: Booking; compact?: boolean }) {
  return <div className={`rounded-lg border border-primary/20 bg-accent-soft p-2 text-primary shadow-sm ${compact ? "text-[11px]" : "text-sm"}`}><div className="truncate font-semibold">{booking.customer}</div><div className="truncate opacity-75">{booking.service}</div>{!compact && <div className="mt-2 flex items-center justify-between text-xs opacity-75"><span>{booking.day} {booking.time}</span><span>{booking.staff}</span></div>}</div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span><div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div><div className="font-mono text-lg font-bold">{value}</div></div></div></div>;
}

function Status({ status }: { status: string }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{status}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>;
}

function Select({ label, value, values, onChange }: { label: string; value: string; values: readonly string[]; onChange: (v: string) => void }) {
  return <div><Label className="mb-1.5 block text-xs">{label}</Label><select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>{values.map((item) => <option key={item}>{item}</option>)}</select></div>;
}
