"use client";

import { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  List,
  Package,
  Plus,
  Scissors,
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
import {
  mockBookings,
  mockOrders,
  mockServices,
  mockProducts,
  type Booking,
  type Order,
} from "@/lib/data";
import { cn } from "@/lib/utils";

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
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  booking: Booking | null;
  onSave: (data: Omit<Booking, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Booking, "id">>(
    booking ?? {
      customer: "",
      service: "",
      staff: "",
      date: new Date().toISOString().slice(0, 10),
      time: "10:00 AM",
      status: "upcoming",
      notes: "",
    },
  );

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{booking ? "Edit Booking" : "New Booking"}</DialogTitle>
          <DialogDescription>
            {booking
              ? "Update the appointment details below."
              : "Create a new appointment."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Customer</Label>
              <Input
                value={form.customer}
                onChange={(e) => update("customer", e.target.value)}
                placeholder="e.g. Sarah Ahmed"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Service</Label>
              <Select
                value={form.service}
                onValueChange={(v) => update("service", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {mockServices.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Staff</Label>
              <Select
                value={form.staff}
                onValueChange={(v) => update("staff", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {["Sarah A.", "Ali K.", "Maria G.", "Priya P."].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  update("status", v as Booking["status"])
                }
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
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Input
              value={form.notes ?? ""}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Internal notes about this booking"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(form);
              onOpenChange(false);
            }}
            disabled={!form.customer || !form.service}
          >
            {booking ? "Save changes" : "Create booking"}
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
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: Order | null;
  onSave: (data: Omit<Order, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Order, "id">>(
    order ?? {
      customer: "",
      products: [{ name: "", qty: 1, price: 0 }],
      total: 0,
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
    },
  );

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateProduct = (idx: number, field: string, value: unknown) =>
    setForm((prev) => {
      const products = [...prev.products];
      products[idx] = { ...products[idx], [field]: value };
      const total = products.reduce((sum, p) => sum + p.price * p.qty, 0);
      return { ...prev, products, total };
    });

  const addProduct = () =>
    setForm((prev) => ({
      ...prev,
      products: [...prev.products, { name: "", qty: 1, price: 0 }],
    }));

  const removeProduct = (idx: number) =>
    setForm((prev) => {
      const products = prev.products.filter((_, i) => i !== idx);
      const total = products.reduce((sum, p) => sum + p.price * p.qty, 0);
      return { ...prev, products, total };
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "New Order"}</DialogTitle>
          <DialogDescription>
            {order
              ? "Update the order details below."
              : "Create a new order."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Customer</Label>
              <Input
                value={form.customer}
                onChange={(e) => update("customer", e.target.value)}
                placeholder="e.g. James Wilson"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => update("status", v as Order["status"])}
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
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Products</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addProduct}
                className="gap-1 h-7 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add item
              </Button>
            </div>
            {form.products.map((p, idx) => (
              <div key={idx} className="flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  {idx === 0 && <Label className="text-[10px]">Product</Label>}
                  <Select
                    value={p.name}
                    onValueChange={(v) => {
                      const prod = mockProducts.find((mp) => mp.name === v);
                      updateProduct(idx, "name", v);
                      if (prod) updateProduct(idx, "price", prod.price);
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((mp) => (
                        <SelectItem key={mp.id} value={mp.name}>
                          {mp.name} — ${mp.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-16 space-y-1.5">
                  {idx === 0 && <Label className="text-[10px]">Qty</Label>}
                  <Input
                    type="number"
                    min={1}
                    value={p.qty}
                    onChange={(e) =>
                      updateProduct(idx, "qty", Number(e.target.value))
                    }
                    className="h-9"
                  />
                </div>
                <div className="w-20 space-y-1.5">
                  {idx === 0 && <Label className="text-[10px]">Price</Label>}
                  <Input
                    type="number"
                    value={p.price}
                    onChange={(e) =>
                      updateProduct(idx, "price", Number(e.target.value))
                    }
                    className="h-9 font-[family-name:var(--font-jetbrains-mono)]"
                  />
                </div>
                {form.products.length > 1 && (
                  <button
                    onClick={() => removeProduct(idx)}
                    className="p-1.5 rounded hover:bg-hover-bg transition-colors mb-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-[var(--ember)]" />
                  </button>
                )}
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <span className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-jetbrains-mono)]">
                Total: ${form.total}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(form);
              onOpenChange(false);
            }}
            disabled={!form.customer || form.products.length === 0}
          >
            {order ? "Save changes" : "Create order"}
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
  // Dev toggle — in production this comes from useTenant().businessType
  const [variant, setVariant] = useState<"service" | "product">("service");

  // ── Bookings state ──
  const [bookings, setBookings] = useState(mockBookings);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");
  const [bookingDateFrom, setBookingDateFrom] = useState("");
  const [bookingDateTo, setBookingDateTo] = useState("");
  const [bookingView, setBookingView] = useState<"table" | "calendar">("table");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // ── Orders state ──
  const [orders, setOrders] = useState(mockOrders);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderDateFrom, setOrderDateFrom] = useState("");
  const [orderDateTo, setOrderDateTo] = useState("");
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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

  const saveBooking = (data: Omit<Booking, "id">) => {
    if (editingBooking) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === editingBooking.id ? { ...data, id: b.id } : b,
        ),
      );
    } else {
      setBookings((prev) => [
        ...prev,
        { ...data, id: `b-${Date.now()}` },
      ]);
    }
    setEditingBooking(null);
  };

  const deleteBooking = (id: string) =>
    setBookings((prev) => prev.filter((b) => b.id !== id));

  // ── Order CRUD ──

  const saveOrder = (data: Omit<Order, "id">) => {
    if (editingOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id ? { ...data, id: o.id } : o,
        ),
      );
    } else {
      setOrders((prev) => [
        ...prev,
        { ...data, id: `o-${Date.now()}` },
      ]);
    }
    setEditingOrder(null);
  };

  const deleteOrder = (id: string) =>
    setOrders((prev) => prev.filter((o) => o.id !== id));

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

      {/* Dev toggle */}
      <div className="rounded-lg border border-dashed border-[var(--amber)]/40 bg-[var(--amber)]/5 px-4 py-3 mb-6">
        <p className="text-xs font-medium text-[var(--amber)] mb-2">
          Dev preview toggle
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={variant === "service" ? "default" : "outline"}
            onClick={() => setVariant("service")}
            className="gap-1.5"
          >
            <Scissors className="h-3.5 w-3.5" />
            Service variant
          </Button>
          <Button
            size="sm"
            variant={variant === "product" ? "default" : "outline"}
            onClick={() => setVariant("product")}
            className="gap-1.5"
          >
            <Package className="h-3.5 w-3.5" />
            Product variant
          </Button>
        </div>
      </div>

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
                                  setEditingBooking(b);
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
            open={bookingDialogOpen}
            onOpenChange={(v) => {
              setBookingDialogOpen(v);
              if (!v) setEditingBooking(null);
            }}
            booking={editingBooking}
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
                                setEditingOrder(o);
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
            open={orderDialogOpen}
            onOpenChange={(v) => {
              setOrderDialogOpen(v);
              if (!v) setEditingOrder(null);
            }}
            order={editingOrder}
            onSave={saveOrder}
          />
        </section>
      )}
    </div>
  );
}
