"use client";

import { useMemo, useState } from "react";
import { Check, FileText, LayoutGrid, List, PackagePlus, Plus, Search, Upload } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { catalogItems } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Item = (typeof catalogItems)[number];

const CATEGORIES = ["Hair", "Color", "Style", "Treatment", "Special"];

export default function CatalogPage() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [items, setItems] = useState<Item[]>(catalogItems);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "Hair",
    price: "",
    duration: "30",
  });
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        `${item.name} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [items, query]
  );

  const active = items.filter((item) => item.active).length;

  const toggle = (id: string) =>
    setItems((rows) =>
      rows.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const addItem = () => {
    const price = Number.parseFloat(form.price);
    if (!form.name.trim() || !Number.isFinite(price)) return;
    const next: Item = {
      id: `s${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      price: Math.round(price * 100),
      duration: Number.parseInt(form.duration, 10) || 30,
      active: true,
    };
    setItems((rows) => [next, ...rows]);
    setForm({ name: "", category: "Hair", price: "", duration: "30" });
    setAddOpen(false);
    toast.success(`${next.name} added to catalog`);
  };

  const startUpload = () => {
    if (uploadProgress !== null) return;
    setUploadProgress(8);
    let progress = 8;
    const timer = window.setInterval(() => {
      progress = Math.min(100, progress + 14);
      setUploadProgress(progress);
      if (progress >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          const imported: Item[] = [
            {
              id: `u${Date.now()}a`,
              name: "Root gloss",
              category: "Color",
              price: 2200,
              duration: 35,
              active: true,
            },
            {
              id: `u${Date.now()}b`,
              name: "Scalp ritual",
              category: "Treatment",
              price: 1600,
              duration: 25,
              active: true,
            },
            {
              id: `u${Date.now()}c`,
              name: "Event styling",
              category: "Special",
              price: 5200,
              duration: 90,
              active: true,
            },
          ];
          setItems((rows) => [...imported, ...rows]);
          setUploadOpen(false);
          setUploadProgress(null);
          toast.success("Catalog imported · 3 items added");
        }, 450);
      }
    }, 130);
  };

  return (
    <AppShell
      title="Catalog"
      subtitle={`${items.length} items · ${active} active · agent-ready`}
      actions={
        <>
          <Dialog
            open={uploadOpen}
            onOpenChange={(open) => {
              setUploadOpen(open);
              if (!open) setUploadProgress(null);
            }}
          >
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Upload className="mr-1 h-3.5 w-3.5" /> Upload
              </Button>
            </DialogTrigger>
          </Dialog>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button type="button" size="sm">
                <Plus className="mr-1 h-3.5 w-3.5" /> Add item
              </Button>
            </DialogTrigger>
          </Dialog>
        </>
      }
    >
      <div className="space-y-5">
        <section className="grid gap-3 md:grid-cols-4">
          <Metric
            label="Agent visible"
            value={String(active)}
          />
          <Metric
            label="Avg price"
            value={`$${Math.round(
              items.reduce((sum, item) => sum + item.price, 0) /
                items.length /
                100
            )}`}
          />
          <Metric
            label="Categories"
            value={String(new Set(items.map((item) => item.category)).size)}
          />
          <Metric
            label="Longest"
            value={`${Math.max(...items.map((item) => item.duration))}m`}
          />
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search catalog…"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <Badge className="bg-accent-soft text-primary hover:bg-accent-soft">
                  {selected.size} selected
                </Badge>
              )}
              <div className="inline-flex rounded-md border border-border bg-background p-0.5">
                <button
                  type="button"
                  onClick={() => setView("table")}
                  className={`grid h-8 w-8 place-items-center rounded ${
                    view === "table" ? "bg-muted" : ""
                  }`}
                  aria-label="Table view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`grid h-8 w-8 place-items-center rounded ${
                    view === "grid" ? "bg-muted" : ""
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {view === "table" ? (
          <CatalogTable
            items={filtered}
            selected={selected}
            onSelect={toggleSelect}
            onToggle={toggle}
          />
        ) : (
          <CatalogGrid items={filtered} onToggle={toggle} />
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add catalog item</DialogTitle>
            <DialogDescription>
              Your agent can quote and book this immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Name">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Deluxe manicure"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block text-sm">Category</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Field label="Price ($)">
                <Input
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="45"
                />
              </Field>
            </div>
            <Field label="Duration (minutes)">
              <Input
                inputMode="numeric"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
              />
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={addItem}
              disabled={!form.name.trim() || !form.price.trim()}
            >
              Add item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={uploadOpen}
        onOpenChange={(open) => {
          setUploadOpen(open);
          if (!open) setUploadProgress(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import catalog</DialogTitle>
            <DialogDescription>
              Simulate parsing a CSV, PDF menu, or price sheet into
              agent-ready items.
            </DialogDescription>
          </DialogHeader>
          {uploadProgress === null ? (
            <button
              type="button"
              onClick={startUpload}
              className="rounded-xl border-2 border-dashed border-border p-10 text-center transition hover:border-primary hover:bg-accent-soft"
            >
              <Upload className="mx-auto h-10 w-10 text-primary" />
              <div className="mt-3 text-sm font-semibold">
                Click to upload a menu file
              </div>
              <div className="text-xs text-muted-foreground">
                CSV, PDF, DOCX up to 25MB
              </div>
            </button>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <FileText className="h-7 w-7 text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">
                    menu-spring.pdf
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Reading prices, durations, and categories…{" "}
                    {uploadProgress}%
                  </div>
                </div>
                {uploadProgress >= 100 && (
                  <Check className="h-5 w-5 text-success" />
                )}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function CatalogTable({
  items,
  selected,
  onSelect,
  onToggle,
}: {
  items: Item[];
  selected: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-8" />
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="text-right">Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => onSelect(item.id)}
                />
              </TableCell>
              <TableCell className="font-semibold">{item.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{item.category}</Badge>
              </TableCell>
              <TableCell className="text-right font-mono">
                ${(item.price / 100).toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-mono text-muted-foreground">
                {item.duration}m
              </TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={item.active}
                  onCheckedChange={() => onToggle(item.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CatalogGrid({
  items,
  onToggle,
}: {
  items: Item[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="grid aspect-video place-items-center bg-[linear-gradient(135deg,var(--accent-soft),var(--surface-2))]">
            <PackagePlus className="h-8 w-8 text-primary" />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.category}
                </div>
              </div>
              <Switch
                checked={item.active}
                onCheckedChange={() => onToggle(item.id)}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono font-bold">
                ${(item.price / 100).toFixed(2)}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {item.duration}m
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-bold">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      {children}
    </div>
  );
}
