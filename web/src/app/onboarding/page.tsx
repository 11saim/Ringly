"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  type OnboardingData,
  defaultOnboardingData,
} from "@/components/onboarding/types";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { StepBusinessType } from "@/components/onboarding/StepBusinessType";
import { StepWhatsApp } from "@/components/onboarding/StepWhatsApp";
import { StepBusinessProfile } from "@/components/onboarding/StepBusinessProfile";
import { StepPersona } from "@/components/onboarding/StepPersona";
import { StepOfferings } from "@/components/onboarding/StepOfferings";
import { StepPolicies } from "@/components/onboarding/StepPolicies";
import { StepKnowledgeBase } from "@/components/onboarding/StepKnowledgeBase";
import { StepReview } from "@/components/onboarding/StepReview";

const TOTAL_STEPS = 8;

function canProceed(data: OnboardingData, step: number): boolean {
  switch (step) {
    case 0:
      return data.businessType !== null;
    case 1:
      return true;
    case 2:
      return true;
    case 3:
      return true;
    case 4:
      return data.businessType === "service"
        ? data.services.length > 0
        : data.products.length > 0;
    case 5:
      return true;
    case 6:
      return true;
    case 7:
      return true;
    default:
      return true;
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxReached, setMaxReached] = useState(0);

  const update = useCallback(
    (patch: Partial<OnboardingData> | ((prev: OnboardingData) => Partial<OnboardingData>)) => {
      if (typeof patch === "function") {
        setData((prev) => ({ ...prev, ...patch(prev) }));
      } else {
        setData((prev) => ({ ...prev, ...patch }));
      }
    },
    []
  );

  function goNext() {
    if (step < TOTAL_STEPS - 1) {
      const next = step + 1;
      setStep(next);
      setMaxReached((m) => Math.max(m, next));
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function goToStep(s: number) {
    if (s <= maxReached) setStep(s);
  }

  async function handleFinish() {
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated.");
        return;
      }

      // 1. Update tenant business_type
      const { error: tenantErr } = await supabase
        .from("tenants")
        .update({
          business_type: data.businessType,
          description: data.description || null,
          industry: data.industry || null,
          timezone: data.timezone,
          currency: data.currency,
          support_email: data.supportEmail || null,
          support_phone: data.supportPhone || null,
          website_url: data.websiteUrl || null,
          address: data.address || null,
          social_links: data.socialLinks,
        })
        .eq("id", user.id);
      if (tenantErr) throw tenantErr;

      // 2. Upsert business hours
      const hoursRows = Object.entries(data.hours).map(([day, h]) => ({
        tenant_id: user.id,
        day_of_week: Number(day),
        open_time: h.closed ? null : h.open,
        close_time: h.closed ? null : h.close,
        is_closed: h.closed,
      }));
      const { error: hoursErr } = await supabase
        .from("business_hours")
        .upsert(hoursRows, { onConflict: "tenant_id,day_of_week" });
      if (hoursErr) throw hoursErr;

      // 3. Upsert agent persona
      const { error: personaErr } = await supabase
        .from("agent_persona")
        .upsert(
          {
            tenant_id: user.id,
            display_name: data.agentDisplayName,
            tone: data.tone as "formal" | "friendly" | "casual" | "playful",
            greeting_message: data.greetingMessage,
            signoff_message: data.signoffMessage,
            use_emoji: data.useEmoji,
            response_length: data.responseLength as "concise" | "detailed",
            fallback_message: data.fallbackMessage,
            banned_terms: data.bannedTerms,
          },
          { onConflict: "tenant_id" }
        );
      if (personaErr) throw personaErr;

      // 4. Insert services or products
      if (data.businessType === "service" && data.services.length > 0) {
        const serviceRows = data.services.map((s) => ({
          tenant_id: user.id,
          name: s.name,
          description: s.description || null,
          duration_minutes: s.durationMinutes,
          price: s.price,
        }));
        const { error: svcErr } = await supabase
          .from("services")
          .insert(serviceRows);
        if (svcErr) throw svcErr;
      }

      if (data.businessType === "product" && data.products.length > 0) {
        const productRows = data.products.map((p) => ({
          tenant_id: user.id,
          name: p.name,
          description: p.description || null,
          price: p.price,
          stock_quantity: p.stockQuantity,
          low_stock_threshold: p.lowStockThreshold,
          category: p.category || null,
        }));
        const { error: prodErr } = await supabase
          .from("products")
          .insert(productRows);
        if (prodErr) throw prodErr;
      }

      // 5. Upsert policies
      const { error: polErr } = await supabase
        .from("policies")
        .upsert(
          {
            tenant_id: user.id,
            cancellation_policy: data.cancellationPolicy || null,
            refund_policy: data.refundPolicy || null,
            escalation_notify_target: data.escalationNotifyTarget || null,
          },
          { onConflict: "tenant_id" }
        );
      if (polErr) throw polErr;

      // 6. Insert enabled escalation triggers
      const enabledTriggers = data.escalationTriggers.filter((t) => t.isEnabled);
      if (enabledTriggers.length > 0) {
        const triggerRows = enabledTriggers.map((t) => ({
          tenant_id: user.id,
          trigger_type: t.triggerType,
          custom_phrase: t.customPhrase || null,
          is_enabled: true,
        }));
        const { error: trigErr } = await supabase
          .from("escalation_triggers")
          .insert(triggerRows);
        if (trigErr) throw trigErr;
      }

      // 7. Insert FAQs
      if (data.faqs.length > 0) {
        const faqRows = data.faqs.map((f) => ({
          tenant_id: user.id,
          question: f.question,
          answer: f.answer,
        }));
        const { error: faqErr } = await supabase
          .from("kb_faqs")
          .insert(faqRows);
        if (faqErr) throw faqErr;
      }

      // 8. Insert pasted documents
      if (data.documents.length > 0) {
        const docRows = data.documents.map((d) => ({
          tenant_id: user.id,
          source_type: d.sourceType,
          raw_text: d.rawText,
          status: "pending" as const,
        }));
        const { error: docErr } = await supabase
          .from("kb_documents")
          .insert(docRows);
        if (docErr) throw docErr;
      }

      router.push("/overview");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const stepContent = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <StepBusinessType
            value={data.businessType}
            onChange={(v) => update({ businessType: v })}
          />
        );
      case 1:
        return (
          <StepWhatsApp
            connected={data.whatsappConnected}
            onToggle={(v) => update({ whatsappConnected: v })}
          />
        );
      case 2:
        return <StepBusinessProfile data={data} onChange={update} />;
      case 3:
        return <StepPersona data={data} onChange={update} />;
      case 4:
        return <StepOfferings data={data} onChange={update} />;
      case 5:
        return <StepPolicies data={data} onChange={update} />;
      case 6:
        return <StepKnowledgeBase data={data} onChange={update} />;
      case 7:
        return <StepReview data={data} onEdit={goToStep} />;
      default:
        return null;
    }
  }, [step, data, update]);

  return (
    <div className="min-h-screen bg-[var(--parchment)] flex flex-col">
      {/* Header */}
      <div className="border-b border-[var(--slate)] bg-white/80 backdrop-blur-md px-6 py-3">
        <StepIndicator
          currentStep={step}
          onStepClick={goToStep}
          goToStep={maxReached}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8 sm:py-12">
          {stepContent}

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 py-2.5 px-4 text-center text-xs font-medium text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--slate)] bg-white/80 backdrop-blur-md px-6">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            disabled={step === 0}
            className="gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>

          {step < TOTAL_STEPS - 1 ? (
            <Button
              size="sm"
              onClick={goNext}
              disabled={!canProceed(data, step)}
              className="gap-1.5"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleFinish}
              disabled={submitting}
              className="gap-1.5 bg-[var(--cedar)] hover:bg-[var(--forest)]"
            >
              {submitting ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Rocket className="h-3.5 w-3.5" />
                  Go live
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
