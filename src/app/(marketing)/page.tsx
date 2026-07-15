"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Check, Bot, MessageCircle, Zap, MessageSquare, Upload, ArrowUpRight, ExternalLink, ArrowLeft, Target, Grid, Shield, Phone, Smartphone, Users, BarChart3, Award, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <BackgroundEffects />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
          <AnimatedGradient />
        </div>

        <div className="container relative mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Live in minutes, running your business by tonight</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              AI agents that sell and book
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                for your business
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Ringly answers WhatsApp and phone calls in your voice, quotes prices, and closes bookings — 24/7
              accessible, ready in minutes without code.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 rounded-full text-lg font-semibold shadow-2xl shadow-primary/30">
                  Free forever plan <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg font-semibold">
                  Watch demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>Setup in 10 minutes</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-[2.5rem] border border-border/40 bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
              <HeroPhoneMockup />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Trusted by 500+ businesses
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40 grayscale">
            {["Bloom", "Bistro Nord", "Verdant", "Casa Loma", "Nova Salon", "Ochre", "Vela & Co", "Spa Central"].map((company) => (
              <motion.p
                key={company}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: company.length * 0.1 }}
                className="text-xl font-bold"
              >
                {company}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* For Each Business Type */}
      <section className="py-24 bg-gradient-to-b from-background to-[#faf7f3]/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Best for your business type</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Two tailored experiences
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              The same powerful platform, specialized for the way you do business
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ServiceBusinessCard />
            <ProductBusinessCard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-[#faf7f3]/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Everything you need</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Features that drive results
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Powered by modern AI architecture with your business data at its core
            </motion.p>
          </div>

          <FeatureGrid />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Grid className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Simple process</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Get started in minutes
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              No complex setup. No technical skills required.
            </motion.p>
          </div>

          <div className="max-w-6xl mx-auto">
            <ThreeColumnStep />
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            <StatItem number="82%" label="Bookings converted" />
            <StatItem number="$4.8k" label="Average revenue" />
            <StatItem number="94%" label="AI confidence" />
            <StatItem number="31h" label="Time saved" />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#faf7f3]/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Owners are getting hours back
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Real results from real businesses
            </motion.p>
          </div>

          <TestimonialCard />
        </div>
      </section>

      {/* Security Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6"
            >
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Built for security</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Enterprise-grade security
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Your data stays yours. Always.
            </motion.p>
          </div>

          <SecurityGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0b] via-[#121212] to-[#0a0a0b]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
              Ready to reclaim your time?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Start your free trial today. No credit card required. Setup takes less than 10 minutes.
            </p>

            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="h-16 px-12 bg-gradient-to-r from-white to-gray-200 text-black rounded-full text-xl font-semibold shadow-2xl"
              >
                Get Started Free <ArrowRight className="ml-2 h-5 w-5 inline" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold">Ringly</div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6"
            >
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            © 2026 Ringly. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
    </div>
  );
}

function AnimatedGradient() {
  const colors = ["bg-primary/20", "bg-purple-500/20", "bg-pink-500/20", "bg-blue-500/20"];
  const positions = ["top-0 left-0", "top-1/2 right-0", "bottom-0 left-1/3", "bottom-1/2 right-1/4"];

  return (
    <div className="relative w-full h-full">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${color}`}
          style={{ top: positions[i].split(" ")[0], left: positions[i].split(" ")[1] }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function HeroPhoneMockup() {
  const [activeChat, setActiveChat] = useState(0);

  const conversations = [
    {
      id: 0,
      name: "Sofia N.",
      type: "whatsapp",
      preview: "Hi! Do you have space for 2...",
      status: "live"
    },
    {
      id: 1,
      name: "Marcus T.",
      type: "voice",
      preview: "I'd like to book a haircut...",
      status: "live"
    },
    {
      id: 2,
      name: "Sarah M.",
      type: "whatsapp",
      preview: "Can I reschedule my appointment?",
      status: "live"
    }
  ];

  const [currentChat, setCurrentChat] = useState(["Hi! Do you have space for 2 people this Saturday around 3pm? For a haircut + blowout?", "Hey Sofia — yes, Saturday at 3:30 PM works with Ana. That's $30 for the cut and blowout together. Should I lock it in?", "Yes please 🙌", "Booked — see you Saturday 3:30 PM. I'll send a reminder Friday morning ✨"]);
  const [currentBubbleIndex, setCurrentBubbleIndex] = useState(0);
  const [typing, setTyping] = useState(false);

  const activateNextChat = useCallback(() => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setActiveChat((prev) => (prev + 1) % conversations.length);
      setCurrentBubbleIndex(0);
      setCurrentChat(["Hi! Do you have space for 2 people this Saturday around 3pm? For a haircut + blowout?", "Hey Sofia — yes, Saturday at 3:30 PM works with Ana. That's $30 for the cut and blowout together. Should I lock it in?", "Yes please 🙌", "Booked — see you Saturday 3:30 PM. I'll send a reminder Friday morning ✨"]);
    }, 1500);
  }, [conversations.length]);

  const addAgentResponse = useCallback(() => {
    setTyping(true);
    const timer = setTimeout(() => {
      setTyping(false);
      setCurrentBubbleIndex((i) => i + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const addUserResponse = useCallback(() => {
    const delay = 500 + Math.random() * 1500;
    const timer = setTimeout(() => {
      setCurrentBubbleIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleChat = () => {
      if (currentBubbleIndex >= currentChat.length) {
        activateNextChat();
        return;
      }

      const isAgentResponse = currentBubbleIndex % 2 !== 0;
      if (isAgentResponse) {
        addAgentResponse();
      } else {
        addUserResponse();
      }
    };

    if (currentBubbleIndex < currentChat.length || typing) {
      const timeout = setTimeout(handleChat, typing ? 1500 : 500 + Math.random() * 1500);
      return () => clearTimeout(timeout);
    }
  }, [currentBubbleIndex, typing, currentChat.length, activateNextChat, addAgentResponse, addUserResponse]);

  return (
    <div className="min-h-[500px] bg-white/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-6 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-whatsapp text-white font-semibold">{conversations[activeChat].type === "whatsapp" ? "W" : "V"}</div>
          <div>
            <div className="font-semibold">{conversations[activeChat].name}</div>
            <div className="text-xs text-success font-medium">💬 Live</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              onClick={() => setActiveChat(i - 1)}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${activeChat === i - 1 ? "ring-2 ring-primary" : "opacity-40 hover:opacity-60 cursor-pointer"}`}
            >
              <MessageCircle size={16} />
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="p-6 space-y-4 h-[400px] overflow-y-auto">
        {currentChat.slice(0, currentBubbleIndex).map((bubble, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <ChatBubble role={bubble.role}>
              {bubble.text}
            </ChatBubble>
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ChatBubble role="agent">
              <span className="animate-pulse">...</span>
            </ChatBubble>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ChatBubble({ role, children }: { role: "user" | "agent"; children: React.ReactNode }) {
  const isAgent = role === "agent";
  return (
    <div className={`max-w-[85%] px-4 py-3 rounded-2xl leading-relaxed ${isAgent ? "ml-auto bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 text-white" : "rounded-tl-none bg-[#dcf8c6]"}`}>
      {children}
    </div>
  );
}

function ServiceBusinessCard() {
  const services = [
    { icon: Zap, label: "Service booking", items: ["Check availability", "Create bookings", "Send reminders"] },
    { icon: Phone, label: "Multi-staff support", items: ["Resource calendars", "Conflict detection", "Waitlist management"] },
    { icon: Users, label: "Repeat customers", items: ["Customer memory", "Custom treatment plans", "Loyalty tracking"] }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group rounded-[2rem] border border-border/40 bg-white p-8 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-500"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Phone size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Service Business</h3>
          <p className="text-muted-foreground">Salons, clinics, repair shops</p>
        </div>
      </div>

      <p className="text-muted-foreground mb-6 leading-relaxed">
        Perfect for businesses where time is the most valuable asset. Let AI handle bookings while you focus on delivering exceptional service.
      </p>

      <div className="space-y-4">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <div key={service.label} className="flex items-start gap-3">
              <div className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-primary/10">
                <Icon size={14} className="text-primary" />
              </div>
              <div>
                <div className="font-semibold">{service.label}</div>
                <div className="text-sm text-muted-foreground">{service.items.join(" · ")}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ProductBusinessCard() {
  const features = [
    { icon: Grid, label: "Visual catalog", items: ["WhatsApp Product Messages", "Image browsing", "Stock display"] },
    { icon: Zap, label: "Instant checkout", items: ["In-chat payments", "JazzCash/EasyPaisa", "Quick order processing"] },
    { icon: BarChart3, label: "Order insights", items: ["Status tracking", "History awareness", "Repeat customers"] }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group rounded-[2rem] border border-border/40 bg-white p-8 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-500"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Smartphone size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Product Business</h3>
          <p className="text-muted-foreground">Retailers, small shops</p>
        </div>
      </div>

      <p className="text-muted-foreground mb-6 leading-relaxed">
        Turn your WhatsApp into a 24/7 sales assistant with visual product catalog and instant checkout flows.
      </p>

      <div className="space-y-4">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div key={feature.label} className="flex items-start gap-3">
              <div className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-primary/10">
                <Icon size={14} className="text-primary" />
              </div>
              <div>
                <div className="font-semibold">{feature.label}</div>
                <div className="text-sm text-muted-foreground">{feature.items.join(" · ")}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function FeatureGrid() {
  const features = [
    { icon: Bot, title: "AI-powered automation", description: "Intelligent agent that understands context and handles customer conversations autonomously. No training required." },
    { icon: Shield, title: "Human handoff", description: "Automatic escalation when AI is unsure. Your staff stays in control, customers always get a human when needed." },
    { icon: Users, title: "Persistent memory", description: "Agent remembers every customer, their history, and preferences. Repeat customers feel truly valued." },
    { icon: Award, title: "Language matching", description: "Detects and matches customer's language style including Roman Urdu, Urdu script, and code-switching." },
    { icon: Clock, title: "Proactive messaging", description: "Automated reminders, confirmations, status updates, and abandoned booking recovery." },
    { icon: Target, title: "Business analytics", description: "Track conversion rates, confidence scores, customer satisfaction, and identify knowledge gaps." },
    { icon: MessageCircle, title: "Transaction actions", description: "Agent can directly book appointments, process orders, check stock, and manage inventory." },
    { icon: Upload, title: "Easy configuration", description: "Plain-language settings without technical skills. Just answer simple questions." }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-2xl border border-border/40 bg-white p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
              <Icon size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function ThreeColumnStep() {
  const steps = [
    {
      icon: Upload,
      title: "Share your data",
      description: "Tell us about your services, products, policies, and rules. Simple guided setup takes 10 minutes."
    },
    {
      icon: Bot,
      title: "Your AI agent launches",
      description: "Agent goes live on your WhatsApp number, handling real conversations instantly."
    },
    {
      icon: Users,
      title: "Stay in control",
      description: "Monitor conversations, hand off to staff, track analytics, and refine your agent over time."
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-background to-white rounded-3xl p-8 border border-border/40 shadow-xl h-full">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg"
              >
                <Icon size={28} />
              </motion.div>

              <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Step {i + 1}</div>

              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>

              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>

            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="absolute -right-4 top-1/2 z-0 hidden md:block"
              >
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl mb-2 font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
        {number}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function TestimonialCard() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, Bloom Salons",
      quote: "Ringly handled 40 bookings this week alone. My staff can finally focus on the customers who need that extra care.",
      image: "https://i.pravatar.cc/100?img=1"
    },
    {
      name: "Ahmed Khan",
      role: "Owner, Bistro Nord",
      quote: "The language matching is incredible. Our Roman Urdu customers feel heard like never before. Conversion rate up 35%.",
      image: "https://i.pravatar.cc/100?img=2"
    },
    {
      name: "Marina Rodriguez",
      role: "Manager, Casa Loma Spa",
      quote: "I set it up in 15 minutes and it was handling overnight bookings. This is the kind of automation we've been waiting for.",
      image: "https://i.pravatar.cc/100?img=3"
    }
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${active * 100}%)` }}>
          {testimonials.map((testimonial, i) => (
            <div key={i} className="w-full md:w-1/2 md:pr-4">
              <div className="rounded-2xl border border-border/40 bg-white p-8 shadow-xl mb-4">
                <div className="text-6xl text-primary/10 font-bold mb-4">&ldquo;</div>
                <p className="text-lg leading-relaxed mb-6">{testimonial.quote}</p>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-500"></div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setActive(i)}
            whileHover={{ scale: 1.2 }}
            className={`h-3 w-3 rounded-full transition-all ${active === i ? "bg-primary" : "bg-muted-foreground/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function SecurityGrid() {
  const securityItems = [
    { icon: Shield, title: "End-to-end encryption", description: "TLS in flight, AES-256 at rest. Your conversations are secure end-to-end." },
    { icon: Target, title: "No training data", description: "Your conversations are never used to train AI models. Data stays yours only." },
    { icon: Award, title: "SOC 2 compliant", description: "Enterprise-grade security and compliance standards built into every layer." }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {securityItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-2xl border border-border/40 bg-white p-6 hover:shadow-xl hover:border-success/30 transition-all duration-300"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-success/10 text-success group-hover:scale-110 transition-transform duration-300">
              <Icon size={24} />
            </div>

            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>

            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function Button({ children, className = "", variant = "default", ...props }: { children: React.ReactNode; className?: string; variant?: "default" | "outline" }) {
  const variants = {
    default: "bg-primary hover:bg-primary/90 text-primary-foreground",
    outline: "border border-border hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      className={`h-12 px-8 rounded-full font-semibold transition-all duration-200 active:scale-95 ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}