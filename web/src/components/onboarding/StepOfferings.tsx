"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileJson, Plus, Trash2, Scissors, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { OnboardingData, ServiceItem, ProductItem } from "./types";

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

const durations = ["15", "30", "45", "60", "90", "120"];

interface ImportResult {
  successCount: number;
  failures: { index: number; reason: string }[];
}

function BulkImportDialog({
  open,
  onOpenChange,
  businessType,
  onImport,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  businessType: "service" | "product";
  onImport: (items: Record<string, unknown>[]) => ImportResult;
}) {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showExample, setShowExample] = useState(false);

  const serviceExample = [
    { name: "Haircut", description: "Classic haircut and style", duration_minutes: 30, price: 25.0 },
    { name: "Beard Trim", description: "Precision beard shaping", duration_minutes: 15, price: 12.0 },
  ];

  const productExample = [
    { name: "Shampoo - 250ml", description: "Sulfate-free daily shampoo", price: 8.5, stock_quantity: 40, category: "Hair Care" },
    { name: "Hair Wax", description: "Strong hold matte finish", price: 6.0, stock_quantity: 25, category: "Styling" },
  ];

  const exampleJson = businessType === "service" ? serviceExample : productExample;

  const handleImport = () => {
    setParseError(null);
    setResult(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setParseError("Invalid JSON. Please check the syntax and try again.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setParseError("Expected a JSON array. Please provide an array of objects.");
      return;
    }

    if (parsed.length === 0) {
      setParseError("The array is empty. Please add at least one item.");
      return;
    }

    const importResult = onImport(parsed);
    setResult(importResult);

    if (importResult.failures.length === 0) {
      setTimeout(() => {
        setJsonInput("");
        setResult(null);
        onOpenChange(false);
      }, 1200);
    }
  };

  const handleClose = () => {
    setJsonInput("");
    setResult(null);
    setParseError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            Import {businessType === "service" ? "Services" : "Products"} from JSON
          </DialogTitle>
          <DialogDescription>
            Paste a JSON array of {businessType === "service" ? "services" : "products"} to add them all at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowExample(!showExample)}
            className="flex items-center gap-1.5 text-xs text-[var(--cedar)] hover:text-[var(--ink)] transition-colors"
          >
            {showExample ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            See example format
          </button>

          {showExample && (
            <pre className="rounded-md bg-[var(--linen)] border border-[var(--slate)] p-3 text-[11px] font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)] overflow-x-auto max-h-40 overflow-y-auto">
              {JSON.stringify(exampleJson, null, 2)}
            </pre>
          )}

          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`Paste your JSON array here...\n\nExample:\n${JSON.stringify(exampleJson, null, 2)}`}
            className="min-h-[180px] font-[family-name:var(--font-jetbrains-mono)] text-xs"
          />

          {parseError && (
            <div className="rounded-md border border-[var(--ember)]/30 bg-[var(--ember)]/5 px-3 py-2.5">
              <p className="text-xs text-[var(--ember)]">{parseError}</p>
            </div>
          )}

          {result && (
            <div className="space-y-2">
              {result.successCount > 0 && (
                <div className="rounded-md border border-[var(--cedar)]/30 bg-[var(--mist)]/30 px-3 py-2.5">
                  <p className="text-xs text-[var(--cedar)] font-medium">
                    Successfully added {result.successCount} {result.successCount === 1 ? "item" : "items"}.
                  </p>
                </div>
              )}
              {result.failures.length > 0 && (
                <div className="rounded-md border border-[var(--ember)]/30 bg-[var(--ember)]/5 px-3 py-2.5 max-h-40 overflow-y-auto">
                  <p className="text-xs text-[var(--ember)] font-medium mb-1">
                    {result.failures.length} {result.failures.length === 1 ? "row" : "rows"} failed validation:
                  </p>
                  {result.failures.map((f) => (
                    <p key={f.index} className="text-[11px] text-[var(--ember)]/80">
                      Row {f.index + 1}: {f.reason}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            {result && result.failures.length === 0 ? "Close" : "Cancel"}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!jsonInput.trim() || (result !== null && result.failures.length === 0)}
            className="gap-1.5"
          >
            <FileJson className="h-3.5 w-3.5" />
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function StepOfferings({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData> | ((prev: OnboardingData) => Partial<OnboardingData>)) => void;
}) {
  const isService = data.businessType === "service";
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  function addService() {
    const s: ServiceItem = {
      name: "",
      description: "",
      durationMinutes: 30,
      price: 0,
    };
    onChange({ services: [...data.services, s] });
    setEditingIdx(data.services.length);
  }

  function addProduct() {
    const p: ProductItem = {
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      lowStockThreshold: 5,
      category: "",
    };
    onChange({ products: [...data.products, p] });
    setEditingIdx(data.products.length);
  }

  function removeService(idx: number) {
    const next = data.services.filter((_, i) => i !== idx);
    onChange({ services: next });
    setEditingIdx(null);
  }

  function removeProduct(idx: number) {
    const next = data.products.filter((_, i) => i !== idx);
    onChange({ products: next });
    setEditingIdx(null);
  }

  function updateService(idx: number, patch: Partial<ServiceItem>) {
    const next = [...data.services];
    next[idx] = { ...next[idx], ...patch };
    onChange({ services: next });
  }

  function updateProduct(idx: number, patch: Partial<ProductItem>) {
    const next = [...data.products];
    next[idx] = { ...next[idx], ...patch };
    onChange({ products: next });
  }

  function handleBulkImport(items: Record<string, unknown>[]): ImportResult {
    const successes: number[] = [];
    const failures: ImportResult["failures"] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item || typeof item !== "object") {
        failures.push({ index: i, reason: "Item is not an object" });
        continue;
      }

      if (typeof item.name !== "string" || !item.name.trim()) {
        failures.push({ index: i, reason: "Missing or invalid \"name\" (must be a non-empty string)" });
        continue;
      }

      if (typeof item.price !== "number" || item.price < 0) {
        failures.push({ index: i, reason: "Missing or invalid \"price\" (must be a non-negative number)" });
        continue;
      }

      if (isService) {
        if (typeof item.duration_minutes !== "number" || item.duration_minutes <= 0) {
          failures.push({ index: i, reason: "Missing or invalid \"duration_minutes\" (must be a positive number)" });
          continue;
        }
        successes.push(i);
      } else {
        successes.push(i);
      }
    }

    if (isService) {
      const newServices: ServiceItem[] = successes.map((i) => {
        const item = items[i];
        return {
          name: (item.name as string).trim(),
          description: typeof item.description === "string" ? item.description.trim() : "",
          durationMinutes: item.duration_minutes as number,
          price: item.price as number,
        };
      });
      onChange((prev) => ({ ...prev, services: [...prev.services, ...newServices] }));
    } else {
      const newProducts: ProductItem[] = successes.map((i) => {
        const item = items[i];
        return {
          name: (item.name as string).trim(),
          description: typeof item.description === "string" ? item.description.trim() : "",
          price: item.price as number,
          stockQuantity: typeof item.stock_quantity === "number" ? item.stock_quantity : 0,
          lowStockThreshold: typeof item.low_stock_threshold === "number" ? item.low_stock_threshold : 5,
          category: typeof item.category === "string" ? item.category.trim() : "",
        };
      });
      onChange((prev) => ({ ...prev, products: [...prev.products, ...newProducts] }));
    }

    return { successCount: successes.length, failures };
  }

  const items = isService ? data.services : data.products;
  const hasItems = items.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
          {isService ? "Add your services" : "Add your products"}
        </h2>
        <p className="text-sm text-[var(--ash)]">
          {isService
            ? "Add at least one service so customers can book with your agent."
            : "Add at least one product so customers can place orders."}
        </p>
      </div>

      {/* List */}
      {hasItems && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[var(--slate)] bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {item.name || (isService ? "Untitled service" : "Untitled product")}
                  </p>
                  <p className="text-xs text-[var(--ash)]">
                    {isService
                      ? `${(item as ServiceItem).durationMinutes} min · $${(item as ServiceItem).price}`
                      : `$${(item as ProductItem).price} · ${(item as ProductItem).stockQuantity} in stock`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-[var(--ember)]"
                    onClick={() =>
                      isService ? removeService(idx) : removeProduct(idx)
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline edit form */}
      {editingIdx !== null && editingIdx < items.length && (
        <div className="rounded-xl border border-[var(--cedar)]/30 bg-[var(--mist)]/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-[var(--ink)]">
            {isService ? "Edit service" : "Edit product"}
          </p>
          {isService ? (
            <ServiceForm
              value={data.services[editingIdx]}
              onChange={(patch) => updateService(editingIdx, patch)}
            />
          ) : (
            <ProductForm
              value={data.products[editingIdx]}
              onChange={(patch) => updateProduct(editingIdx, patch)}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setEditingIdx(null)}
          >
            Done
          </Button>
        </div>
      )}

      {/* Add button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setImportDialogOpen(true)}
        >
          <FileJson className="h-3.5 w-3.5" />
          Import JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={isService ? addService : addProduct}
        >
          <Plus className="h-3.5 w-3.5" />
          Add {isService ? "service" : "product"}
        </Button>
      </div>

      <BulkImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        businessType={isService ? "service" : "product"}
        onImport={handleBulkImport}
      />

      {!hasItems && (
        <p className="text-xs text-[var(--amber)] font-medium">
          You must add at least one {isService ? "service" : "product"} to continue.
        </p>
      )}
    </div>
  );
}

function ServiceForm({
  value,
  onChange,
}: {
  value: ServiceItem;
  onChange: (patch: Partial<ServiceItem>) => void;
}) {
  return (
    <div className="space-y-2">
      <Input
        placeholder="Service name"
        value={value.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <Textarea
        placeholder="Description (optional)"
        value={value.description}
        onChange={(e) => onChange({ description: e.target.value })}
        className="min-h-[50px]"
      />
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px]">Duration (min)</Label>
          <Select
            value={String(value.durationMinutes)}
            onValueChange={(v) => onChange({ durationMinutes: Number(v) })}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durations.map((d) => (
                <SelectItem key={d} value={d}>
                  {d} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Price ($)</Label>
          <Input
            type="number"
            min={0}
            value={value.price}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
}

function ProductForm({
  value,
  onChange,
}: {
  value: ProductItem;
  onChange: (patch: Partial<ProductItem>) => void;
}) {
  return (
    <div className="space-y-2">
      <Input
        placeholder="Product name"
        value={value.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <Textarea
        placeholder="Description (optional)"
        value={value.description}
        onChange={(e) => onChange({ description: e.target.value })}
        className="min-h-[50px]"
      />
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px]">Price ($)</Label>
          <Input
            type="number"
            min={0}
            value={value.price}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Stock</Label>
          <Input
            type="number"
            min={0}
            value={value.stockQuantity}
            onChange={(e) => onChange({ stockQuantity: Number(e.target.value) })}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Category</Label>
          <Input
            placeholder="e.g. Hair Care"
            value={value.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
}
