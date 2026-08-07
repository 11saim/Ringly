"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Building2,
  Clock,
  Globe,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenant } from "@/lib/tenant-context";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const dayIndex: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 0,
};

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

const timezones = [
  "UTC-12:00 Baker Island",
  "UTC-11:00 American Samoa",
  "UTC-10:00 Hawaii",
  "UTC-09:00 Alaska",
  "UTC-08:00 Pacific Time",
  "UTC-07:00 Mountain Time",
  "UTC-06:00 Central Time",
  "UTC-05:00 Eastern Time",
  "UTC+00:00 London",
  "UTC+01:00 Paris / Berlin",
  "UTC+02:00 Cairo / Athens",
  "UTC+03:00 Moscow / Riyadh",
  "UTC+04:00 Dubai",
  "UTC+05:00 Karachi",
  "UTC+05:30 Mumbai",
  "UTC+06:00 Dhaka",
  "UTC+07:00 Bangkok",
  "UTC+08:00 Singapore / Beijing",
  "UTC+09:00 Tokyo",
  "UTC+10:00 Sydney",
  "UTC+12:00 Auckland",
];

const currencies = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "PKR", label: "PKR — Pakistani Rupee" },
  { code: "INR", label: "INR — Indian Rupee" },
  { code: "AED", label: "AED — UAE Dirham" },
  { code: "SAR", label: "SAR — Saudi Riyal" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
];

interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

interface HolidayClosure {
  id: string;
  date: string;
  label: string;
}

