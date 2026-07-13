export const businesses = { name: "Bloom Studio", plan: "Growth", handle: "bloom" };

export const highlights = [
  { title: "Built for real conversations", body: "Purpose-tuned models that sound like your business — not a chatbot." },
  { title: "Live in minutes, no code", body: "Connect a number, drop in your catalog, watch it answer the next message." },
  { title: "Your customer data stays yours", body: "Never used to train third-party models. Encrypted end to end." },
];

export const howItWorks = [
  { n: 1, title: "Connect your number", body: "Bring a WhatsApp Business number or spin up a new voice line in one click." },
  { n: 2, title: "Add your catalog", body: "Upload a menu or price list, or just tell your agent what you sell." },
  { n: 3, title: "Agent handles the conversation", body: "It answers, quotes, and books — in your tone, 24/7." },
  { n: 4, title: "Escalate what it can't solve", body: "Anything unusual pings your team with full context." },
  { n: 5, title: "Review analytics", body: "See what customers ask, what closed, and what to fix." },
];

export const features = [
  { title: "Sync with real-time data", body: "Live inventory, calendars and staff schedules — the agent always knows what's available." },
  { title: "Take actions automatically", body: "Place orders, hold slots, send invoices, refund a customer — with the guardrails you set." },
  { title: "Compare AI models", body: "Try GPT, Claude and Gemini side-by-side on your real conversations before you ship." },
  { title: "Smart escalation", body: "Configurable handoff to a human the moment intent gets ambiguous or high-value." },
  { title: "Advanced reporting", body: "Revenue influenced, resolution rate, top questions, response distribution — one place." },
];

export const integrations = ["WhatsApp", "Google Calendar", "Cal.com", "Stripe", "Lemon Squeezy", "Slack", "Zapier", "Shopify", "Twilio", "HubSpot"];

export const testimonials = [
  { quote: "It booked 41 appointments the first week. We haven't missed a WhatsApp since.", name: "Ana Reyes", role: "Owner, Bloom Studio", company: "Bloom" },
  { quote: "Feels like we hired someone who works nights and never forgets a price.", name: "Marc Duval", role: "GM, Bistro Nord", company: "Bistro Nord" },
  { quote: "Setup was ten minutes. Our resolution rate is 78%.", name: "Priya Shah", role: "COO, Verdant Care", company: "Verdant" },
  { quote: "Our staff finally stopped copy-pasting the menu into WhatsApp.", name: "Diego Alvarez", role: "Founder, Casa Loma", company: "Casa Loma" },
];

export const conversations = [
  { id: "c1", channel: "whatsapp", customer: "Sofia N.", preview: "Do you have space for two at 7:30 tonight?", status: "resolved", confidence: 3, time: "2m", ai: true },
  { id: "c2", channel: "voice", customer: "+34 612 44 88 11", preview: "Voice: I'd like to cancel my Saturday booking.", status: "pending", confidence: 2, time: "6m", ai: true },
  { id: "c3", channel: "whatsapp", customer: "James L.", preview: "What's the price for balayage on long hair?", status: "resolved", confidence: 3, time: "14m", ai: true },
  { id: "c4", channel: "whatsapp", customer: "Anonymous", preview: "hi is anyone there??", status: "open", confidence: 1, time: "22m", ai: false },
  { id: "c5", channel: "whatsapp", customer: "Maria G.", preview: "Can I move my haircut to Friday please?", status: "resolved", confidence: 3, time: "1h", ai: true },
  { id: "c6", channel: "whatsapp", customer: "Kenji P.", preview: "Do you refund a deposit if I cancel same day?", status: "open", confidence: 1, time: "1h", ai: false },
];

export const catalogItems = [
  { id: "s1", name: "Women's Haircut", category: "Hair", price: 1800, active: true, duration: 45 },
  { id: "s2", name: "Men's Haircut", category: "Hair", price: 1400, active: true, duration: 30 },
  { id: "s3", name: "Balayage", category: "Color", price: 4500, active: true, duration: 120 },
  { id: "s4", name: "Blowout", category: "Style", price: 1200, active: true, duration: 30 },
  { id: "s5", name: "Deep Conditioning", category: "Treatment", price: 900, active: false, duration: 20 },
  { id: "s6", name: "Bridal Package", category: "Special", price: 8500, active: true, duration: 180 },
];

export const bookings = [
  { id: "b1", customer: "Sofia N.", service: "Balayage", staff: "Ana", time: "10:00", day: "Mon", status: "confirmed" },
  { id: "b2", customer: "James L.", service: "Men's Haircut", staff: "Luis", time: "11:30", day: "Mon", status: "confirmed" },
  { id: "b3", customer: "Maria G.", service: "Blowout", staff: "Ana", time: "14:00", day: "Tue", status: "confirmed" },
  { id: "b4", customer: "Kenji P.", service: "Women's Haircut", staff: "Ana", time: "16:30", day: "Wed", status: "pending" },
  { id: "b5", customer: "Priya S.", service: "Bridal Package", staff: "Ana", time: "09:00", day: "Sat", status: "confirmed" },
];

export const questions = [
  { topic: "Pricing for balayage", volume: 142, trend: "up" },
  { topic: "Booking availability weekends", volume: 98, trend: "up" },
  { topic: "Cancellation policy", volume: 61, trend: "flat" },
  { topic: "Do you sell gift cards", volume: 44, trend: "up" },
  { topic: "Parking / location", volume: 33, trend: "down" },
];

export const numbers = [
  { id: "n1", label: "Main WhatsApp", value: "+34 611 22 33 44", channel: "whatsapp", active: true, msgs: [12, 18, 22, 14, 26, 31, 24] },
  { id: "n2", label: "Voice line", value: "+34 900 12 34 56", channel: "voice", active: true, msgs: [4, 6, 3, 8, 11, 9, 7] },
];

export const staff = ["Ana", "Luis", "Camila"];
export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
