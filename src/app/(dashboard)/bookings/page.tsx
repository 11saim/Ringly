"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Sparkline } from "@/components/app/Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Design Tokens ── */

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";
const CARD_HEADER = "px-5 py-3.5 border-b border-border/25";
const SECTION_GAP = "space-y-5";

/* ── Animation Variants ── */

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ── Data ── */

type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

interface Booking {
  id: string;
  customer: string;
  initials: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  assigned: string;
}

const bookings: Booking[] = [
  { id: "b1", customer: "Ahmed Khan", initials: "AK", service: "Hair Coloring", date: "Today", time: "10:00 AM", status: "Confirmed", assigned: "Ana" },
  { id: "b2", customer: "Fatima Rashid", initials: "FR", service: "Hair Cut", date: "Today", time: "11:30 AM", status: "Pending", assigned: "Luis" },
  { id: "b3", customer: "Sofia Martinez", initials: "SM", service: "Balayage", date: "Today", time: "1:00 PM", status: "Confirmed", assigned: "Ana" },
  { id: "b4", customer: "James Lee", initials: "JL", service: "Beard Trim", date: "Today", time: "2:30 PM", status: "Confirmed", assigned: "Camila" },
  { id: "b5", customer: "Layla Hassan", initials: "LH", service: "Blowout", date: "Today", time: "3:00 PM", status: "Pending", assigned: "Ana" },
  { id: "b6", customer: "Omar Siddiqui", initials: "OS", service: "Hair Treatment", date: "Tomorrow", time: "9:00 AM", status: "Confirmed", assigned: "Luis" },
  { id: "b7", customer: "Nour Al-Rashid", initials: "NR", service: "Women's Haircut", date: "Tomorrow", time: "10:30 AM", status: "Pending", assigned: "Ana" },
  { id: "b8", customer: "Maria Garcia", initials: "MG", service: "Color Touch-up", date: "Tomorrow", time: "11:00 AM", status: "Cancelled", assigned: "Camila" },
  { id: "b9", customer: "Ali Nagi", initials: "AN", service: "Men's Haircut", date: "Jul 28", time: "9:00 AM", status: "Confirmed", assigned: "Luis" },
  { id: "b10", customer: "Kenji Park", initials: "KP", service: "Deep Conditioning", date: "Jul 28", time: "2:00 PM", status: "Confirmed", assigned: "Ana" },
  { id: "b11", customer: "Priya Shah", initials: "PS", service: "Bridal Package", date: "Jul 29", time: "9:00 AM", status: "Confirmed", assigned: "Ana" },
  { id: "b12", customer: "Diego Alvarez", initials: "DA", service: "Men's Haircut", date: "Jul 29", time: "11:00 AM", status: "Pending", assigned: "Camila" },
];

const todaySchedule = [
  { time: "10:00 AM", customer: "Ahmed Khan", service: "Hair Coloring", status: "Confirmed" as const },
  { time: "11:30 AM", customer: "Fatima Rashid", service: "Hair Cut", status: "Pending" as const },
  { time: "1:00 PM", customer: "Sofia Martinez", service: "Balayage", status: "Confirmed" as const },
  { time: "2:30 PM", customer: "James Lee", service: "Beard Trim", status: "Confirmed" as const },
  { time: "3:00 PM", customer: "Layla Hassan", service: "Blowout", status: "Pending" as const },
];

const statusBreakdown = [
  { label: "Confirmed", count: 7, color: "text-success" },
  { label: "Pending", count: 4, color: "text-[#c98a1a]" },
  { label: "Cancelled", count: 1, color: "text-destructive" },
];

const ITEMS_PER_PAGE = 10;

/* ── Stat Card ── */

function StatCard({
  label,
  value,
  suffix,
  trend,
  trendUp,
  sparkline,
  color,
  icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  trend: string;
  trendUp: boolean;
  sparkline: number[];
  color: string;
  icon: React.ElementType;
}) {
  const count = useCountUp(value, 1400);
  const Icon = icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(
        CARD,
        "p-5 cursor-default transition-all duration-150",
        "hover:shadow-[var(--shadow-card-hover)] hover:border-border/50",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase">
          {label}
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-muted/50">
          <Icon size={14} strokeWidth={1.8} className="text-muted-foreground/40" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[32px] font-bold text-foreground tracking-[-0.03em] leading-none tabular-nums">
            {count.toLocaleString()}{suffix ?? ""}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={cn("text-[11px] font-semibold", trendUp ? "text-success" : "text-destructive")}>
              {trend}
            </span>
          </div>
        </div>
        <Sparkline data={sparkline} color={color} />
      </div>
    </motion.div>
  );
}

