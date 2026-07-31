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

function deriveInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function deriveHandle(name: string): string {
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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from("tenants")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          const businessType: BusinessType | null = data.business_type
            ? (data.business_type.charAt(0).toUpperCase() + data.business_type.slice(1)) as BusinessType
            : null;

          setTenant({
            id: data.id,
            name: data.business_name,
            handle: deriveHandle(data.business_name),
            businessType,
            plan: "Free",
            avatarInitials: deriveInitials(data.business_name),
          });
        }
      } catch {
        // Session or tenant fetch failed — route protection should prevent this
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
  const { tenant } = useContext(TenantContext);
  return tenant ?? fallbackTenant;
}

export function useTenantContext() {
  return useContext(TenantContext);
}
