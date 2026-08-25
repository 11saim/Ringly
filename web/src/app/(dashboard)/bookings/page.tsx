"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTenant } from "@/lib/tenant-context";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit,
  List,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type Booking, type Order } from "@/lib/data";
import { cn } from "@/lib/utils";

// ── DB row types ──

interface DbBookingRow {
  id: string;
  contact_id: string;
  service_id: string;
  staff_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: "upcoming" | "completed" | "cancelled";
  created_via: string;
  created_at: string;
  contacts: { name: string | null } | null;
  services: { name: string; duration_minutes: number } | null;
  staff: { name: string } | null;
}

interface DbOrderRow {
  id: string;
  contact_id: string;
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
  total_amount: number;
  created_via: string;
  created_at: string;
  contacts: { name: string | null } | null;
  order_items: Array<{
    quantity: number;
    unit_price: number;
    product_id: string;
    products: { name: string } | null;
  }>;
}

// ── Dialog dropdown option types ──

interface ContactOption {
  id: string;
  name: string | null;
  phone: string;
}

interface ServiceOption {
  id: string;
  name: string;
  duration_minutes: number;
}

interface StaffOption {
  id: string;
  name: string;
}

interface ProductOption {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
}

// ── Helpers ──

const statusColors: Record<string, string> = {
  upcoming: "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]",
  completed: "border-[var(--slate)] bg-[var(--linen)] text-[var(--ash)]",
  cancelled: "border-[var(--ember)] bg-[var(--ember)]/10 text-[var(--ember)]",
  pending: "border-[var(--amber)] bg-[var(--amber)]/10 text-[var(--amber)]",
  confirmed: "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]",
  fulfilled: "border-[var(--slate)] bg-[var(--linen)] text-[var(--ash)]",
};

const bookingStatuses = ["all", "upcoming", "completed", "cancelled"] as const;
const orderStatuses = ["all", "pending", "confirmed", "fulfilled", "cancelled"] as const;

function formatDate(d: string) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatScheduledAt(scheduledAt: string): { date: string; time: string } {
  const d = new Date(scheduledAt);
  const date = d.toLocaleDateString("en-CA");
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
}

