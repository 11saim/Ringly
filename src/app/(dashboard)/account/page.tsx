"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Shield,
  Trash2,
  Unplug,
  AlertCircle,
  XCircle,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTenant } from "@/lib/tenant-context";
import { mockInvoices, type Invoice } from "@/lib/data";
import { cn } from "@/lib/utils";

// ── Helpers ──

const plans = [
  {
    name: "Starter",
    price: 29,
    features: ["100 conversations/mo", "1 agent", "Basic analytics", "Email support"],
  },
  {
    name: "Growth",
    price: 49,
    features: ["500 conversations/mo", "3 agents", "Advanced analytics", "Priority support", "Broadcast messaging"],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: 99,
    features: ["Unlimited conversations", "Unlimited agents", "Custom analytics", "Dedicated support", "Broadcast messaging", "API access", "Custom integrations"],
  },
] as const;

function formatInvoiceDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Section Heading ──

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

// ── Main Page ──

export default function AccountPage() {
  const tenant = useTenant();

  // ── WhatsApp state ──
  const [waConnected, setWaConnected] = useState(true);
  const [waNumber] = useState("+1 (555) 234-5678");
  const [waConnecting, setWaConnecting] = useState(false);

  // ── Subscription state ──
  const [currentPlan, setCurrentPlan] = useState<string>("Growth");
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("Growth");

  // ── Account form state ──
  const [email, setEmail] = useState("hello@bloomstudio.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  // ── Danger zone state ──
  const [deleteBusinessOpen, setDeleteBusinessOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleReconnect = () => {
    setWaConnecting(true);
    // Simulate Meta OAuth redirect + callback
    setTimeout(() => {
      setWaConnecting(false);
      setWaConnected(true);
    }, 2000);
  };

  const handleDisconnect = () => {
    setWaConnected(false);
  };

  const handleSaveEmail = () => {
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    setPwSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPwSaved(false), 2000);
  };

  const handlePlanChange = () => {
    setCurrentPlan(selectedPlan);
    setPlanDialogOpen(false);
  };

  const currentPlanData = plans.find((p) => p.name === currentPlan);
  const nextBillingDate = "Aug 1, 2026";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
          Account & Billing
        </h1>
        <p className="text-sm text-[var(--ash)] mt-1">
          Manage your WhatsApp connection, subscription, and account settings.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          WHATSAPP CONNECTION
          ══════════════════════════════════════════════════════════════════════ */}

      <section className="mb-8">
        <SectionHeading
          icon={MessageSquare}
          title="WhatsApp connection"
          description="Connect your business phone number via the Meta Cloud API."
        />

        <Card>
          <CardContent className="p-5">
            {waConnected ? (
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--mist)] text-[var(--cedar)]">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                        Connected
                      </p>
                      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-[var(--mist)] text-[var(--cedar)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cedar)] animate-agent-pulse" />
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-[var(--ink)] mt-1 font-[family-name:var(--font-jetbrains-mono)]">
                      {waNumber}
                    </p>
                    <p className="text-[10px] text-[var(--ash)] mt-1">
                      Connected via Meta Cloud API · Last synced 2 min ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReconnect}
                    disabled={waConnecting}
                    className="gap-1.5"
                  >
                    <RefreshCw
                      className={cn(
                        "h-3.5 w-3.5",
                        waConnecting && "animate-spin",
                      )}
                    />
                    Reconnect
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDisconnect}
                    className="gap-1.5 text-[var(--ember)] border-[var(--ember)]/30 hover:bg-[var(--ember)]/5"
                  >
                    <Unplug className="h-3.5 w-3.5" />
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--linen)] mx-auto mb-3">
                  <MessageSquare className="h-5 w-5 text-[var(--ash)]" />
                </div>
                <p className="text-sm font-medium text-[var(--ink)] mb-1">
                  No WhatsApp number connected
                </p>
                <p className="text-xs text-[var(--ash)] mb-4 max-w-sm mx-auto">
                  Connect your business phone number through Meta Cloud API to
                  start receiving and sending messages.
                </p>
                <Button
                  size="sm"
                  onClick={handleReconnect}
                  disabled={waConnecting}
                  className="gap-1.5"
                >
                  {waConnecting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Connecting via Meta...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-3.5 w-3.5" />
                      Connect via Meta Cloud API
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-[var(--ash)] mt-3">
                  You'll be redirected to Meta to authorise the connection.
                  <br />
                  Requires a Meta Business account with WhatsApp Business API
                  access.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SUBSCRIPTION & BILLING
          ══════════════════════════════════════════════════════════════════════ */}

      <section className="mb-8">
        <SectionHeading
          icon={CreditCard}
          title="Subscription & billing"
          description="Manage your plan and view past invoices."
        />

        {/* Current plan card */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                    Current plan
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    {currentPlan}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                    ${currentPlanData?.price}
                  </span>
                  <span className="text-sm text-[var(--ash)]">/month</span>
                </div>
                <p className="text-xs text-[var(--ash)] mt-1">
                  Next billing date: {nextBillingDate}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                  {currentPlanData?.features.map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1 text-[11px] text-[var(--ink)]"
                    >
                      <Check className="h-3 w-3 text-[var(--cedar)]" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedPlan(currentPlan);
                  setPlanDialogOpen(true);
                }}
                className="gap-1.5"
              >
                Change plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoice history */}
        <Card>
          <CardContent className="p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ash)] mb-3">
              Invoice history
            </h4>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)]">
                          <CreditCard className="h-5 w-5 text-[var(--ash)]" />
                        </div>
                        <p className="text-sm font-medium text-[var(--ink)]">
                          No invoices yet.
                        </p>
                        <p className="text-xs text-[var(--ash)] max-w-[240px]">
                          Your billing history will appear here after your first
                          subscription payment.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-xs font-[family-name:var(--font-jetbrains-mono)] text-[var(--ash)]">
                      {inv.id.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm text-[var(--ink)]">
                      {inv.description}
                    </TableCell>
                    <TableCell className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-[var(--ash)]">
                      {formatInvoiceDate(inv.date)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                      ${inv.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] capitalize",
                          inv.status === "paid" &&
                            "border-[var(--cedar)] bg-[var(--mist)] text-[var(--cedar)]",
                          inv.status === "pending" &&
                            "border-[var(--amber)] bg-[var(--amber)]/10 text-[var(--amber)]",
                          inv.status === "failed" &&
                            "border-[var(--ember)] bg-[var(--ember)]/10 text-[var(--ember)]",
                        )}
                      >
                        {inv.status === "paid" && (
                          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                        )}
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ACCOUNT DETAILS
          ══════════════════════════════════════════════════════════════════════ */}

      <section className="mb-8">
        <SectionHeading
          icon={Shield}
          title="Account details"
          description="Manage your email and password."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--ash)]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ash)]">
                  Owner email
                </h4>
              </div>
              <div className="space-y-1.5">
                <Label>Email address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSaveEmail} className="gap-1.5">
                  {emailSaved ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Saved
                    </>
                  ) : (
                    "Save email"
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-[var(--ash)]">
                This email is used for login, billing receipts, and important
                account notifications.
              </p>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-[var(--ash)]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ash)]">
                  Change password
                </h4>
              </div>
              <div className="space-y-1.5">
                <Label>Current password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-hover-bg transition-colors"
                  >
                    {showCurrentPw ? (
                      <EyeOff className="h-3.5 w-3.5 text-[var(--ash)]" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 text-[var(--ash)]" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>New password</Label>
                <div className="relative">
                  <Input
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-hover-bg transition-colors"
                  >
                    {showNewPw ? (
                      <EyeOff className="h-3.5 w-3.5 text-[var(--ash)]" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 text-[var(--ash)]" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Confirm new password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                />
                {newPassword &&
                  confirmPassword &&
                  newPassword !== confirmPassword && (
                    <p className="text-[10px] text-[var(--ember)]">
                      Passwords do not match.
                    </p>
                  )}
              </div>
              <Button
                size="sm"
                onClick={handleChangePassword}
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  newPassword !== confirmPassword
                }
                className="gap-1.5"
              >
                {pwSaved ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Password updated
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DANGER ZONE
          ══════════════════════════════════════════════════════════════════════ */}

      <section>
        <div className="rounded-lg border border-[var(--ember)]/30 bg-[var(--ember)]/5 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--ember)]/10 text-[var(--ember)]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--ember)] font-[family-name:var(--font-dm-sans)]">
                Danger zone
              </h3>
              <p className="text-xs text-[var(--ash)] mt-0.5">
                Irreversible actions — please proceed with caution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delete business */}
            <div className="rounded-md border border-[var(--ember)]/20 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-4 w-4 text-[var(--ember)]" />
                <h4 className="text-sm font-semibold text-[var(--ink)]">
                  Delete business
                </h4>
              </div>
              <p className="text-xs text-[var(--ash)] mb-3 leading-relaxed">
                Permanently delete <strong>{tenant.name}</strong> and all
                associated data including contacts, conversations, bookings,
                and settings. This cannot be undone.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDeleteConfirmText("");
                  setDeleteBusinessOpen(true);
                }}
                className="gap-1.5 text-[var(--ember)] border-[var(--ember)]/30 hover:bg-[var(--ember)]/5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete business
              </Button>
            </div>

            {/* Delete account */}
            <div className="rounded-md border border-[var(--ember)]/20 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-[var(--ember)]" />
                <h4 className="text-sm font-semibold text-[var(--ink)]">
                  Delete account
                </h4>
              </div>
              <p className="text-xs text-[var(--ash)] mb-3 leading-relaxed">
                Permanently delete your user account and all access. Any
                businesses you own will also be deleted. This cannot be undone.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDeleteConfirmText("");
                  setDeleteAccountOpen(true);
                }}
                className="gap-1.5 text-[var(--ember)] border-[var(--ember)]/30 hover:bg-[var(--ember)]/5"
              >
                <XCircle className="h-3.5 w-3.5" />
                Delete account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DIALOGS
          ══════════════════════════════════════════════════════════════════════ */}

      {/* Plan change dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change plan</DialogTitle>
            <DialogDescription>
              Select a plan that fits your business needs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plans.map((plan) => (
              <button
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={cn(
                  "relative rounded-lg border p-4 text-left transition-colors",
                  selectedPlan === plan.name
                    ? "border-[var(--cedar)] bg-[var(--mist)]"
                    : "border-[var(--slate)] hover:border-[var(--border-strong)]",
                  plan.name === currentPlan &&
                    "ring-2 ring-[var(--cedar)]/20",
                )}
              >
                {"recommended" in plan && plan.recommended && (
                  <span className="absolute -top-2.5 left-3 rounded bg-[var(--cedar)] px-2 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                {plan.name === currentPlan && (
                  <span className="absolute -top-2.5 right-3 rounded bg-[var(--linen)] border border-[var(--slate)] px-2 py-0.5 text-[9px] font-medium text-[var(--ash)] uppercase tracking-wider">
                    Current
                  </span>
                )}
                <p className="text-sm font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-2xl font-bold text-[var(--ink)]">
                    ${plan.price}
                  </span>
                  <span className="text-xs text-[var(--ash)]">/mo</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {plan.features.map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1.5 text-[11px] text-[var(--ink)]"
                    >
                      <Check className="h-3 w-3 text-[var(--cedar)] shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePlanChange}
              disabled={selectedPlan === currentPlan}
            >
              {selectedPlan === currentPlan
                ? "Current plan"
                : `Switch to ${selectedPlan}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete business dialog */}
      <Dialog open={deleteBusinessOpen} onOpenChange={setDeleteBusinessOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--ember)]">
              Delete {tenant.name}?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete this business and all its data
              including contacts, conversations, bookings, broadcasts, and
              settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md bg-[var(--ember)]/5 border border-[var(--ember)]/20 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-[var(--ember)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--ink)] leading-relaxed">
                  This action is <strong>irreversible</strong>. All data will be
                  permanently removed from our servers.
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>
                Type <strong>{tenant.handle}</strong> to confirm:
              </Label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={tenant.handle}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteBusinessOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== tenant.handle}
              onClick={() => {
                setDeleteBusinessOpen(false);
                setDeleteConfirmText("");
              }}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete business permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete account dialog */}
      <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--ember)]">
              Delete your account?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your account and revoke all access.
              Any businesses you own will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md bg-[var(--ember)]/5 border border-[var(--ember)]/20 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-[var(--ember)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--ink)] leading-relaxed">
                  This action is <strong>irreversible</strong>. You will lose
                  access to all businesses and data associated with this
                  account.
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>
                Type <strong>delete my account</strong> to confirm:
              </Label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="delete my account"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteAccountOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== "delete my account"}
              onClick={() => {
                setDeleteAccountOpen(false);
                setDeleteConfirmText("");
              }}
            >
              <XCircle className="h-3.5 w-3.5 mr-1.5" />
              Delete account permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
