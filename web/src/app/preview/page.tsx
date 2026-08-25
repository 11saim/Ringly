"use client";

import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[var(--parchment)]">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-16">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
            Design System Preview
          </h1>
          <p className="mt-2 text-[var(--ash)]">
            All restyled shadcn primitives against the Ringly palette.
          </p>
        </div>

        {/* ── Color Palette ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Palette
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: "Parchment", hex: "#FAF9F6", bg: "bg-[var(--parchment)]", text: "text-[var(--ink)]" },
              { name: "Linen", hex: "#F0EDE6", bg: "bg-[var(--linen)]", text: "text-[var(--ink)]" },
              { name: "Slate", hex: "#D8D4CB", bg: "bg-[var(--slate)]", text: "text-[var(--ink)]" },
              { name: "Ink", hex: "#1A1814", bg: "bg-[var(--ink)]", text: "text-white" },
              { name: "Ash", hex: "#7C776D", bg: "bg-[var(--ash)]", text: "text-white" },
              { name: "Cedar", hex: "#0D6B5E", bg: "bg-[var(--cedar)]", text: "text-white" },
              { name: "Forest", hex: "#0A5549", bg: "bg-[var(--forest)]", text: "text-white" },
              { name: "Mist", hex: "#E6F2EE", bg: "bg-[var(--mist)]", text: "text-[var(--ink)]" },
              { name: "Amber", hex: "#D4880F", bg: "bg-[var(--amber)]", text: "text-white" },
              { name: "Ember", hex: "#C24D2C", bg: "bg-[var(--ember)]", text: "text-white" },
            ].map((c) => (
              <div key={c.name} className="space-y-1">
                <div className={`h-16 rounded-lg border border-[var(--slate)] ${c.bg}`} />
                <p className="text-xs font-medium text-[var(--ink)]">{c.name}</p>
                <p className="text-xs text-[var(--ash)] font-[family-name:var(--font-jetbrains-mono)]">{c.hex}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── Typography ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Typography
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)]">
                DM Sans — Display
              </p>
              <p className="text-xs text-[var(--ash)] mt-1">Headings, titles, stat numbers</p>
            </div>
            <div>
              <p className="text-base text-[var(--ink)]">
                Inter — Body text for reading and UI labels. Clean, legible at small sizes.
              </p>
              <p className="text-xs text-[var(--ash)] mt-1">Body, form labels, descriptions</p>
            </div>
            <div>
              <p className="text-sm font-[family-name:var(--font-jetbrains-mono)] text-[var(--ink)]">
                JetBrains Mono — +1 (555) 012-3456 &nbsp; 2024-01-15T09:30:00Z
              </p>
              <p className="text-xs text-[var(--ash)] mt-1">Phone numbers, timestamps, IDs</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-4 items-end">
            {[
              { label: "xs", size: "text-xs", px: "12px" },
              { label: "sm", size: "text-sm", px: "14px" },
              { label: "base", size: "text-base", px: "16px" },
              { label: "lg", size: "text-lg", px: "18px" },
              { label: "xl", size: "text-xl", px: "20px" },
              { label: "2xl", size: "text-2xl", px: "24px" },
              { label: "3xl", size: "text-3xl", px: "30px" },
            ].map((s) => (
              <div key={s.label}>
                <span className={`${s.size} font-[family-name:var(--font-dm-sans)] text-[var(--ink)]`}>Aa</span>
                <p className="text-xs text-[var(--ash)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── Buttons ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Buttons
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
          </div>
        </section>

        <Separator />

        {/* ── Cards ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Cards
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>This is a card description.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--ink)]">
                  Card content goes here. Warm white background with a subtle border.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Save</Button>
                <Button size="sm" variant="outline">Cancel</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Agent Status</CardTitle>
                <CardDescription>Current conversation metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[var(--cedar)] animate-agent-pulse" />
                  <span className="text-sm text-[var(--ink)]">Active — handling 12 conversations</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* ── Form Elements ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Form Elements
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 012-3456" className="font-[family-name:var(--font-jetbrains-mono)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message..." />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service-based</SelectItem>
                    <SelectItem value="product">Product-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notifications</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-respond</Label>
                  <p className="text-xs text-[var(--ash)]">Let the agent handle messages automatically</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Human takeover</Label>
                  <p className="text-xs text-[var(--ash)]">Pause agent for escalated conversations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ── Badges ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Badges
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Escalated</Badge>
            <Badge variant="success">Connected</Badge>
            <Badge variant="warning">Pending</Badge>
          </div>
        </section>

        <Separator />

        {/* ── Avatar ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Avatar
          </h2>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback>KL</AvatarFallback>
            </Avatar>
          </div>
        </section>

        <Separator />

        {/* ── Table ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Table
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Sarah Ahmed</TableCell>
                  <TableCell className="font-[family-name:var(--font-jetbrains-mono)] text-xs">+92 301 1234567</TableCell>
                  <TableCell><Badge variant="success">Active</Badge></TableCell>
                  <TableCell className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--ash)]">2 min ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">James Wilson</TableCell>
                  <TableCell className="font-[family-name:var(--font-jetbrains-mono)] text-xs">+1 555 9876543</TableCell>
                  <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                  <TableCell className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--ash)]">15 min ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Maria Garcia</TableCell>
                  <TableCell className="font-[family-name:var(--font-jetbrains-mono)] text-xs">+34 612 345 678</TableCell>
                  <TableCell><Badge variant="destructive">Escalated</Badge></TableCell>
                  <TableCell className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--ash)]">1 hr ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ali Khan</TableCell>
                  <TableCell className="font-[family-name:var(--font-jetbrains-mono)] text-xs">+92 321 7654321</TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                  <TableCell className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--ash)]">Just now</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </section>

        <Separator />

        {/* ── Tabs ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Tabs
          </h2>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="persona">Persona</TabsTrigger>
              <TabsTrigger value="offerings">Offerings</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Business Profile</CardTitle>
                  <CardDescription>Manage your business information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--ash)]">Profile settings content goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="persona">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Persona</CardTitle>
                  <CardDescription>Define how your agent communicates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--ash)]">Persona configuration goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="offerings">
              <Card>
                <CardHeader>
                  <CardTitle>Offerings</CardTitle>
                  <CardDescription>Your services or products.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--ash)]">Offerings list goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="policies">
              <Card>
                <CardHeader>
                  <CardTitle>Policies & Escalation</CardTitle>
                  <CardDescription>Set rules for your agent.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--ash)]">Policies configuration goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="knowledge">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription>Information your agent uses to answer questions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--ash)]">Knowledge base content goes here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator />

        {/* ── Dialog ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Dialog
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
                  Are you sure you want to proceed? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <Separator />

        {/* ── Dropdown Menu ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Dropdown Menu
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Take over conversation</DropdownMenuItem>
              <DropdownMenuItem>View contact history</DropdownMenuItem>
              <DropdownMenuItem>Assign to agent</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[var(--ember)]">Escalate to manager</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        <Separator />

        {/* ── Separator ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Separator
          </h2>
          <p className="text-sm text-[var(--ash)] mb-2">Horizontal</p>
          <Separator />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-[var(--ink)]">Left</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-[var(--ink)]">Middle</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-[var(--ink)]">Right</span>
          </div>
        </section>

        {/* ── Agent Pulse Demo ── */}
        <section>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-dm-sans)] text-[var(--ink)] mb-4">
            Agent Pulse (Signature Element)
          </h2>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--cedar)] animate-agent-pulse" />
              <span className="text-sm text-[var(--ink)]">Active — handling 12 conversations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--amber)]" />
              <span className="text-sm text-[var(--ink)]">3 need your input</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--ember)]" />
              <span className="text-sm text-[var(--ink)]">You&apos;re live — 2 conversations</span>
            </div>
          </div>
        </section>

        <div className="h-24" />
      </div>
    </div>
  );
}
