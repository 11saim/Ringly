"use client";

import { AppShell } from "@/components/app/AppShell";
import { Package, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";

const products = [
  { name: "Balayage Treatment", price: "$420", category: "Hair", status: "active" },
  { name: "Deep Conditioning", price: "$60", category: "Hair", status: "active" },
  { name: "Men's Haircut", price: "$80", category: "Hair", status: "active" },
  { name: "Hair Coloring", price: "$380", category: "Color", status: "active" },
  { name: "Blow Dry & Style", price: "$120", category: "Styling", status: "active" },
  { name: "Beard Trim", price: "$35", category: "Grooming", status: "active" },
];

export default function ProductsPage() {
  return (
    <AppShell
      title="Products"
      actions={
        <button className={cn("inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold bg-accent text-white hover:bg-accent-hover transition-all duration-150")}>
          <Plus size={14} strokeWidth={2} />
          Add Product
        </button>
      }
    >
      <div className="space-y-5">
        <div className="relative">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/35" />
          <input
            type="text"
            placeholder="Search products..."
            className={cn("w-full max-w-md rounded-[12px] border border-border/30 bg-muted/30 py-2.5 pl-9 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground/35 transition-all duration-200 focus:outline-none focus:border-accent/30 focus:bg-muted/50")}
          />
        </div>

        <div className={cn(CARD, "overflow-hidden")}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/25">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.name} className="border-b border-border/15 last:border-0 hover:bg-hover-bg/50 transition-colors duration-150 cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-muted/50">
                        <Package size={14} strokeWidth={1.5} className="text-muted-foreground/40" />
                      </div>
                      <span className="text-[13px] font-medium text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-foreground tabular-nums">{p.price}</td>
                  <td className="px-5 py-3 text-[13px] text-muted-foreground/60">{p.category}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full bg-success/[0.08] px-2 py-0.5 text-[10px] font-semibold text-success">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
