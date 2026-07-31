"use client";

import {
  Building2,
  Clock,
  Globe,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
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
import type { OnboardingData, DaySchedule } from "./types";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const timezones = [
  "UTC-08:00 Pacific Time",
  "UTC-07:00 Mountain Time",
  "UTC-06:00 Central Time",
  "UTC-05:00 Eastern Time",
  "UTC+00:00 London",
  "UTC+01:00 Paris / Berlin",
  "UTC+02:00 Cairo / Athens",
  "UTC+03:00 Moscow / Riyadh",
  "UTC+04:00 Dubai",
  "UTC+05:30 Mumbai",
  "UTC+08:00 Singapore / Beijing",
  "UTC+09:00 Tokyo",
  "UTC+10:00 Sydney",
];

const currencies = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "PKR", label: "PKR — Pakistani Rupee" },
  { code: "INR", label: "INR — Indian Rupee" },
  { code: "AED", label: "AED — UAE Dirham" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
];

const industries = [
  "Beauty & Salon",
  "Healthcare & Clinic",
  "Retail & E-commerce",
  "Food & Restaurant",
  "Professional Services",
  "Education",
  "Fitness & Wellness",
  "Other",
];

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

export function StepBusinessProfile({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  const isService = data.businessType === "service";

  function updateHour(day: number, patch: Partial<DaySchedule>) {
    onChange({
      hours: { ...data.hours, [day]: { ...data.hours[day], ...patch } },
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
          Business profile
        </h2>
        <p className="text-sm text-[var(--ash)]">
          Tell customers about your business and when you&apos;re available.
        </p>
      </div>

      {/* About */}
      <div>
        <SectionHeading
          icon={Building2}
          title="About your business"
          description="A short description shown to customers."
        />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Premium hair salon specializing in balayage, coloring, and modern cuts."
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Industry</Label>
              <Select value={data.industry} onValueChange={(v) => onChange({ industry: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Select value={data.timezone} onValueChange={(v) => onChange({ timezone: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Hours */}
      <div>
        <SectionHeading
          icon={Clock}
          title="Business hours"
          description="Set your weekly availability."
        />
        <div className="space-y-2">
          {days.map((day, i) => {
            const h = data.hours[i];
            return (
              <div
                key={day}
                className="flex items-center gap-3 rounded-lg border border-[var(--slate)] bg-white px-3 py-2"
              >
                <span className="w-10 text-xs font-semibold text-[var(--ink)]">{day}</span>
                {h.closed ? (
                  <span className="text-xs text-[var(--ash)]">Closed</span>
                ) : (
                  <>
                    <Input
                      type="time"
                      value={h.open}
                      onChange={(e) => updateHour(i, { open: e.target.value })}
                      className="h-8 w-28 text-xs"
                    />
                    <span className="text-xs text-[var(--ash)]">to</span>
                    <Input
                      type="time"
                      value={h.close}
                      onChange={(e) => updateHour(i, { close: e.target.value })}
                      className="h-8 w-28 text-xs"
                    />
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-7 text-xs"
                  onClick={() => updateHour(i, { closed: !h.closed })}
                >
                  {h.closed ? "Open" : "Close"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Contact */}
      <div>
        <SectionHeading
          icon={Globe}
          title="Contact & links"
          description="How customers can reach you."
        />
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="supportEmail">Support email</Label>
              <Input
                id="supportEmail"
                type="email"
                placeholder="support@bloom.com"
                value={data.supportEmail}
                onChange={(e) => onChange({ supportEmail: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supportPhone">Support phone</Label>
              <Input
                id="supportPhone"
                placeholder="+1 (555) 123-4567"
                value={data.supportPhone}
                onChange={(e) => onChange({ supportPhone: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://bloom.com"
              value={data.websiteUrl}
              onChange={(e) => onChange({ websiteUrl: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select value={data.currency} onValueChange={(v) => onChange({ currency: v })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Address — Service only */}
      {isService && (
        <>
          <Separator />
          <div>
            <SectionHeading
              icon={MapPin}
              title="Location"
              description="Your business address for in-person services."
            />
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, Suite 100, City, State 12345"
                value={data.address}
                onChange={(e) => onChange({ address: e.target.value })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
