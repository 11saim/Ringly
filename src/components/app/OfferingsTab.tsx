"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Edit,
  ImagePlus,
  Package,
  Plus,
  Scissors,
  Trash2,
  Wrench,
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
  mockServices,
  mockProducts,
  type Service,
  type Product,
} from "@/lib/data";
import { cn } from "@/lib/utils";

// ── Empty forms ──

const emptyService: Omit<Service, "id"> = {
  name: "",
  duration: "30 min",
  price: 0,
  description: "",
  staff: [],
  availability: "Mon–Sat",
  active: true,
};

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  price: 0,
  stock: 0,
  lowStockThreshold: 10,
  category: "",
  description: "",
  image: null,
  active: true,
};

const staffOptions = ["Sarah A.", "Ali K.", "Maria G.", "Priya P."];

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
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: Service | null;
  onSave: (data: Omit<Service, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Service, "id">>(
    service ?? emptyService,
  );

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle>
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
              <Label>Duration</Label>
              <Input
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                placeholder="e.g. 1.5 hrs"
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
              <Label>Availability</Label>
              <Input
                value={form.availability}
                onChange={(e) => update("availability", e.target.value)}
                placeholder="e.g. Mon–Sat"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-[60px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned staff</Label>
            <div className="flex flex-wrap gap-2">
              {staffOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    const staff = form.staff.includes(s)
                      ? form.staff.filter((x) => x !== s)
                      : [...form.staff, s];
                    update("staff", staff);
                  }}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    form.staff.includes(s)
                      ? "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]"
                      : "border-[var(--slate)] text-[var(--ash)] hover:border-[var(--border-strong)]",
                  )}
                >
                  {s}
                </button>
              ))}
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
  product: Product | null;
  onSave: (data: Omit<Product, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Product, "id">>(
    product ?? emptyProduct,
  );

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
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
                value={form.category}
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
                value={form.stock || ""}
                onChange={(e) => update("stock", Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Low stock threshold</Label>
            <Input
              type="number"
              value={form.lowStockThreshold || ""}
              onChange={(e) =>
                update("lowStockThreshold", Number(e.target.value))
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
              value={form.description}
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

// ── Main Component ──

export function OfferingsTab() {
  // Dev toggle — in production this comes from useTenant().businessType
  const [variant, setVariant] = useState<"service" | "product">("service");

  const [services, setServices] = useState(mockServices);
  const [products, setProducts] = useState(mockProducts);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleService = (id: string) =>
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );

  const toggleProduct = (id: string) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );

  const deleteService = (id: string) =>
    setServices((prev) => prev.filter((s) => s.id !== id));

  const deleteProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const saveService = (data: Omit<Service, "id">) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...data, id: s.id } : s,
        ),
      );
    } else {
      setServices((prev) => [...prev, { ...data, id: `s-${Date.now()}` }]);
    }
    setEditingService(null);
  };

  const saveProduct = (data: Omit<Product, "id">) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...data, id: p.id } : p,
        ),
      );
    } else {
      setProducts((prev) => [...prev, { ...data, id: `p-${Date.now()}` }]);
    }
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Dev toggle */}
      <div className="rounded-lg border border-dashed border-[var(--amber)]/40 bg-[var(--amber)]/5 px-4 py-3">
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

      {/* ── Service Variant ── */}
      {variant === "service" && (
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
                  {services.length} service{services.length !== 1 ? "s" : ""}
                </p>
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

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="w-20">Active</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((s) => (
                    <TableRow
                      key={s.id}
                      className={cn(!s.active && "opacity-50")}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-[var(--ink)]">{s.name}</p>
                          <p className="text-xs text-[var(--ash)] truncate max-w-[200px]">
                            {s.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-[var(--ash)]">
                        {s.duration}
                      </TableCell>
                      <TableCell className="text-sm font-medium font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                        ${s.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {s.staff.map((st) => (
                            <Badge key={st} variant="secondary" className="text-[10px]">
                              {st}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-[var(--ash)]">
                        {s.availability}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={s.active}
                          onCheckedChange={() => toggleService(s.id)}
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
                            onClick={() => deleteService(s.id)}
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
            onSave={saveService}
          />
        </section>
      )}

      {/* ── Product Variant ── */}
      {variant === "product" && (
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
                  {products.length} product{products.length !== 1 ? "s" : ""}
                  {" · "}
                  <span className="text-[var(--ember)]">
                    {products.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0).length} low stock
                  </span>
                  {" · "}
                  <span className="text-[var(--ash)]">
                    {products.filter((p) => p.stock === 0).length} out of stock
                  </span>
                </p>
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
                      p.stock > 0 && p.stock <= p.lowStockThreshold;
                    const isOut = p.stock === 0;

                    return (
                      <TableRow
                        key={p.id}
                        className={cn(!p.active && "opacity-50")}
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
                                isOut && "text-[var(--ember)] font-semibold",
                                isLowStock && "text-[var(--amber)] font-semibold",
                                !isOut && !isLowStock && "text-[var(--ink)]",
                              )}
                            >
                              {p.stock}
                            </span>
                            {isOut && (
                              <Badge variant="destructive" className="text-[10px]">
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
                            checked={p.active}
                            onCheckedChange={() => toggleProduct(p.id)}
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
                              onClick={() => deleteProduct(p.id)}
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
            onSave={saveProduct}
          />
        </section>
      )}
    </div>
  );
}
