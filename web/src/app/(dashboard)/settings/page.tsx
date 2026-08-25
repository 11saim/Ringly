"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/app/ProfileTab";
import { PersonaTab } from "@/components/app/PersonaTab";
import { OfferingsTab } from "@/components/app/OfferingsTab";
import { PoliciesTab } from "@/components/app/PoliciesTab";
import { KnowledgeBaseTab } from "@/components/app/KnowledgeBaseTab";

const tabs = [
  { value: "profile", label: "Profile" },
  { value: "persona", label: "Persona" },
  { value: "offerings", label: "Offerings" },
  { value: "policies", label: "Policies & Escalation" },
  { value: "knowledge", label: "Knowledge Base" },
] as const;

type TabValue = (typeof tabs)[number]["value"];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = (searchParams.get("tab") as TabValue) || "profile";
  const [activeTab, setActiveTab] = useState<TabValue>(
    tabs.some((t) => t.value === initial) ? initial : "profile",
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", activeTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
          Business Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--ash)]">
          Configure how your business and agent appear to customers.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="w-full justify-start overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="persona">
          <PersonaTab />
        </TabsContent>

        <TabsContent value="offerings">
          <OfferingsTab />
        </TabsContent>

        <TabsContent value="policies">
          <PoliciesTab />
        </TabsContent>

        <TabsContent value="knowledge">
          <KnowledgeBaseTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
