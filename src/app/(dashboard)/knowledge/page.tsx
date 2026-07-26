"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/app/AppShell";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  Plus,
  FileText,
  FolderOpen,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
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

interface Article {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  status: "Published" | "Draft";
  views: number;
}

const articles: Article[] = [
  { id: "1", title: "Refund Policy", category: "Policies", lastUpdated: "Today", status: "Published", views: 218 },
  { id: "2", title: "Booking Process", category: "Bookings", lastUpdated: "Yesterday", status: "Published", views: 140 },
  { id: "3", title: "Hair Services", category: "Services", lastUpdated: "2 days ago", status: "Draft", views: 82 },
  { id: "4", title: "Opening Hours", category: "General", lastUpdated: "Today", status: "Published", views: 97 },
  { id: "5", title: "Pricing", category: "Pricing", lastUpdated: "4 days ago", status: "Published", views: 175 },
  { id: "6", title: "Cancellation Policy", category: "Policies", lastUpdated: "Yesterday", status: "Published", views: 134 },
  { id: "7", title: "Staff Directory", category: "General", lastUpdated: "3 days ago", status: "Draft", views: 56 },
  { id: "8", title: "Coloring Services", category: "Services", lastUpdated: "5 days ago", status: "Published", views: 91 },
  { id: "9", title: "Appointment Rescheduling", category: "Bookings", lastUpdated: "Today", status: "Published", views: 112 },
  { id: "10", title: "Gift Cards", category: "Pricing", lastUpdated: "1 week ago", status: "Published", views: 88 },
  { id: "11", title: "Wedding Packages", category: "Services", lastUpdated: "3 days ago", status: "Published", views: 167 },
  { id: "12", title: "Loyalty Program", category: "Pricing", lastUpdated: "2 days ago", status: "Published", views: 143 },
];

const categories = [
  { name: "General", count: 12 },
  { name: "Bookings", count: 9 },
  { name: "Pricing", count: 7 },
  { name: "Policies", count: 6 },
  { name: "Services", count: 14 },
];

const recentlyUpdated = [
  { title: "Refund Policy", time: "Today" },
  { title: "Pricing", time: "Yesterday" },
  { title: "Bookings", time: "2 days ago" },
  { title: "Hair Services", time: "3 days ago" },
];

const ITEMS_PER_PAGE = 10;

/* ── Stat Card ── */

function StatCard({ label, value, suffix, displayText, icon }: { label: string; value: number; suffix?: string; displayText?: string; icon: React.ElementType }) {
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
      <div className="text-[32px] font-bold text-foreground tracking-[-0.03em] leading-none tabular-nums">
        {displayText ?? <>{count.toLocaleString()}{suffix ?? ""}</>}
      </div>
    </motion.div>
  );
}

/* ── Page ── */

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Published" | "Draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch = searchQuery
        ? a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

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
              Knowledge Base
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground/50">
              Manage the information your AI uses to answer customer questions.
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
              className={cn(
                "inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold",
                "bg-accent text-white transition-all duration-150",
                "hover:bg-accent-hover",
              )}
            >
              <Plus size={14} strokeWidth={2} />
              New Article
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
                placeholder="Search by title or category..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-[280px] h-[36px] rounded-[10px] border border-border/40 bg-muted/30 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 transition-all duration-150 focus:outline-none focus:border-border/60 focus:bg-muted/50"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {(["all", "Published", "Draft"] as const).map((status) => (
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
            <div className="flex items-center gap-1.5">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-[36px] rounded-[10px] border border-border/40 bg-transparent px-3 text-[13px] font-medium text-foreground/70 transition-all duration-150 focus:outline-none focus:border-border/60"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* ── STAT CARDS ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Articles" value={48} icon={FileText} />
          <StatCard label="Categories" value={8} icon={FolderOpen} />
          <StatCard label="Last Updated" value={0} displayText="Today" icon={Clock} />
          <StatCard label="Coverage" value={92} suffix="%" icon={TrendingUp} />
        </motion.div>

        {/* ── MAIN CONTENT ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          {/* ── Articles Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className={cn(CARD, "flex flex-col overflow-hidden")}
          >
            <div className={cn(CARD_HEADER, "flex items-center justify-between")}>
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold text-foreground">Knowledge Articles</h2>
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
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Title</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Category</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Last Updated</th>
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Status</th>
                    <th className="px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((article, i) => (
                    <motion.tr
                      key={article.id}
                      variants={fadeUp}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={cn(
                        "border-b border-border/15 transition-all duration-150 cursor-pointer",
                        hoveredRow === i && "bg-hover-bg/50",
                      )}
                    >
                      <td className="px-5 py-3">
                        <span className="text-[13px] font-semibold text-foreground">{article.title}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-muted-foreground/55">{article.category}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-muted-foreground/45">{article.lastUpdated}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex h-[18px] items-center rounded-full px-2 text-[10px] font-semibold tracking-wide",
                            article.status === "Published"
                              ? "bg-success/[0.08] text-success"
                              : "bg-muted text-muted-foreground/60",
                          )}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-[12px] font-medium text-foreground/60 tabular-nums">{article.views}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-muted/50 mb-4">
                  <BookOpen size={22} strokeWidth={1.5} className="text-muted-foreground/25" />
                </div>
                <p className="text-[13px] font-semibold text-foreground/60 mb-1">No articles found</p>
                <p className="text-[12px] text-muted-foreground/40 max-w-[200px] leading-relaxed">
                  Try adjusting your search or filters.
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
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className={cn(CARD, "overflow-hidden")}
            >
              <div className={CARD_HEADER}>
                <h2 className="text-[13px] font-semibold text-foreground">Categories</h2>
              </div>
              <div>
                {categories.map((cat, i) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setCategoryFilter(categoryFilter === cat.name ? "all" : cat.name);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-5 py-2.5 text-left transition-all duration-150",
                      "hover:bg-hover-bg/50",
                      i < categories.length - 1 && "border-b border-border/15",
                      categoryFilter === cat.name && "bg-hover-bg/50",
                    )}
                  >
                    <span className="text-[13px] text-foreground/80">{cat.name}</span>
                    <span className="text-[12px] font-medium text-muted-foreground/40 tabular-nums">{cat.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recently Updated */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className={cn(CARD, "overflow-hidden")}
            >
              <div className={CARD_HEADER}>
                <h2 className="text-[13px] font-semibold text-foreground">Recently Updated</h2>
              </div>
              <div>
                {recentlyUpdated.map((item, i) => (
                  <div
                    key={item.title}
                    className={cn(
                      "flex items-center justify-between px-5 py-2.5",
                      i < recentlyUpdated.length - 1 && "border-b border-border/15",
                    )}
                  >
                    <span className="text-[13px] text-foreground/80">{item.title}</span>
                    <span className="text-[11px] text-muted-foreground/40 tabular-nums">{item.time}</span>
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