function combineDateTime(date: string, time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return `${date}T${time}:00`;
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${date}T${String(hours).padStart(2, "0")}:${minutes}:00`;
}

function mapDbBooking(b: DbBookingRow): Booking {
  const { date, time } = formatScheduledAt(b.scheduled_at);
  return {
    id: b.id,
    customer: b.contacts?.name ?? "Unknown",
    service: b.services?.name ?? "Unknown",
    staff: b.staff?.name ?? "Unassigned",
    date,
    time,
    status: b.status,
  };
}

function mapDbOrder(o: DbOrderRow): Order {
  return {
    id: o.id,
    customer: o.contacts?.name ?? "Unknown",
    products: o.order_items.map((oi) => ({
      name: oi.products?.name ?? "Unknown",
      qty: oi.quantity,
      price: oi.unit_price,
    })),
    total: o.total_amount,
    date: o.created_at.split("T")[0],
    status: o.status,
  };
}

// ── Section Heading ──

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--cedar)]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          {title}
        </h3>
        <p className="text-xs text-[var(--ash)] mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ── Booking Dialog ──

function BookingDialog({
  open,
  onOpenChange,
  booking,
  contacts,
  services,
  staffList,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  booking: DbBookingRow | null;
  contacts: ContactOption[];
  services: ServiceOption[];
  staffList: StaffOption[];
  onSave: (form: {
    contact_id: string;
    service_id: string;
    staff_id: string;
    scheduled_at: string;
    duration_minutes: number;
    status: string;
  }) => Promise<{ error?: string }>;
}) {
  const isEdit = !!booking;

  const defaultForm = useMemo(() => {
    if (booking) {
      const { date, time } = formatScheduledAt(booking.scheduled_at);
      return {
        contact_id: booking.contact_id,
        service_id: booking.service_id,
        staff_id: booking.staff_id ?? "",
        date,
        time,
        status: booking.status,
      };
    }
    return {
      contact_id: "",
      service_id: "",
      staff_id: "",
      date: new Date().toISOString().slice(0, 10),
      time: "10:00 AM",
      status: "upcoming" as string,
    };
  }, [booking]);

  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const service = services.find((s) => s.id === form.service_id);
    const scheduledAt = combineDateTime(form.date, form.time);

    const result = await onSave({
      contact_id: form.contact_id,
      service_id: form.service_id,
      staff_id: form.staff_id,
      scheduled_at: scheduledAt,
      duration_minutes: service?.duration_minutes ?? 60,
      status: form.status,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Booking" : "New Booking"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the appointment details below."
              : "Create a new appointment."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Customer</Label>
              <Select
                value={form.contact_id}
                onValueChange={(v) => update("contact_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.length === 0 ? (
                    <div className="px-2 py-1.5 text-xs text-[var(--ash)]">
                      No contacts yet
                    </div>
                  ) : (
                    contacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name ?? c.phone}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Service</Label>
              <Select
                value={form.service_id}
                onValueChange={(v) => update("service_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.length === 0 ? (
                    <div className="px-2 py-1.5 text-xs text-[var(--ash)]">
                      No services yet
                    </div>
                  ) : (
                    services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Staff</Label>
              <Select
                value={form.staff_id}
                onValueChange={(v) => update("staff_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.length === 0 ? (
                    <div className="px-2 py-1.5 text-xs text-[var(--ash)]">
                      No staff yet
                    </div>
                  ) : (
                    staffList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => update("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Time</Label>
              <Input
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                placeholder="e.g. 10:00 AM"
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="rounded-md bg-[var(--ember)]/10 border border-[var(--ember)]/30 px-3 py-2">
            <p className="text-xs text-[var(--ember)]">{error}</p>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !form.contact_id || !form.service_id}
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Create booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Order Dialog ──

function OrderDialog({
  open,
  onOpenChange,
  order,
  contacts,
  products,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: DbOrderRow | null;
  contacts: ContactOption[];
  products: ProductOption[];
  onSave: (form: {
    contact_id: string;
    items: Array<{ product_id: string; quantity: number }>;
    status: string;
  }) => Promise<{ error?: string }>;
}) {
  const isEdit = !!order;

  const defaultForm = useMemo(() => {
    if (order) {
      return {
        contact_id: order.contact_id,
        items: order.order_items.map((oi) => ({
          product_id: oi.product_id,
          quantity: oi.quantity,
          price: oi.unit_price,
        })),
        status: order.status,
      };
    }
    return {
      contact_id: "",
      items: [{ product_id: "", quantity: 1, price: 0 }],
      status: "pending" as string,
    };
  }, [order]);

  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateItem = (idx: number, field: string, value: unknown) =>
    setForm((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, items };
    });

  const addItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, price: 0 }],
    }));

  const removeItem = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));

  const total = form.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const items = form.items
      .filter((item) => item.product_id)
      .map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

    const result = await onSave({
      contact_id: form.contact_id,
      items,
      status: form.status,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Order" : "New Order"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the order details below."
              : "Create a new order."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Customer</Label>
              <Select
                value={form.contact_id}
                onValueChange={(v) => updateField("contact_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.length === 0 ? (
                    <div className="px-2 py-1.5 text-xs text-[var(--ash)]">
                      No contacts yet
                    </div>
                  ) : (
                    contacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name ?? c.phone}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => updateField("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Products</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addItem}
                className="gap-1 h-7 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add item
              </Button>
            </div>
            {form.items.map((item, idx) => (
              <div key={idx} className="flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  {idx === 0 && (
                    <Label className="text-[10px]">Product</Label>
                  )}
                  <Select
                    value={item.product_id}
                    onValueChange={(v) => {
                      const prod = products.find((p) => p.id === v);
                      updateItem(idx, "product_id", v);
                      if (prod) updateItem(idx, "price", prod.price);
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.length === 0 ? (
                        <div className="px-2 py-1.5 text-xs text-[var(--ash)]">
                          No products yet
                        </div>
                      ) : (
                        products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} — ${p.price}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-16 space-y-1.5">
                  {idx === 0 && (
                    <Label className="text-[10px]">Qty</Label>
                  )}
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, "quantity", Number(e.target.value))
                    }
                    className="h-9"
                  />
                </div>
                <div className="w-20 space-y-1.5">
                  {idx === 0 && (
                    <Label className="text-[10px]">Price</Label>
                  )}
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(idx, "price", Number(e.target.value))
                    }
                    className="h-9 font-[family-name:var(--font-jetbrains-mono)]"
                  />
                </div>
                {form.items.length > 1 && (
                  <button
                    onClick={() => removeItem(idx)}
                    className="p-1.5 rounded hover:bg-hover-bg transition-colors mb-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-[var(--ember)]" />
                  </button>
                )}
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <span className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-jetbrains-mono)]">
                Total: ${total}
              </span>
            </div>
          </div>
        </div>
        {error && (
          <div className="rounded-md bg-[var(--ember)]/10 border border-[var(--ember)]/30 px-3 py-2">
            <p className="text-xs text-[var(--ember)]">{error}</p>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !form.contact_id || form.items.length === 0}
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Create order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Calendar View (Service) ──

function BookingCalendar({
  bookings,
  onSelectDate,
}: {
  bookings: Booking[];
  onSelectDate: (date: string) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    }
    return map;
  }, [bookings]);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
            {monthLabel}
          </h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentMonth(new Date(year, month - 1, 1))
              }
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentMonth(new Date(year, month + 1, 1))
              }
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px text-[10px] font-medium text-[var(--ash)] mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px">
          {cells.map((day, i) => {
            if (day === null)
              return <div key={`empty-${i}`} className="min-h-[72px]" />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayBookings = bookingsByDate[dateStr] ?? [];
            const isToday = dateStr === todayStr;

            return (
              <button
                key={day}
                onClick={() => onSelectDate(dateStr)}
                className={cn(
                  "min-h-[72px] rounded-md border border-transparent p-1.5 text-left transition-colors hover:border-[var(--slate)] hover:bg-[var(--linen)]",
                  isToday && "border-[var(--cedar)] bg-[var(--mist)]",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium",
                    isToday
                      ? "text-[var(--cedar)] font-semibold"
                      : "text-[var(--ink)]",
                  )}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayBookings.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[9px] font-medium",
                        b.status === "upcoming" &&
                          "bg-[var(--mist)] text-[var(--cedar)]",
                        b.status === "completed" &&
                          "bg-[var(--linen)] text-[var(--ash)]",
                        b.status === "cancelled" &&
                          "bg-red-50 text-[var(--ember)]",
                      )}
                    >
                      {b.time} {b.customer.split(" ")[0]}
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-[9px] text-[var(--ash)]">
                      +{dayBookings.length - 3} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ──

export default function BookingsPage() {
  const { businessType } = useTenant();
  const variant: "service" | "product" =
    businessType === "Product" ? "product" : "service";

  const supabase = useMemo(() => createClient(), []);

  // ── Loading state ──
  const [loading, setLoading] = useState(true);

  // ── Raw DB data ──
  const [rawBookings, setRawBookings] = useState<DbBookingRow[]>([]);
  const [rawOrders, setRawOrders] = useState<DbOrderRow[]>([]);

  // ── Dropdown data ──
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  // ── Mapped display data ──
  const bookings = useMemo(
    () => rawBookings.map(mapDbBooking),
    [rawBookings],
  );
  const orders = useMemo(
    () => rawOrders.map(mapDbOrder),
    [rawOrders],
  );

  // ── Bookings state ──
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");
  const [bookingDateFrom, setBookingDateFrom] = useState("");
  const [bookingDateTo, setBookingDateTo] = useState("");
  const [bookingView, setBookingView] = useState<"table" | "calendar">("table");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<DbBookingRow | null>(
    null,
  );

  // ── Orders state ──
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderDateFrom, setOrderDateFrom] = useState("");
  const [orderDateTo, setOrderDateTo] = useState("");
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<DbOrderRow | null>(null);

  // ── Data fetching ──

  const fetchData = useCallback(async () => {
    setLoading(true);

    const [contactsResult, bookingsResult, ordersResult] = await Promise.all([
      supabase
        .from("contacts")
        .select("id, name, phone")
        .eq("is_blocked", false)
        .order("name"),
      supabase
        .from("bookings")
        .select(
          "*, contacts(name), services(name, duration_minutes), staff(name)",
        )
        .order("scheduled_at", { ascending: false }),
      supabase
        .from("orders")
        .select(
          "*, contacts(name), order_items(quantity, unit_price, product_id, products(name))",
        )
        .order("created_at", { ascending: false }),
    ]);

    if (contactsResult.data) setContacts(contactsResult.data);
    if (bookingsResult.data) setRawBookings(bookingsResult.data as DbBookingRow[]);
    if (ordersResult.data) setRawOrders(ordersResult.data as DbOrderRow[]);

    // Fetch offering options based on variant
    if (variant === "service") {
      const [servicesResult, staffResult] = await Promise.all([
        supabase
          .from("services")
          .select("id, name, duration_minutes")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("staff")
          .select("id, name")
          .eq("is_active", true)
          .order("name"),
      ]);
      if (servicesResult.data) setServiceOptions(servicesResult.data);
      if (staffResult.data) setStaffOptions(staffResult.data);
    } else {
      const productsResult = await supabase
        .from("products")
        .select("id, name, price, stock_quantity")
        .eq("is_active", true)
        .order("name");
      if (productsResult.data) setProductOptions(productsResult.data);
    }

    setLoading(false);
  }, [supabase, variant]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // ── Filtered data ──

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingStatusFilter !== "all" && b.status !== bookingStatusFilter)
        return false;
      if (bookingDateFrom && b.date < bookingDateFrom) return false;
      if (bookingDateTo && b.date > bookingDateTo) return false;
      return true;
    });
  }, [bookings, bookingStatusFilter, bookingDateFrom, bookingDateTo]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== "all" && o.status !== orderStatusFilter)
        return false;
      if (orderDateFrom && o.date < orderDateFrom) return false;
      if (orderDateTo && o.date > orderDateTo) return false;
      return true;
    });
  }, [orders, orderStatusFilter, orderDateFrom, orderDateTo]);

  // ── Booking CRUD ──

  const saveBooking = useCallback(
    async (form: {
      contact_id: string;
      service_id: string;
      staff_id: string;
      scheduled_at: string;
      duration_minutes: number;
      status: string;
    }): Promise<{ error?: string }> => {
      if (editingBooking) {
        // Detect whether only status changed — skip conflict check for that case
        const { date: origDate, time: origTime } = formatScheduledAt(
          editingBooking.scheduled_at,
        );
        const { date: formDate, time: formTime } = formatScheduledAt(
          form.scheduled_at,
        );
        const statusOnlyChange =
          form.contact_id === editingBooking.contact_id &&
          form.service_id === editingBooking.service_id &&
          form.staff_id === (editingBooking.staff_id ?? "") &&
          formDate === origDate &&
          formTime === origTime;

        if (statusOnlyChange) {
          const { data, error } = await supabase
            .from("bookings")
            .update({ status: form.status })
            .eq("id", editingBooking.id)
            .select(
              "*, contacts(name), services(name, duration_minutes), staff(name)",
            )
            .single();

          if (error) return { error: error.message };
          setRawBookings((prev) =>
            prev.map((b) =>
              b.id === editingBooking.id ? (data as DbBookingRow) : b,
            ),
          );
          setEditingBooking(null);
          return {};
        }

        // Detail fields changed — cancel old booking, create new via RPC (triggers conflict check)
        const { error: cancelError } = await supabase
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("id", editingBooking.id);

        if (cancelError) return { error: cancelError.message };

        const { data, error } = await supabase.rpc("create_booking", {
          p_contact_id: form.contact_id,
          p_service_id: form.service_id,
          p_staff_id: form.staff_id || null,
          p_scheduled_at: form.scheduled_at,
          p_duration_minutes: form.duration_minutes,
        });

        if (error) return { error: error.message };

        const { data: fullBooking } = await supabase
          .from("bookings")
          .select(
            "*, contacts(name), services(name, duration_minutes), staff(name)",
          )
          .eq("id", (data as DbBookingRow).id)
          .single();

        setRawBookings((prev) => {
          const without = prev.filter((b) => b.id !== editingBooking.id);
          return [((fullBooking ?? data) as DbBookingRow), ...without];
        });
        setEditingBooking(null);
        return {};
      }

      const { data, error } = await supabase.rpc("create_booking", {
        p_contact_id: form.contact_id,
        p_service_id: form.service_id,
        p_staff_id: form.staff_id || null,
        p_scheduled_at: form.scheduled_at,
        p_duration_minutes: form.duration_minutes,
      });

      if (error) return { error: error.message };

      const { data: fullBooking } = await supabase
        .from("bookings")
        .select(
          "*, contacts(name), services(name, duration_minutes), staff(name)",
        )
        .eq("id", (data as DbBookingRow).id)
        .single();

      if (fullBooking) {
        setRawBookings((prev) => [fullBooking as DbBookingRow, ...prev]);
      } else {
        setRawBookings((prev) => [data as DbBookingRow, ...prev]);
      }
      return {};
    },
    [editingBooking, supabase],
  );

  const deleteBooking = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (!error) {
        setRawBookings((prev) => prev.filter((b) => b.id !== id));
      }
    },
    [supabase],
  );

  // ── Order CRUD ──

  const saveOrder = useCallback(
    async (form: {
      contact_id: string;
      items: Array<{ product_id: string; quantity: number }>;
      status: string;
    }): Promise<{ error?: string }> => {
      if (editingOrder) {
        // Detect whether only status changed — skip stock check for that case
        const origItemsMap = new Map(
          editingOrder.order_items.map((oi) => [oi.product_id, oi.quantity]),
        );
        const itemsChanged =
          form.items.length !== editingOrder.order_items.length ||
          form.items.some((item) => {
            const origQty = origItemsMap.get(item.product_id);
            return origQty === undefined || origQty !== item.quantity;
          });
        const contactChanged = form.contact_id !== editingOrder.contact_id;
        const statusOnlyChange = !itemsChanged && !contactChanged;

        if (statusOnlyChange) {
          const { data, error } = await supabase
            .from("orders")
            .update({ status: form.status })
            .eq("id", editingOrder.id)
            .select(
              "*, contacts(name), order_items(quantity, unit_price, product_id, products(name))",
            )
            .single();

          if (error) return { error: error.message };
          setRawOrders((prev) =>
            prev.map((o) =>
              o.id === editingOrder.id ? (data as DbOrderRow) : o,
            ),
          );
          setEditingOrder(null);
          return {};
        }

        // Items or contact changed — cancel old order, create new via RPC (triggers stock check)
        const { error: cancelError } = await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", editingOrder.id);

        if (cancelError) return { error: cancelError.message };

        const { data, error } = await supabase.rpc("create_order", {
          p_contact_id: form.contact_id,
          p_items: form.items,
        });

        if (error) return { error: error.message };

        const { data: fullOrder } = await supabase
          .from("orders")
          .select(
            "*, contacts(name), order_items(quantity, unit_price, product_id, products(name))",
          )
          .eq("id", (data as DbOrderRow).id)
          .single();

        setRawOrders((prev) => {
          const without = prev.filter((o) => o.id !== editingOrder.id);
          return [((fullOrder ?? data) as DbOrderRow), ...without];
        });
        setEditingOrder(null);
        return {};
      }

      const { data, error } = await supabase.rpc("create_order", {
        p_contact_id: form.contact_id,
        p_items: form.items,
      });

      if (error) return { error: error.message };

      const { data: fullOrder } = await supabase
        .from("orders")
        .select(
          "*, contacts(name), order_items(quantity, unit_price, product_id, products(name))",
        )
        .eq("id", (data as DbOrderRow).id)
        .single();

      if (fullOrder) {
        setRawOrders((prev) => [fullOrder as DbOrderRow, ...prev]);
      } else {
        setRawOrders((prev) => [data as DbOrderRow, ...prev]);
      }
      return {};
    },
    [editingOrder, supabase],
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (!error) {
        setRawOrders((prev) => prev.filter((o) => o.id !== id));
      }
    },
    [supabase],
  );

  const clearBookingFilters = () => {
    setBookingStatusFilter("all");
    setBookingDateFrom("");
    setBookingDateTo("");
  };

  const clearOrderFilters = () => {
    setOrderStatusFilter("all");
    setOrderDateFrom("");
    setOrderDateTo("");
  };

  const hasBookingFilters =
    bookingStatusFilter !== "all" || bookingDateFrom || bookingDateTo;

  const hasOrderFilters =
    orderStatusFilter !== "all" || orderDateFrom || orderDateTo;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          {variant === "service" ? "Bookings" : "Orders"}
        </h1>
        <p className="text-sm text-[var(--ash)] mt-1">
          {variant === "service"
            ? "Manage appointments and your booking calendar."
            : "Track and manage customer orders."}
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-[var(--ash)]">Loading…</p>
        </div>
      )}

      {!loading && (
        <>
          {/* ══════════════════════════════════════════════════════════════════════
              SERVICE VARIANT — Appointments
              ══════════════════════════════════════════════════════════════════════ */}

          {variant === "service" && (
            <section>
              <SectionHeading
                icon={CalendarDays}
                title="Appointments"
                description="View and manage customer bookings."
              />

              {/* Filters row */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-end gap-3">
                    {/* Status filter */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">Status</Label>
                      <div className="flex gap-1.5">
                        {bookingStatuses.map((s) => (
                          <button
                            key={s}
                            onClick={() => setBookingStatusFilter(s)}
                            className={cn(
                              "rounded-md border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                              bookingStatusFilter === s
                                ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                                : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator orientation="vertical" className="h-8" />

                    {/* Date range */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">From</Label>
                      <Input
                        type="date"
                        value={bookingDateFrom}
                        onChange={(e) => setBookingDateFrom(e.target.value)}
                        className="h-8 w-[140px] text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">To</Label>
                      <Input
                        type="date"
                        value={bookingDateTo}
                        onChange={(e) => setBookingDateTo(e.target.value)}
                        className="h-8 w-[140px] text-xs"
                      />
                    </div>

                    {hasBookingFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearBookingFilters}
                        className="gap-1 h-8 text-xs text-[var(--ash)]"
                      >
                        <X className="h-3 w-3" />
                        Clear
                      </Button>
                    )}

                    <div className="flex-1" />

                    {/* View toggle + Add */}
                    <div className="flex gap-1.5">
                      <div className="flex rounded-md border border-[var(--slate)] overflow-hidden">
                        <button
                          onClick={() => setBookingView("table")}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors",
                            bookingView === "table"
                              ? "bg-[var(--mist)] text-[var(--cedar)]"
                              : "text-[var(--ash)] hover:bg-[var(--linen)]",
                          )}
                        >
                          <List className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setBookingView("calendar")}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1 text-xs font-medium transition-colors border-l border-[var(--slate)]",
                            bookingView === "calendar"
                              ? "bg-[var(--mist)] text-[var(--cedar)]"
                              : "text-[var(--ash)] hover:bg-[var(--linen)]",
                          )}
                        >
                          <CalendarIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingBooking(null);
                          setBookingDialogOpen(true);
                        }}
                        className="gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add booking
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Table view */}
              {bookingView === "table" && (
                <Card>
                  <CardContent className="p-5">
                    <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Staff</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-20" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)]">
                                  <CalendarDays className="h-5 w-5 text-[var(--ash)]" />
                                </div>
                                <p className="text-sm font-medium text-[var(--ink)]">
                                  {hasBookingFilters
                                    ? "No bookings match your filters."
                                    : "No bookings yet."}
                                </p>
                                <p className="text-xs text-[var(--ash)] max-w-[240px]">
                                  {hasBookingFilters
                                    ? "Try widening your date range or clearing the status filter."
                                    : "New appointments will appear here as customers book through WhatsApp."}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredBookings.map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>
                                <p className="font-medium text-[var(--ink)]">
                                  {b.customer}
                                </p>
                              </TableCell>
                              <TableCell className="text-sm text-[var(--ink)]">
                                {b.service}
                              </TableCell>
                              <TableCell className="text-sm text-[var(--ash)]">
                                {b.staff}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-[var(--ink)]">
                                  {formatDate(b.date)}
                                </div>
                                <div className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-[var(--ash)]">
                                  {b.time}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] capitalize",
                                    statusColors[b.status],
                                  )}
                                >
                                  {b.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      const raw = rawBookings.find(
                                        (rb) => rb.id === b.id,
                                      );
                                      setEditingBooking(raw ?? null);
                                      setBookingDialogOpen(true);
                                    }}
                                    className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                                  >
                                    <Edit className="h-3.5 w-3.5 text-[var(--ash)]" />
                                  </button>
                                  <button
                                    onClick={() => deleteBooking(b.id)}
                                    className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Calendar view */}
              {bookingView === "calendar" && (
                <BookingCalendar
                  bookings={bookings}
                  onSelectDate={(date) => {
                    setBookingDateFrom(date);
                    setBookingDateTo(date);
                    setBookingView("table");
                  }}
                />
              )}

              <BookingDialog
                key={editingBooking?.id ?? "new"}
                open={bookingDialogOpen}
                onOpenChange={(v) => {
                  setBookingDialogOpen(v);
                  if (!v) setEditingBooking(null);
                }}
                booking={editingBooking}
                contacts={contacts}
                services={serviceOptions}
                staffList={staffOptions}
                onSave={saveBooking}
              />
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              PRODUCT VARIANT — Orders
              ══════════════════════════════════════════════════════════════════════ */}

          {variant === "product" && (
            <section>
              <SectionHeading
                icon={Package}
                title="Orders"
                description="Track and fulfill customer orders."
              />

              {/* Filters row */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-end gap-3">
                    {/* Status filter */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">Status</Label>
                      <div className="flex gap-1.5">
                        {orderStatuses.map((s) => (
                          <button
                            key={s}
                            onClick={() => setOrderStatusFilter(s)}
                            className={cn(
                              "rounded-md border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                              orderStatusFilter === s
                                ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                                : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator orientation="vertical" className="h-8" />

                    {/* Date range */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">From</Label>
                      <Input
                        type="date"
                        value={orderDateFrom}
                        onChange={(e) => setOrderDateFrom(e.target.value)}
                        className="h-8 w-[140px] text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px]">To</Label>
                      <Input
                        type="date"
                        value={orderDateTo}
                        onChange={(e) => setOrderDateTo(e.target.value)}
                        className="h-8 w-[140px] text-xs"
                      />
                    </div>

                    {hasOrderFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearOrderFilters}
                        className="gap-1 h-8 text-xs text-[var(--ash)]"
                      >
                        <X className="h-3 w-3" />
                        Clear
                      </Button>
                    )}

                    <div className="flex-1" />

                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingOrder(null);
                        setOrderDialogOpen(true);
                      }}
                      className="gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add order
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)]">
                                <Package className="h-5 w-5 text-[var(--ash)]" />
                              </div>
                              <p className="text-sm font-medium text-[var(--ink)]">
                                {hasOrderFilters
                                  ? "No orders match your filters."
                                  : "No orders yet."}
                              </p>
                              <p className="text-xs text-[var(--ash)] max-w-[240px]">
                                {hasOrderFilters
                                  ? "Try widening your date range or clearing the status filter."
                                  : "Orders will appear here as customers make purchases through WhatsApp."}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell>
                              <p className="font-medium text-[var(--ink)]">
                                {o.customer}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                {o.products.map((p, i) => (
                                  <div
                                    key={i}
                                    className="text-sm text-[var(--ink)]"
                                  >
                                    {p.name}
                                    <span className="text-[var(--ash)] ml-1">
                                      ×{p.qty}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-sm font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                                ${o.total}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-[var(--ash)]">
                              {formatDate(o.date)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] capitalize",
                                  statusColors[o.status],
                                )}
                              >
                                {o.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    const raw = rawOrders.find(
                                      (ro) => ro.id === o.id,
                                    );
                                    setEditingOrder(raw ?? null);
                                    setOrderDialogOpen(true);
                                  }}
                                  className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                                >
                                  <Edit className="h-3.5 w-3.5 text-[var(--ash)]" />
                                </button>
                                <button
                                  onClick={() => deleteOrder(o.id)}
                                  className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>

              <OrderDialog
                key={editingOrder?.id ?? "new"}
                open={orderDialogOpen}
                onOpenChange={(v) => {
                  setOrderDialogOpen(v);
                  if (!v) setEditingOrder(null);
                }}
                order={editingOrder}
                contacts={contacts}
                products={productOptions}
                onSave={saveOrder}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
