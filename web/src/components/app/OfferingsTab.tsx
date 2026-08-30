"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Edit,
  FileJson,
  ImagePlus,
  Package,
  Plus,
  RefreshCw,
  Scissors,
  Trash2,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTenant, useTenantContext } from "@/lib/tenant-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ── DB row types ──

interface ServiceRow {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  staff_ids: string[];
}

interface ProductRow {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
}

interface StaffRow {
  id: string;
  name: string;
  is_active: boolean;
}

// ── Empty forms ──

const emptyService: Omit<ServiceRow, "id" | "tenant_id" | "is_active"> = {
  name: "",
  description: "",
  duration_minutes: 30,
  price: 0,
  staff_ids: [],
};

const emptyProduct: Omit<ProductRow, "id" | "tenant_id" | "is_active"> = {
  name: "",
  description: "",
  price: 0,
  stock_quantity: 0,
  low_stock_threshold: 10,
  category: "",
  image_url: null,
};

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

// ── Service Edit Dialog ──

function ServiceDialog({
  open,
  onOpenChange,
  service,
  staffOptions,
  onSave,
  onAddStaff,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: ServiceRow | null;
  staffOptions: StaffRow[];
  onSave: (data: Omit<ServiceRow, "id" | "tenant_id" | "is_active">) => void;
  onAddStaff: (name: string) => Promise<StaffRow | null>;
}) {
  const [form, setForm] = useState<Omit<ServiceRow, "id" | "tenant_id" | "is_active">>(
    service ?? emptyService,
  );
  const [newStaffName, setNewStaffName] = useState("");
  const [addingStaff, setAddingStaff] = useState(false);

  const update = (
    field: string,
    value: unknown,
  ) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleStaff = (staffId: string) => {
    setForm((prev) => ({
      ...prev,
      staff_ids: prev.staff_ids.includes(staffId)
        ? prev.staff_ids.filter((s) => s !== staffId)
        : [...prev.staff_ids, staffId],
    }));
  };

  const handleAddStaff = async () => {
    if (!newStaffName.trim()) return;
    setAddingStaff(true);
    const newStaff = await onAddStaff(newStaffName.trim());
    if (newStaff) {
      setForm((prev) => ({
        ...prev,
        staff_ids: [...prev.staff_ids, newStaff.id],
      }));
      setNewStaffName("");
    }
    setAddingStaff(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {service ? "Edit Service" : "Add Service"}
          </DialogTitle>
          <DialogDescription>
            {service
              ? "Update the service details below."
              : "Fill in the details for the new service."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Balayage"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={form.duration_minutes || ""}
                onChange={(e) =>
                  update("duration_minutes", Number(e.target.value))
                }
                placeholder="30"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Price</Label>
            <Input
              type="number"
              value={form.price || ""}
              onChange={(e) => update("price", Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-[60px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned staff</Label>
            <div className="flex flex-wrap gap-2">
              {staffOptions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleStaff(s.id)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    form.staff_ids.includes(s.id)
                      ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                      : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
            {/* Inline add staff */}
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="Add staff member..."
                className="text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleAddStaff();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void handleAddStaff()}
                disabled={!newStaffName.trim() || addingStaff}
                className="shrink-0 gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
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
            disabled={!form.name}
          >
            {service ? "Save changes" : "Add service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Product Edit Dialog ──

function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: ProductRow | null;
  onSave: (data: Omit<ProductRow, "id" | "tenant_id" | "is_active">) => void;
}) {
  const [form, setForm] = useState<Omit<ProductRow, "id" | "tenant_id" | "is_active">>(
    product ?? emptyProduct,
  );

  const update = (
    field: string,
    value: unknown,
  ) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product details below."
              : "Fill in the details for the new product."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Vitamin C Serum"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                value={form.category || ""}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Skincare"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price || ""}
                onChange={(e) => update("price", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stock quantity</Label>
              <Input
                type="number"
                value={form.stock_quantity || ""}
                onChange={(e) =>
                  update("stock_quantity", Number(e.target.value))
                }
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Low stock threshold</Label>
            <Input
              type="number"
              value={form.low_stock_threshold || ""}
              onChange={(e) =>
                update("low_stock_threshold", Number(e.target.value))
              }
              placeholder="10"
            />
            <p className="text-[10px] text-[var(--ash)]">
              Alert when stock falls below this number.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-[60px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Product image</Label>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-dashed border-[var(--slate)] bg-[var(--linen)]">
                <ImagePlus className="h-5 w-5 text-[var(--ash)]" />
              </div>
              <Button variant="outline" size="sm">
                Upload image
              </Button>
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
            disabled={!form.name}
          >
            {product ? "Save changes" : "Add product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Bulk Import Dialog ──

interface ImportResult {
  successCount: number;
  failures: { index: number; reason: string; raw: unknown }[];
}

function BulkImportDialog({
  open,
  onOpenChange,
  businessType,
  onImport,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  businessType: "Service" | "Product";
  onImport: (items: Record<string, unknown>[]) => Promise<ImportResult>;
}) {
  const [jsonInput, setJsonInput] = useState("");
  const [importing, setImporting] = useState(false);
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

  const exampleJson = businessType === "Service" ? serviceExample : productExample;

  const handleImport = async () => {
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

    setImporting(true);
    const importResult = await onImport(parsed);
    setResult(importResult);
    setImporting(false);

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
            Import {businessType === "Service" ? "Services" : "Products"} from JSON
          </DialogTitle>
          <DialogDescription>
            Paste a JSON array of {businessType === "Service" ? "services" : "products"} to add them all at once.
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
            disabled={importing}
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
                    Successfully imported {result.successCount} {result.successCount === 1 ? "item" : "items"}.
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
          <Button variant="ghost" onClick={handleClose} disabled={importing}>
            {result && result.failures.length === 0 ? "Close" : "Cancel"}
          </Button>
          <Button
            onClick={() => void handleImport()}
            disabled={!jsonInput.trim() || importing || (result !== null && result.failures.length === 0)}
            className="gap-1.5"
          >
            {importing ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileJson className="h-3.5 w-3.5" />
            )}
            {importing ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ──

export function OfferingsTab() {
  const tenant = useTenant();
  const { loading: tenantLoading } = useTenantContext();
  const isService = tenant.businessType === "Service";

  // Loading state
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffRow[]>([]);

  const [editingService, setEditingService] = useState<ServiceRow | null>(
    null,
  );
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch staff
    const { data: staffRows } = await supabase
      .from("staff")
      .select("id, name, is_active")
      .eq("tenant_id", user.id);

    setStaffOptions(staffRows || []);

    if (isService) {
      // Fetch services with staff assignments
      const { data: svcRows } = await supabase
        .from("services")
        .select("*, service_staff(staff_id)")
        .eq("tenant_id", user.id);

      if (svcRows) {
        setServices(
          svcRows.map((s) => ({
            id: s.id,
            tenant_id: s.tenant_id,
            name: s.name,
            description: s.description,
            duration_minutes: s.duration_minutes,
            price: s.price,
            is_active: s.is_active,
            staff_ids: (s.service_staff || []).map(
              (ss: { staff_id: string }) => ss.staff_id,
            ),
          })),
        );
      }
    } else {
      // Fetch products
      const { data: prodRows } = await supabase
        .from("products")
        .select("*")
        .eq("tenant_id", user.id);

      if (prodRows) {
        setProducts(prodRows);
      }
    }

    setLoading(false);
  }, [isService]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  // ── Service CRUD ──

  const toggleService = async (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    const supabase = createClient();
    await supabase
      .from("services")
      .update({ is_active: !svc.is_active })
      .eq("id", id);
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s)),
    );
  };

  const deleteService = async (id: string) => {
    const supabase = createClient();
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const saveService = async (
    data: Omit<ServiceRow, "id" | "tenant_id" | "is_active">,
  ) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editingService) {
      // Update existing
      await supabase
        .from("services")
        .update({
          name: data.name,
          description: data.description || null,
          duration_minutes: data.duration_minutes,
          price: data.price,
        })
        .eq("id", editingService.id);

      // Replace staff assignments
      await supabase
        .from("service_staff")
        .delete()
        .eq("service_id", editingService.id);

      if (data.staff_ids.length > 0) {
        await supabase.from("service_staff").insert(
          data.staff_ids.map((staffId) => ({
            service_id: editingService.id,
            staff_id: staffId,
          })),
        );
      }

      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...data, id: s.id, tenant_id: s.tenant_id, is_active: s.is_active }
            : s,
        ),
      );
    } else {
      // Insert new
      const { data: newSvc } = await supabase
        .from("services")
        .insert({
          tenant_id: user.id,
          name: data.name,
          description: data.description || null,
          duration_minutes: data.duration_minutes,
          price: data.price,
        })
        .select()
        .single();

      if (newSvc) {
        if (data.staff_ids.length > 0) {
          await supabase.from("service_staff").insert(
            data.staff_ids.map((staffId) => ({
              service_id: newSvc.id,
              staff_id: staffId,
            })),
          );
        }

        setServices((prev) => [
          ...prev,
          {
            ...data,
            id: newSvc.id,
            tenant_id: user.id,
            is_active: true,
          },
        ]);
      }
    }
    setEditingService(null);
  };

  // ── Product CRUD ──

  const toggleProduct = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const supabase = createClient();
    await supabase
      .from("products")
      .update({ is_active: !prod.is_active })
      .eq("id", id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)),
    );
  };

  const deleteProduct = async (id: string) => {
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const saveProduct = async (
    data: Omit<ProductRow, "id" | "tenant_id" | "is_active">,
  ) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editingProduct) {
      // Update existing
      await supabase
        .from("products")
        .update({
          name: data.name,
          description: data.description || null,
          price: data.price,
          stock_quantity: data.stock_quantity,
          low_stock_threshold: data.low_stock_threshold,
          category: data.category || null,
        })
        .eq("id", editingProduct.id);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...data, id: p.id, tenant_id: p.tenant_id, is_active: p.is_active }
            : p,
        ),
      );
    } else {
      // Insert new
      const { data: newProd } = await supabase
        .from("products")
        .insert({
          tenant_id: user.id,
          name: data.name,
          description: data.description || null,
          price: data.price,
          stock_quantity: data.stock_quantity,
          low_stock_threshold: data.low_stock_threshold,
          category: data.category || null,
        })
        .select()
        .single();

      if (newProd) {
        setProducts((prev) => [
          ...prev,
          {
            ...data,
            id: newProd.id,
            tenant_id: user.id,
            is_active: true,
          },
        ]);
      }
    }
    setEditingProduct(null);
  };

  // ── Staff inline add ──

  const addStaff = async (name: string): Promise<StaffRow | null> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: newStaff } = await supabase
      .from("staff")
      .insert({ tenant_id: user.id, name })
      .select()
      .single();

    if (newStaff) {
      setStaffOptions((prev) => [...prev, newStaff]);
      return newStaff;
    }
    return null;
  };

  // ── Bulk import ──

  const handleBulkImport = async (items: Record<string, unknown>[]): Promise<ImportResult> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { successCount: 0, failures: items.map((raw, i) => ({ index: i, reason: "Not authenticated", raw })) };

    const table = isService ? "services" : "products";
    const successes: string[] = [];
    const failures: ImportResult["failures"] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item || typeof item !== "object") {
        failures.push({ index: i, reason: "Item is not an object", raw: item });
        continue;
      }

      if (typeof item.name !== "string" || !item.name.trim()) {
        failures.push({ index: i, reason: "Missing or invalid \"name\" (must be a non-empty string)", raw: item });
        continue;
      }

      if (typeof item.price !== "number" || item.price < 0) {
        failures.push({ index: i, reason: "Missing or invalid \"price\" (must be a non-negative number)", raw: item });
        continue;
      }

      let row: Record<string, unknown>;
      if (isService) {
        if (typeof item.duration_minutes !== "number" || item.duration_minutes <= 0) {
          failures.push({ index: i, reason: "Missing or invalid \"duration_minutes\" (must be a positive number)", raw: item });
          continue;
        }
        row = {
          tenant_id: user.id,
          name: (item.name as string).trim(),
          description: typeof item.description === "string" ? item.description.trim() || null : null,
          duration_minutes: item.duration_minutes,
          price: item.price,
        };
      } else {
        row = {
          tenant_id: user.id,
          name: (item.name as string).trim(),
          description: typeof item.description === "string" ? item.description.trim() || null : null,
          price: item.price,
          stock_quantity: typeof item.stock_quantity === "number" ? item.stock_quantity : 0,
          low_stock_threshold: typeof item.low_stock_threshold === "number" ? item.low_stock_threshold : 10,
          category: typeof item.category === "string" ? item.category.trim() || null : null,
        };
      }

      const { data: inserted, error } = await supabase
        .from(table)
        .insert(row)
        .select()
        .single();

      if (error) {
        failures.push({ index: i, reason: error.message || "Database insert failed", raw: item });
      } else if (inserted) {
        successes.push(inserted.id);
        if (isService) {
          setServices((prev) => [...prev, { ...row, id: inserted.id, is_active: true, staff_ids: [] } as unknown as ServiceRow]);
        } else {
          setProducts((prev) => [...prev, { ...row, id: inserted.id, is_active: true } as unknown as ProductRow]);
        }
      }
    }

    return { successCount: successes.length, failures };
  };

  if (tenantLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-5 w-5 text-[var(--ash)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Service Variant ── */}
      {isService && (
        <section>
          <SectionHeading
            icon={Scissors}
            title="Services"
            description="Manage the services your agent can book for customers."
          />
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[var(--ash)]">
                  {services.length} service
                  {services.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImportDialogOpen(true)}
                    className="gap-1.5"
                  >
                    <FileJson className="h-3.5 w-3.5" />
                    Import JSON
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingService(null);
                      setDialogOpen(true);
                    }}
                    className="gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add service
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead className="w-20">Active</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((s) => (
                    <TableRow
                      key={s.id}
                      className={cn(!s.is_active && "opacity-50")}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-[var(--ink)]">
                            {s.name}
                          </p>
                          <p className="text-xs text-[var(--ash)] truncate max-w-[200px]">
                            {s.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-[var(--ash)]">
                        {s.duration_minutes} min
                      </TableCell>
                      <TableCell className="text-sm font-medium font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                        ${s.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {s.staff_ids.map((staffId) => {
                            const staff = staffOptions.find(
                              (st) => st.id === staffId,
                            );
                            return (
                              <Badge
                                key={staffId}
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {staff?.name || "Unknown"}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={s.is_active}
                          onCheckedChange={() => void toggleService(s.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingService(s);
                              setDialogOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5 text-[var(--ash)]" />
                          </button>
                          <button
                            onClick={() => void deleteService(s.id)}
                            className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <ServiceDialog
            open={dialogOpen}
            onOpenChange={(v) => {
              setDialogOpen(v);
              if (!v) setEditingService(null);
            }}
            service={editingService}
            staffOptions={staffOptions}
            onSave={(data) => void saveService(data)}
            onAddStaff={addStaff}
          />

          <BulkImportDialog
            open={importDialogOpen}
            onOpenChange={setImportDialogOpen}
            businessType="Service"
            onImport={handleBulkImport}
          />
        </section>
      )}

      {/* ── Product Variant ── */}
      {!isService && (
        <section>
          <SectionHeading
            icon={Package}
            title="Products"
            description="Manage the products your agent can sell or answer questions about."
          />
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[var(--ash)]">
                  {products.length} product
                  {products.length !== 1 ? "s" : ""}
                  {" · "}
                  <span className="text-[var(--ember)]">
                    {
                      products.filter(
                        (p) =>
                          p.stock_quantity <= p.low_stock_threshold &&
                          p.stock_quantity > 0,
                      ).length
                    }{" "}
                    low stock
                  </span>
                  {" · "}
                  <span className="text-[var(--ash)]">
                    {products.filter((p) => p.stock_quantity === 0).length} out
                    of stock
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImportDialogOpen(true)}
                    className="gap-1.5"
                  >
                    <FileJson className="h-3.5 w-3.5" />
                    Import JSON
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingProduct(null);
                      setDialogOpen(true);
                    }}
                    className="gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add product
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-20">Active</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => {
                    const isLowStock =
                      p.stock_quantity > 0 &&
                      p.stock_quantity <= p.low_stock_threshold;
                    const isOut = p.stock_quantity === 0;

                    return (
                      <TableRow
                        key={p.id}
                        className={cn(!p.is_active && "opacity-50")}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-[var(--ink)]">
                              {p.name}
                            </p>
                            <p className="text-xs text-[var(--ash)] truncate max-w-[200px]">
                              {p.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                          ${p.price}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-[family-name:var(--font-jetbrains-mono)]",
                                isOut &&
                                  "text-[var(--ember)] font-semibold",
                                isLowStock &&
                                  "text-[var(--amber)] font-semibold",
                                !isOut &&
                                  !isLowStock &&
                                  "text-[var(--ink)]",
                              )}
                            >
                              {p.stock_quantity}
                            </span>
                            {isOut && (
                              <Badge
                                variant="destructive"
                                className="text-[10px]"
                              >
                                Out of stock
                              </Badge>
                            )}
                            {isLowStock && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-[var(--amber)] font-medium">
                                <AlertTriangle className="h-3 w-3" />
                                Low stock
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {p.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={p.is_active}
                            onCheckedChange={() => void toggleProduct(p.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setDialogOpen(true);
                              }}
                              className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5 text-[var(--ash)]" />
                            </button>
                            <button
                              onClick={() => void deleteProduct(p.id)}
                              className="p-1.5 rounded hover:bg-hover-bg transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <ProductDialog
            open={dialogOpen}
            onOpenChange={(v) => {
              setDialogOpen(v);
              if (!v) setEditingProduct(null);
            }}
            product={editingProduct}
            onSave={(data) => void saveProduct(data)}
          />

          <BulkImportDialog
            open={importDialogOpen}
            onOpenChange={setImportDialogOpen}
            businessType="Product"
            onImport={handleBulkImport}
          />
        </section>
      )}
    </div>
  );
}
