"use client";

import { useState, useMemo, useCallback } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Sparkline } from "@/components/app/Sparkline";
import { useCountUp } from "@/hooks/useCountUp";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
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
  Package,
  DollarSign,
  X,
  CreditCard,
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

type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";
type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  initials: string;
  items: OrderItem[];
  date: string;
  total: number;
  payment: PaymentStatus;
  status: OrderStatus;
  notes: string;
}

const orders: Order[] = [
  { id: "#4821", customer: "Ahmed Khan", initials: "AK", items: [{ name: "Hair Coloring", quantity: 1, price: 450 }], date: "Today", total: 450, payment: "Paid", status: "Completed", notes: "Regular customer" },
  { id: "#4820", customer: "Fatima Rashid", initials: "FR", items: [{ name: "Hair Cut", quantity: 1, price: 180 }, { name: "Blowout", quantity: 1, price: 120 }], date: "Today", total: 300, payment: "Paid", status: "Processing", notes: "" },
  { id: "#4819", customer: "Sofia Martinez", initials: "SM", items: [{ name: "Balayage", quantity: 1, price: 650 }], date: "Today", total: 650, payment: "Unpaid", status: "Pending", notes: "Deposit pending" },
  { id: "#4818", customer: "James Lee", initials: "JL", items: [{ name: "Men's Haircut", quantity: 1, price: 140 }, { name: "Beard Trim", quantity: 1, price: 80 }], date: "Yesterday", total: 220, payment: "Paid", status: "Completed", notes: "" },
  { id: "#4817", customer: "Layla Hassan", initials: "LH", items: [{ name: "Deep Conditioning", quantity: 1, price: 150 }], date: "Yesterday", total: 150, payment: "Paid", status: "Completed", notes: "" },
  { id: "#4816", customer: "Omar Siddiqui", initials: "OS", items: [{ name: "Bridal Package", quantity: 1, price: 850 }], date: "Jul 24", total: 850, payment: "Paid", status: "Completed", notes: "Weekend appointment" },
  { id: "#4815", customer: "Nour Al-Rashid", initials: "NR", items: [{ name: "Color Touch-up", quantity: 1, price: 280 }], date: "Jul 24", total: 280, payment: "Refunded", status: "Cancelled", notes: "Cancelled 24h before" },
  { id: "#4814", customer: "Maria Garcia", initials: "MG", items: [{ name: "Women's Haircut", quantity: 1, price: 200 }, { name: "Blowout", quantity: 1, price: 120 }], date: "Jul 23", total: 320, payment: "Paid", status: "Completed", notes: "" },
  { id: "#4813", customer: "Ali Nagi", initials: "AN", items: [{ name: "Men's Haircut", quantity: 2, price: 140 }], date: "Jul 23", total: 280, payment: "Paid", status: "Completed", notes: "Loyalty discount applied" },
  { id: "#4812", customer: "Kenji Park", initials: "KP", items: [{ name: "Hair Treatment", quantity: 1, price: 200 }], date: "Jul 22", total: 200, payment: "Unpaid", status: "Pending", notes: "" },
  { id: "#4811", customer: "Priya Shah", initials: "PS", items: [{ name: "Balayage", quantity: 1, price: 650 }, { name: "Deep Conditioning", quantity: 1, price: 150 }], date: "Jul 22", total: 800, payment: "Paid", status: "Completed", notes: "" },
  { id: "#4810", customer: "Diego Alvarez", initials: "DA", items: [{ name: "Men's Haircut", quantity: 1, price: 140 }], date: "Jul 21", total: 140, payment: "Paid", status: "Completed", notes: "" },
];

const recentOrders: { id: string; customer: string; amount: string; status: OrderStatus; time: string }[] = [
  { id: "#4821", customer: "Ahmed Khan", amount: "$450", status: "Completed", time: "2h ago" },
  { id: "#4820", customer: "Fatima Rashid", amount: "$300", status: "Processing", time: "4h ago" },
  { id: "#4819", customer: "Sofia Martinez", amount: "$650", status: "Pending", time: "5h ago" },
  { id: "#4818", customer: "James Lee", amount: "$220", status: "Completed", time: "Yesterday" },
];

const statusBreakdown = [
  { label: "Pending", count: 2, color: "text-[#c98a1a]" },
  { label: "Processing", count: 1, color: "text-info" },
  { label: "Completed", count: 8, color: "text-success" },
  { label: "Cancelled", count: 1, color: "text-destructive" },
];

const ITEMS_PER_PAGE = 10;

/* ── Stat Card ── */