const defaultHours: Record<string, DaySchedule> = {
  Mon: { open: "09:00", close: "18:00", closed: false },
  Tue: { open: "09:00", close: "18:00", closed: false },
  Wed: { open: "09:00", close: "18:00", closed: false },
  Thu: { open: "09:00", close: "20:00", closed: false },
  Fri: { open: "09:00", close: "18:00", closed: false },
  Sat: { open: "10:00", close: "16:00", closed: false },
  Sun: { open: "10:00", close: "14:00", closed: false },
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

export function ProfileTab() {
  const tenant = useTenant();
  const isService = tenant.businessType === "Service";

  // Loading state
  const [loading, setLoading] = useState(true);

  // Basic info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Logo / Cover
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Industry
  const [industry, setIndustry] = useState("");

  // Hours
  const [hours, setHours] = useState<Record<string, DaySchedule>>(defaultHours);

  // Holidays
  const [holidays, setHolidays] = useState<HolidayClosure[]>([]);
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayLabel, setNewHolidayLabel] = useState("");

  // Timezone
  const [timezone, setTimezone] = useState("UTC+00:00 London");

  // Location
  const [address, setAddress] = useState("");

  // Support
  const [supportPhone, setSupportPhone] = useState("");
  const [supportEmail, setSupportEmail] = useState("");

  // Currency
  const [currency, setCurrency] = useState("USD");

  // Socials
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  // Save state
  const [saving, setSaving] = useState(false);

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

    // 1. Fetch tenant row
    const { data: tenantData } = await supabase
      .from("tenants")
      .select(
        "business_name, description, industry, timezone, currency, support_email, support_phone, website_url, address, social_links, logo_url, cover_url",
      )
      .eq("id", user.id)
      .single();

    if (tenantData) {
      setName(tenantData.business_name || "");
      setDescription(tenantData.description || "");
      setIndustry(tenantData.industry || "");
      setTimezone(tenantData.timezone || "UTC+00:00 London");
      setCurrency(tenantData.currency || "USD");
      setSupportPhone(tenantData.support_phone || "");
      setSupportEmail(tenantData.support_email || "");
      setAddress(tenantData.address || "");
      setWebsite(tenantData.website_url || "");
      setLogoPreview(tenantData.logo_url || null);
      setCoverPreview(tenantData.cover_url || null);

      const links = (tenantData.social_links as Record<string, string>) || {};
      setInstagram(links.instagram || "");
      setFacebook(links.facebook || "");
    }

    // 2. Fetch business hours
    const { data: hoursData } = await supabase
      .from("business_hours")
      .select("day_of_week, open_time, close_time, is_closed")
      .eq("tenant_id", user.id);

    if (hoursData && hoursData.length > 0) {
      const hoursMap: Record<string, DaySchedule> = {};
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (const h of hoursData) {
        const dayName = dayNames[h.day_of_week];
        hoursMap[dayName] = {
          open: h.open_time || "09:00",
          close: h.close_time || "18:00",
          closed: h.is_closed,
        };
      }
      setHours((prev) => ({ ...prev, ...hoursMap }));
    }

    // 3. Fetch business hour exceptions
    const { data: exceptionsData } = await supabase
      .from("business_hour_exceptions")
      .select("id, exception_date, label, is_closed")
      .eq("tenant_id", user.id);

    if (exceptionsData) {
      setHolidays(
        exceptionsData.map((e) => ({
          id: e.id,
          date: e.exception_date,
          label: e.label || "",
        })),
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const updateDay = (
    day: string,
    field: keyof DaySchedule,
    value: string | boolean,
  ) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const addHoliday = () => {
    if (!newHolidayDate || !newHolidayLabel) return;
    setHolidays((prev) => [
      ...prev,
      { id: `h-${Date.now()}`, date: newHolidayDate, label: newHolidayLabel },
    ]);
    setNewHolidayDate("");
    setNewHolidayLabel("");
  };

  const removeHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    // 1. Update tenants row
    const { error: tenantErr } = await supabase
      .from("tenants")
      .update({
        business_name: name,
        description: description || null,
        industry: industry || null,
        timezone,
        currency,
        support_email: supportEmail || null,
        support_phone: supportPhone || null,
        website_url: website || null,
        address: address || null,
        social_links: { instagram, facebook, website },
        logo_url: logoPreview,
        cover_url: coverPreview,
      })
      .eq("id", user.id);
    if (tenantErr) console.error("Failed to update tenant:", tenantErr);

    // 2. Upsert business hours (7 rows)
    const hoursRows = Object.entries(hours).map(([day, h]) => ({
      tenant_id: user.id,
      day_of_week: dayIndex[day],
      open_time: h.closed ? null : h.open,
      close_time: h.closed ? null : h.close,
      is_closed: h.closed,
    }));
    const { error: hoursErr } = await supabase
      .from("business_hours")
      .upsert(hoursRows, { onConflict: "tenant_id,day_of_week" });
    if (hoursErr) console.error("Failed to upsert hours:", hoursErr);

    // 3. Delete all exceptions, then reinsert
    const { error: delErr } = await supabase
      .from("business_hour_exceptions")
      .delete()
      .eq("tenant_id", user.id);
    if (delErr) console.error("Failed to delete exceptions:", delErr);

    if (holidays.length > 0) {
      const { error: insErr } = await supabase
        .from("business_hour_exceptions")
        .insert(
          holidays.map((h) => ({
            tenant_id: user.id,
            exception_date: h.date,
            label: h.label,
            is_closed: true,
          })),
        );
      if (insErr) console.error("Failed to insert exceptions:", insErr);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-5 w-5 text-[var(--ash)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* ── Basic Info ── */}
      <section>
        <SectionHeading
          icon={Building2}
          title="Basic Information"
          description="Your business name and what you do."
        />
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="biz-name">Business name</Label>
                <Input
                  id="biz-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
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
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="biz-desc">Short description</Label>
              <Textarea
                id="biz-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />
              <p className="text-[10px] text-[var(--ash)]">
                {description.length}/200 characters
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Logo & Cover ── */}
      <section>
        <SectionHeading
          icon={Upload}
          title="Logo & Cover Photo"
          description="Visual identity shown to customers."
        />
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Logo */}
              <div className="space-y-2">
                <Label>Logo</Label>
                <div
                  className={cn(
                    "relative flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-[var(--slate)] bg-[var(--linen)] overflow-hidden cursor-pointer transition-colors hover:border-[var(--cedar)]",
                  )}
                  onClick={() => logoInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <>
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoPreview(null);
                          if (logoInputRef.current)
                            logoInputRef.current.value = "";
                        }}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-[var(--ink)]/70 text-white flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-5 w-5 text-[var(--ash)] mx-auto" />
                      <p className="text-[10px] text-[var(--ash)] mt-1">
                        Upload
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setLogoPreview)}
                />
              </div>

              {/* Cover */}
              <div className="space-y-2 flex-1">
                <Label>Cover photo</Label>
                <div
                  className={cn(
                    "relative flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-[var(--slate)] bg-[var(--linen)] overflow-hidden cursor-pointer transition-colors hover:border-[var(--cedar)]",
                  )}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverPreview(null);
                          if (coverInputRef.current)
                            coverInputRef.current.value = "";
                        }}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-[var(--ink)]/70 text-white flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-5 w-5 text-[var(--ash)] mx-auto" />
                      <p className="text-[10px] text-[var(--ash)] mt-1">
                        Click to upload cover photo
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setCoverPreview)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Business Hours ── */}
      <section>
        <SectionHeading
          icon={Clock}
          title="Business Hours"
          description="When customers can reach you or book appointments."
        />
        <Card>
          <CardContent className="p-5 space-y-0">
            {days.map((day, i) => (
              <div key={day}>
                <div className="flex items-center gap-4 py-2.5">
                  <span className="w-10 text-sm font-medium text-[var(--ink)]">
                    {day}
                  </span>
                  <Switch
                    checked={!hours[day].closed}
                    onCheckedChange={(v) => updateDay(day, "closed", !v)}
                  />
                  {hours[day].closed ? (
                    <span className="text-xs text-[var(--ash)] italic">
                      Closed
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours[day].open}
                        onChange={(e) => updateDay(day, "open", e.target.value)}
                        className="w-[120px] text-xs font-[family-name:var(--font-jetbrains-mono)]"
                      />
                      <span className="text-xs text-[var(--ash)]">to</span>
                      <Input
                        type="time"
                        value={hours[day].close}
                        onChange={(e) =>
                          updateDay(day, "close", e.target.value)
                        }
                        className="w-[120px] text-xs font-[family-name:var(--font-jetbrains-mono)]"
                      />
                    </div>
                  )}
                </div>
                {i < days.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ── Holiday Closures ── */}
      <section>
        <SectionHeading
          icon={Plus}
          title="Holiday Closures"
          description="Special dates when your business is closed."
        />
        <Card>
          <CardContent className="p-5 space-y-4">
            {holidays.length > 0 && (
              <div className="space-y-2">
                {holidays.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-md border border-[var(--slate)] bg-[var(--linen)] px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[var(--ink)]">
                        {h.label}
                      </span>
                      <span className="text-xs text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">
                        {h.date}
                      </span>
                    </div>
                    <button
                      onClick={() => removeHoliday(h.id)}
                      className="p-1 rounded hover:bg-hover-bg transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[var(--ash)]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full space-y-1.5">
                <Label htmlFor="holiday-date">Date</Label>
                <Input
                  id="holiday-date"
                  type="date"
                  value={newHolidayDate}
                  onChange={(e) => setNewHolidayDate(e.target.value)}
                  className="text-xs font-[family-name:var(--font-jetbrains-mono)]"
                />
              </div>
              <div className="flex-1 w-full space-y-1.5">
                <Label htmlFor="holiday-label">Label</Label>
                <Input
                  id="holiday-label"
                  placeholder="e.g. Independence Day"
                  value={newHolidayLabel}
                  onChange={(e) => setNewHolidayLabel(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addHoliday}
                disabled={!newHolidayDate || !newHolidayLabel}
                className="gap-1.5 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Timezone ── */}
      <section>
        <SectionHeading
          icon={Globe}
          title="Timezone"
          description="Controls how times appear in bookings and messages."
        />
        <Card>
          <CardContent className="p-5">
            <div className="max-w-sm">
              <Select value={timezone} onValueChange={setTimezone}>
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
          </CardContent>
        </Card>
      </section>

      {/* ── Location (Service only) ── */}
      {isService && (
        <section>
          <SectionHeading
            icon={MapPin}
            title="Location"
            description="Your business address shown to customers."
          />
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address">Street address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── Support Contact ── */}
      <section>
        <SectionHeading
          icon={Building2}
          title="Support Contact"
          description="How customers can reach you for issues the agent can't handle."
        />
        <Card>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="support-phone">Phone</Label>
                <Input
                  id="support-phone"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="font-[family-name:var(--font-jetbrains-mono)]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="support-email">Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Currency ── */}
      <section>
        <SectionHeading
          icon={Globe}
          title="Currency"
          description="Default currency for pricing and orders."
        />
        <Card>
          <CardContent className="p-5">
            <div className="max-w-sm">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
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
          </CardContent>
        </Card>
      </section>

      {/* ── Website & Socials ── */}
      <section>
        <SectionHeading
          icon={Globe}
          title="Website & Social Links"
          description="Public links shown to customers."
        />
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="@username"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="facebook.com/..."
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Sticky Save Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--slate)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-end gap-3 px-6">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
