"use client";

import { useState } from "react";
import { Plus, Trash2, Scissors, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function StepOfferings({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  const isService = data.businessType === "service";
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

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
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={isService ? addService : addProduct}
      >
        <Plus className="h-3.5 w-3.5" />
        Add {isService ? "service" : "product"}
      </Button>

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
