"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type BusinessType = "Service" | "Product";

export interface Tenant {
  id: string;
  name: string;
  handle: string;
  businessType: BusinessType | null;
  plan: string;
  avatarInitials: string;
}

interface TenantContextValue {
  tenant: Tenant | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  loading: true,
});

function deriveInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function deriveHandle(name: string | null): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      try {
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr) {
          console.error("[tenant-context] auth.getUser error:", authErr.message);
          setLoading(false);
          return;
        }
        if (!user) {
          console.log("[tenant-context] No authenticated user");
          setLoading(false);
          return;
        }

        console.log("[tenant-context] Fetching tenant for user:", user.id);

        const { data, error: tenantErr } = await supabase
          .from("tenants")
          .select("*")
          .eq("id", user.id)
          .single();

        if (tenantErr) {
          console.error("[tenant-context] Tenant query error:", tenantErr.message, "code:", tenantErr.code);
          setLoading(false);
          return;
        }

        console.log("[tenant-context] Raw tenant row:", JSON.stringify(data, null, 2));

        if (data) {
          const businessType: BusinessType | null = data.business_type
            ? (data.business_type.charAt(0).toUpperCase() + data.business_type.slice(1)) as BusinessType
            : null;

          console.log(
            "[tenant-context] business_type raw:",
            JSON.stringify(data.business_type),
            "-> mapped to:",
            JSON.stringify(businessType),
          );

          setTenant({
            id: data.id,
            name: data.business_name,
            handle: deriveHandle(data.business_name),
            businessType,
            plan: "Free",
            avatarInitials: deriveInitials(data.business_name),
          });
        } else {
          console.log("[tenant-context] No tenant row found for user:", user.id);
        }
      } catch (err) {
        console.error("[tenant-context] Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

const fallbackTenant: Tenant = {
  id: "",
  name: "",
  handle: "",
  businessType: null,
  plan: "",
  avatarInitials: "",
};

export function useTenant() {
  const { tenant, loading } = useContext(TenantContext);
  const result = tenant ?? fallbackTenant;
  console.log(
    "[useTenant] loading:",
    loading,
    "tenant:",
    tenant ? `id=${tenant.id} businessType=${JSON.stringify(tenant.businessType)}` : "null (using fallback)",
  );
  return result;
}

export function useTenantContext() {
  return useContext(TenantContext);
}