function StatCard({
  label,
  value,
  prefix,
  suffix,
  trend,
  trendUp,
  sparkline,
  color,
  icon,
}: {
  label: string;
  value: number;
  prefix?: string;
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
            {prefix}{count.toLocaleString()}{suffix ?? ""}
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

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    let result = orders.filter((o) => {
      const matchesSearch = searchQuery
        ? o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
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

  const handleRowClick = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const closeDrawer = useCallback(() => {
    setSelectedOrder(null);
  }, []);

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
              Orders
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground/50">
              Track customer orders and fulfillment status.
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
              New Order
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
                placeholder="Search by order ID, customer, or item..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-[320px] h-[36px] rounded-[10px] border border-border/40 bg-muted/30 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {(["all", "Pending", "Processing", "Completed", "Cancelled"] as const).map((status) => (
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
            label="Total Orders"
            value={12}
            trend="+3 this week"
            trendUp
            sparkline={[4, 5, 6, 5, 7, 8, 7, 9, 10, 10, 11, 12]}
            color="#6366f1"
            icon={ShoppingCart}
          />
          <StatCard
            label="Pending"
            value={2}
            trend="Needs attention"
            trendUp={false}
            sparkline={[1, 2, 1, 3, 2, 1, 2, 3, 2, 2, 2, 2]}
            color="#f59e0b"
            icon={Clock}
          />
          <StatCard
            label="Completed"
            value={8}
            trend="+2 this week"
            trendUp
            sparkline={[3, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8, 8]}
            color="#22c55e"
            icon={CheckCircle2}
          />
          <StatCard
            label="Revenue"
            value={4540}
            prefix="$"
            trend="+$820 this week"
            trendUp
            sparkline={[1200, 1800, 2100, 2400, 2800, 3100, 3400, 3600, 3900, 4100, 4300, 4540]}
            color="#8b5cf6"
            icon={DollarSign}
          />
        </motion.div>

        {/* ── MAIN CONTENT ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          {/* ── Orders Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className={cn(CARD, "flex flex-col overflow-hidden")}
          >
            <div className={cn(CARD_HEADER, "flex items-center justify-between")}>
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold text-foreground">All Orders</h2>
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
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Order ID</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Customer</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Items</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Date</th>
                    <th className="px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Total</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Payment</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Status</th>
                    <th className="px-5 py-2.5 w-[60px] text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      variants={fadeUp}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => handleRowClick(order)}
                      className={cn(
                        "border-b border-border/15 transition-all duration-150 cursor-pointer",
                        hoveredRow === i && "bg-hover-bg/50",
                      )}
                    >
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-semibold text-foreground/80 tabular-nums">{order.id}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground/60">
                            {order.initials}
                          </div>
                          <span className="text-[13px] font-semibold text-foreground">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-muted-foreground/55">
                          {order.items.map((item) => item.name).join(", ")}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-muted-foreground/45">{order.date}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-[12px] font-medium text-foreground/70 tabular-nums">${order.total}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex h-[18px] items-center gap-1 rounded-full px-2 text-[10px] font-semibold tracking-wide",
                            order.payment === "Paid" && "bg-success/[0.08] text-success",
                            order.payment === "Unpaid" && "bg-[rgba(217,119,6,0.1)] text-[#c98a1a]",
                            order.payment === "Refunded" && "bg-muted text-muted-foreground/60",
                          )}
                        >
                          {order.payment === "Paid" && <CreditCard size={9} strokeWidth={2} />}
                          {order.payment === "Unpaid" && <Clock size={9} strokeWidth={2} />}
                          {order.payment === "Refunded" && <XCircle size={9} strokeWidth={2} />}
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex h-[18px] items-center gap-1 rounded-full px-2 text-[10px] font-semibold tracking-wide",
                            order.status === "Pending" && "bg-[rgba(217,119,6,0.1)] text-[#c98a1a]",
                            order.status === "Processing" && "bg-info/[0.08] text-info",
                            order.status === "Completed" && "bg-success/[0.08] text-success",
                            order.status === "Cancelled" && "bg-destructive/[0.08] text-destructive",
                          )}
                        >
                          {order.status === "Pending" && <Clock size={9} strokeWidth={2} />}
                          {order.status === "Processing" && <Package size={9} strokeWidth={2} />}
                          {order.status === "Completed" && <CheckCircle2 size={9} strokeWidth={2} />}
                          {order.status === "Cancelled" && <XCircle size={9} strokeWidth={2} />}
                          {order.status}
                        </span>
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
                  <ShoppingCart size={22} strokeWidth={1.5} className="text-muted-foreground/25" />
                </div>
                <p className="text-[13px] font-semibold text-foreground/60 mb-1">No orders found</p>
                <p className="text-[12px] text-muted-foreground/40 max-w-[200px] leading-relaxed">
                  {searchQuery ? "Try adjusting your search." : "Create your first order to get started."}
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
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className={cn(CARD, "overflow-hidden")}
            >
              <div className={CARD_HEADER}>
                <h2 className="text-[13px] font-semibold text-foreground">Recent Orders</h2>
              </div>
              <div>
                {recentOrders.map((item, i) => (
                  <div
                    key={item.id}
                    className={cn(
                      "px-5 py-3 transition-colors duration-150 hover:bg-hover-bg/50",
                      i < recentOrders.length - 1 && "border-b border-border/15",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-semibold text-foreground/80 tabular-nums">{item.id}</span>
                      <span className="text-[12px] font-medium text-foreground/60 tabular-nums">{item.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium text-foreground">{item.customer}</p>
                      <span
                        className={cn(
                          "inline-flex h-[16px] items-center rounded-full px-1.5 text-[9px] font-semibold tracking-wide",
                          item.status === "Completed" && "bg-success/[0.08] text-success",
                          item.status === "Processing" && "bg-info/[0.08] text-info",
                          item.status === "Pending" && "bg-[rgba(217,119,6,0.1)] text-[#c98a1a]",
                          item.status === "Cancelled" && "bg-destructive/[0.08] text-destructive",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/40 mt-0.5">{item.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className={cn(CARD, "overflow-hidden")}
            >
              <div className={CARD_HEADER}>
                <h2 className="text-[13px] font-semibold text-foreground">Order Status</h2>
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

      {/* ── Order Detail Drawer ── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-overlay/40"
              onClick={closeDrawer}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[420px] bg-card border-l border-border shadow-elevated overflow-y-auto"
            >
              <div className="sticky top-0 bg-card z-10 border-b border-border/25 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-semibold text-foreground">Order Details</h3>
                  <p className="text-[12px] text-muted-foreground/50 mt-0.5">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground/40 transition-all hover:bg-hover-bg hover:text-foreground"
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer */}
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase mb-2 block">Customer</label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-[12px] font-semibold text-foreground/60">
                      {selectedOrder.initials}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{selectedOrder.customer}</p>
                      <p className="text-[12px] text-muted-foreground/45">{selectedOrder.id}</p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase mb-2 block">Products</label>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/15 last:border-0">
                        <div>
                          <p className="text-[13px] font-medium text-foreground">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground/45">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-[13px] font-medium text-foreground/70 tabular-nums">${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/25">
                    <span className="text-[13px] font-semibold text-foreground">Total</span>
                    <span className="text-[16px] font-bold text-foreground tabular-nums">${selectedOrder.total}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase mb-2 block">Payment</label>
                    <span
                      className={cn(
                        "inline-flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold tracking-wide",
                        selectedOrder.payment === "Paid" && "bg-success/[0.08] text-success",
                        selectedOrder.payment === "Unpaid" && "bg-[rgba(217,119,6,0.1)] text-[#c98a1a]",
                        selectedOrder.payment === "Refunded" && "bg-muted text-muted-foreground/60",
                      )}
                    >
                      {selectedOrder.payment}
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase mb-2 block">Status</label>
                    <span
                      className={cn(
                        "inline-flex h-[22px] items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold tracking-wide",
                        selectedOrder.status === "Pending" && "bg-[rgba(217,119,6,0.1)] text-[#c98a1a]",
                        selectedOrder.status === "Processing" && "bg-info/[0.08] text-info",
                        selectedOrder.status === "Completed" && "bg-success/[0.08] text-success",
                        selectedOrder.status === "Cancelled" && "bg-destructive/[0.08] text-destructive",
                      )}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground/50 tracking-widest uppercase mb-2 block">Notes</label>
                    <p className="text-[13px] text-foreground/70 leading-relaxed">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button className={cn(
                    "flex-1 h-[36px] rounded-[10px] text-[13px] font-medium transition-all duration-150",
                    "border border-border/50 bg-card text-foreground/70",
                    "hover:bg-hover-bg hover:text-foreground hover:border-border/80",
                  )}>
                    Edit
                  </button>
                  <button className={cn(
                    "flex-1 h-[36px] rounded-[10px] text-[13px] font-semibold transition-all duration-150",
                    "bg-accent text-white",
                    "hover:bg-accent-hover",
                  )}>
                    Mark Complete
                  </button>
                  <button className={cn(
                    "h-[36px] px-4 rounded-[10px] text-[13px] font-medium transition-all duration-150",
                    "text-destructive/70 hover:bg-destructive/[0.08] hover:text-destructive",
                  )}>
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
