"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Users,
  Zap,
  AlertTriangle,
  Radio,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  todayStats,
  resolutionRates,
  upcomingAppointments,
  recentActivity,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const activityIcons: Record<string, React.ReactNode> = {
  booking: <Calendar className="h-4 w-4" />,
  escalation: <AlertTriangle className="h-4 w-4" />,
  low_stock: <Zap className="h-4 w-4" />,
  new_contact: <Users className="h-4 w-4" />,
  broadcast: <Radio className="h-4 w-4" />,
};

const activityColors: Record<string, string> = {
  booking: "bg-[var(--mist)] text-[var(--cedar)]",
  escalation: "bg-[var(--ember)]/10 text-[var(--ember)]",
  low_stock: "bg-[var(--amber)]/10 text-[var(--amber)]",
  new_contact: "bg-[var(--mist)] text-[var(--cedar)]",
  broadcast: "bg-[var(--linen)] text-[var(--ash)]",
};

const statusStyles: Record<string, string> = {
  confirmed: "bg-[var(--mist)] text-[var(--cedar)]",
  pending: "bg-[var(--amber)]/10 text-[var(--amber)]",
  cancelled: "bg-[var(--ember)]/10 text-[var(--ember)]",
};

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-32" />
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-40" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-32" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
          Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--ash)]">
          Today&apos;s snapshot for your business.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {todayStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-[var(--ash)] uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {stat.value}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium font-[family-name:var(--font-jetbrains-mono)]",
                    stat.changeType === "positive" && "text-[var(--cedar)]",
                    stat.changeType === "negative" && "text-[var(--ember)]",
                  )}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Resolution Rate + Upcoming ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Resolution Rate */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Agent Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visual bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--ash)]">Agent resolved</span>
                <span className="font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--cedar)]">
                  {resolutionRates.agentResolved}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--linen)]">
                <div
                  className="h-2 rounded-full bg-[var(--cedar)]"
                  style={{ width: `${resolutionRates.agentResolved}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--ash)]">Human handoff</span>
                <span className="font-semibold font-[family-name:var(--font-jetbrains-mono)] text-[var(--amber)]">
                  {resolutionRates.humanHandoff}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--linen)]">
                <div
                  className="h-2 rounded-full bg-[var(--amber)]"
                  style={{ width: `${resolutionRates.humanHandoff}%` }}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {resolutionRates.resolvedByAgent}
                </p>
                <p className="text-xs text-[var(--ash)]">Resolved by agent</p>
              </div>
              <div>
                <p className="text-2xl font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                  {resolutionRates.handoffToHuman}
                </p>
                <p className="text-xs text-[var(--ash)]">Handed off</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            <Link
              href="/bookings"
              className="text-xs text-[var(--cedar)] hover:text-[var(--forest)] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {upcomingAppointments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)]">
                    <Calendar className="h-5 w-5 text-[var(--ash)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    No upcoming appointments.
                  </p>
                  <p className="text-xs text-[var(--ash)] text-center max-w-[200px]">
                    Your schedule is clear — new bookings will show up here.
                  </p>
                </div>
              ) : (
                upcomingAppointments.map((apt, i) => (
                <div key={apt.id}>
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--cedar)] text-xs font-semibold font-[family-name:var(--font-dm-sans)]">
                        {apt.client
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--ink)] truncate">
                          {apt.client}
                        </p>
                        <p className="text-xs text-[var(--ash)] truncate">
                          {apt.service}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-medium text-[var(--ink)] font-[family-name:var(--font-jetbrains-mono)]">
                          {apt.time}
                        </p>
                        <p className="text-xs text-[var(--ash)]">{apt.date}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] capitalize border-0",
                          statusStyles[apt.status],
                        )}
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                  {i < upcomingAppointments.length - 1 && <Separator />}
              </div>
              ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Activity ── */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <Link
            href="/inbox"
            className="text-xs text-[var(--cedar)] hover:text-[var(--forest)] flex items-center gap-1 transition-colors"
          >
            Open Inbox <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--linen)]">
                  <Clock className="h-5 w-5 text-[var(--ash)]" />
                </div>
                <p className="text-sm font-medium text-[var(--ink)]">
                  Nothing happening yet.
                </p>
                <p className="text-xs text-[var(--ash)] text-center max-w-[220px]">
                  Activity from your agent and customers will appear here as it
                  comes in.
                </p>
              </div>
            ) : (
              recentActivity.map((item, i) => (
              <div key={item.id}>
                <div className="flex items-start gap-3 py-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      activityColors[item.type],
                    )}
                  >
                    {activityIcons[item.type]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--ink)]">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--ash)] mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="h-3 w-3 text-[var(--ash)]" />
                      <span className="text-xs text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">
                        {item.time}
                      </span>
                      {item.contact && (
                        <>
                          <span className="text-[var(--slate)]">·</span>
                          <Link
                            href="/inbox"
                            className="text-xs text-[var(--cedar)] hover:text-[var(--forest)] transition-colors flex items-center gap-0.5"
                          >
                            View conversation <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {i < recentActivity.length - 1 && <Separator />}
              </div>
            ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