/* ── Page ── */

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = bookings.filter((b) => {
      const matchesSearch = searchQuery
        ? b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.assigned.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortOrder === "desc") {
      result = [...result].reverse();
    }

    return result;
  }, [searchQuery, statusFilter, sortOrder]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <AppShell fullWidth>
      <div className={SECTION_GAP}>
        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-end justify-between"
        >
          <div>
            <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] leading-none">
              Bookings
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground/50">
              Manage appointments and booking schedule.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium",
                "border border-border/50 bg-card text-foreground/70",
                "transition-all duration-150 hover:bg-hover-bg hover:text-foreground hover:border-border/80",
                showFilters && "bg-hover-bg text-foreground border-border/80",
              )}
            >
              <Search size={14} strokeWidth={1.8} />
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium",
                "border border-border/50 bg-card text-foreground/70",
                "transition-all duration-150 hover:bg-hover-bg hover:text-foreground hover:border-border/80",
                showFilters && "bg-hover-bg text-foreground border-border/80",
              )}
            >
              <SlidersHorizontal size={14} strokeWidth={1.8} />
              Filter
            </button>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-medium",
                "border border-border/50 bg-card text-foreground/70",
                "transition-all duration-150 hover:bg-hover-bg hover:text-foreground hover:border-border/80",
              )}
            >
              <ArrowUpDown size={14} strokeWidth={1.8} />
              Sort
            </button>
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold",
                "bg-accent text-white transition-all duration-150",
                "hover:bg-accent-hover",
              )}
            >
              <Plus size={14} strokeWidth={2} />
              New Booking
            </button>
          </div>
        </motion.div>

        {/* ── FILTERS ── */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
              <input
                type="text"
                placeholder="Search by customer, service, or staff..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-[320px] h-[36px] rounded-[10px] border border-border/40 bg-muted/30 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {(["all", "Confirmed", "Pending", "Cancelled"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "h-[36px] rounded-[10px] px-3 text-[13px] font-medium transition-all duration-150",
                    statusFilter === status
                      ? "bg-foreground/5 text-foreground border border-border/40"
                      : "text-muted-foreground/50 hover:text-foreground hover:bg-hover-bg",
                  )}
                >
                  {status === "all" ? "All" : status}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── STAT CARDS ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Bookings"
            value={12}
            trend="+3 this week"
            trendUp
            sparkline={[4, 6, 5, 8, 7, 9, 10, 8, 11, 10, 12, 12]}
            color="#6366f1"
            icon={Calendar}
          />
          <StatCard
            label="Today's Bookings"
            value={5}
            trend="On track"
            trendUp
            sparkline={[2, 3, 2, 4, 3, 5, 4, 5, 5, 4, 5, 5]}
            color="#22c55e"
            icon={CalendarDays}
          />
          <StatCard
            label="Upcoming"
            value={7}
            trend="Next 7 days"
            trendUp
            sparkline={[3, 4, 5, 4, 6, 5, 7, 6, 7, 7, 7, 7]}
            color="#8b5cf6"
            icon={Clock}
          />
          <StatCard
            label="Completed"
            value={24}
            trend="+8 this week"
            trendUp
            sparkline={[10, 12, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24]}
            color="#f59e0b"
            icon={CheckCircle2}
          />
        </motion.div>

        {/* ── MAIN CONTENT ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          {/* ── Bookings Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className={cn(CARD, "flex flex-col overflow-hidden")}
          >
            <div className={cn(CARD_HEADER, "flex items-center justify-between")}>
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold text-foreground">All Bookings</h2>
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground/60 tabular-nums">
                  {filtered.length}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground/40">
                Showing {paginated.length} of {filtered.length}
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full">
                <thead className="sticky top-0 bg-card z-10">
                  <tr className="border-b border-border/25">
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Customer</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Service</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Date</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Time</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Status</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Assigned</th>
                    <th className="px-5 py-2.5 w-[60px] text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((booking, i) => (
                    <motion.tr
                      key={booking.id}
                      variants={fadeUp}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={cn(
                        "border-b border-border/15 transition-all duration-150 cursor-pointer",
                        hoveredRow === i && "bg-hover-bg/50",
                      )}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground/60">
                            {booking.initials}
                          </div>
                          <span className="text-[13px] font-semibold text-foreground">{booking.customer}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-muted-foreground/55">{booking.service}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-muted-foreground/55">{booking.date}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-medium text-foreground/70 tabular-nums">{booking.time}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex h-[18px] items-center gap-1 rounded-full px-2 text-[10px] font-semibold tracking-wide",
                            booking.status === "Confirmed" && "bg-success/[0.08] text-success",
                            booking.status === "Pending" && "bg-[rgba(217,119,6,0.1)] text-[#c98a1a]",
                            booking.status === "Cancelled" && "bg-destructive/[0.08] text-destructive",
                          )}
                        >
                          {booking.status === "Confirmed" && <CheckCircle2 size={9} strokeWidth={2} />}
                          {booking.status === "Pending" && <Clock size={9} strokeWidth={2} />}
                          {booking.status === "Cancelled" && <XCircle size={9} strokeWidth={2} />}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-muted-foreground/55">{booking.assigned}</span>
                      </td>
                      <td className="px-5 py-3 w-[60px]">
                        <div className={cn(
                          "flex items-center gap-1 transition-opacity duration-150",
                          hoveredRow === i ? "opacity-100" : "opacity-0",
                        )}>
                          <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground">
                            <MoreHorizontal size={12} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-muted/50 mb-4">
                  <Calendar size={22} strokeWidth={1.5} className="text-muted-foreground/25" />
                </div>
                <p className="text-[13px] font-semibold text-foreground/60 mb-1">No bookings found</p>
                <p className="text-[12px] text-muted-foreground/40 max-w-[200px] leading-relaxed">
                  {searchQuery ? "Try adjusting your search." : "Create your first booking to get started."}
                </p>
              </div>
            )}

            {/* ── Pagination ── */}
            {filtered.length > ITEMS_PER_PAGE && (
              <div className={cn(CARD_HEADER, "border-t border-border/25 flex items-center justify-between")}>
                <span className="text-[11px] text-muted-foreground/40">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-[6px] transition-all duration-150",
                      currentPage === 1
                        ? "text-muted-foreground/25 cursor-not-allowed"
                        : "text-muted-foreground/50 hover:bg-hover-bg hover:text-foreground",
                    )}
                  >
                    <ChevronLeft size={14} strokeWidth={1.8} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-[6px] text-[12px] font-medium transition-all duration-150",
                        page === currentPage
                          ? "bg-foreground/5 text-foreground"
                          : "text-muted-foreground/50 hover:bg-hover-bg hover:text-foreground",
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-[6px] transition-all duration-150",
                      currentPage === totalPages
                        ? "text-muted-foreground/25 cursor-not-allowed"
                        : "text-muted-foreground/50 hover:bg-hover-bg hover:text-foreground",
                    )}
                  >
                    <ChevronRight size={14} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-4">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className={cn(CARD, "overflow-hidden")}
            >
              <div className={CARD_HEADER}>
                <h2 className="text-[13px] font-semibold text-foreground">Today&apos;s Schedule</h2>
              </div>
              <div>
                {todaySchedule.map((item, i) => (
                  <div
                    key={`${item.customer}-${item.time}`}
                    className={cn(
                      "px-5 py-3 transition-colors duration-150 hover:bg-hover-bg/50",
                      i < todaySchedule.length - 1 && "border-b border-border/15",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-semibold text-foreground/80 tabular-nums">{item.time}</span>
                      <span
                        className={cn(
                          "inline-flex h-[16px] items-center rounded-full px-1.5 text-[9px] font-semibold tracking-wide",
                          item.status === "Confirmed"
                            ? "bg-success/[0.08] text-success"
                            : "bg-[rgba(217,119,6,0.1)] text-[#c98a1a]",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-foreground">{item.customer}</p>
                    <p className="text-[11px] text-muted-foreground/45 mt-0.5">{item.service}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Booking Status */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className={cn(CARD, "overflow-hidden")}
            >
              <div className={CARD_HEADER}>
                <h2 className="text-[13px] font-semibold text-foreground">Booking Status</h2>
              </div>
              <div className="p-5 space-y-3">
                {statusBreakdown.map((item, i) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center justify-between",
                      i < statusBreakdown.length - 1 && "pb-3 border-b border-border/15",
                    )}
                  >
                    <span className="text-[13px] text-foreground/70">{item.label}</span>
                    <span className={cn("text-[16px] font-bold tabular-nums", item.color)}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
