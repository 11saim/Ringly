export interface Stat {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

export interface Appointment {
  id: string;
  client: string;
  service: string;
  time: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
}

export interface ActivityItem {
  id: string;
  type: "booking" | "escalation" | "low_stock" | "new_contact" | "broadcast";
  title: string;
  description: string;
  time: string;
  contact?: string;
}

export const todayStats: Stat[] = [
  { label: "Conversations", value: "47", change: "+12%", changeType: "positive" },
  { label: "Messages", value: "312", change: "+8%", changeType: "positive" },
  { label: "New Contacts", value: "9", change: "+3", changeType: "positive" },
  { label: "Avg Response", value: "1.2s", change: "-0.3s", changeType: "positive" },
];

export const resolutionRates = {
  agentResolved: 78,
  humanHandoff: 22,
  totalConversations: 47,
  resolvedByAgent: 37,
  handoffToHuman: 10,
};

export const upcomingAppointments: Appointment[] = [
  { id: "a1", client: "Sarah Ahmed", service: "Balayage", time: "10:00 AM", date: "Today", status: "confirmed" },
  { id: "a2", client: "James Wilson", service: "Men's Haircut", time: "11:30 AM", date: "Today", status: "confirmed" },
  { id: "a3", client: "Maria Garcia", service: "Manicure & Pedicure", time: "2:00 PM", date: "Today", status: "pending" },
  { id: "a4", client: "Ali Khan", service: "Beard Trim", time: "3:30 PM", date: "Today", status: "confirmed" },
  { id: "a5", client: "Priya Patel", service: "Facial Treatment", time: "10:00 AM", date: "Tomorrow", status: "pending" },
];

export const recentActivity: ActivityItem[] = [
  { id: "r1", type: "booking", title: "New booking confirmed", description: "Sarah Ahmed booked Balayage for today at 10:00 AM", time: "2 min ago", contact: "Sarah Ahmed" },
  { id: "r2", type: "escalation", title: "Conversation escalated", description: "James Wilson's query about pricing needs human review", time: "8 min ago", contact: "James Wilson" },
  { id: "r3", type: "new_contact", title: "New contact added", description: "Priya Patel started a conversation via WhatsApp", time: "15 min ago", contact: "Priya Patel" },
  { id: "r4", type: "broadcast", title: "Broadcast sent", description: "Weekend promo sent to 234 contacts — 89% delivered", time: "1 hr ago" },
  { id: "r5", type: "booking", title: "Booking rescheduled", description: "Ali Khan moved his appointment from 2:00 PM to 3:30 PM", time: "2 hr ago", contact: "Ali Khan" },
  { id: "r6", type: "escalation", title: "Refund request", description: "Maria Garcia requested a refund for cancelled service", time: "3 hr ago", contact: "Maria Garcia" },
];

// ── Inbox ──

export type ConversationMode = "agent" | "human" | "resolved";

export interface InboxMessage {
  id: string;
  sender: "agent" | "customer" | "human";
  text: string;
  time: string;
  note?: boolean;
}

export interface Conversation {
  id: string;
  contact: string;
  phone: string;
  initials: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  mode: ConversationMode;
  messages: InboxMessage[];
  notes: string[];
}

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    contact: "Sarah Ahmed",
    phone: "+92 301 1234567",
    initials: "SA",
    lastMessage: "Perfect, see you at 10!",
    lastTime: "2 min ago",
    unread: 0,
    mode: "agent",
    messages: [
      { id: "m1", sender: "customer", text: "Hi, I want to book a balayage for this Saturday", time: "9:12 AM" },
      { id: "m2", sender: "agent", text: "Hi Sarah! I'd be happy to help you book a balayage. We have openings at 10:00 AM and 2:00 PM this Saturday. Which works better for you?", time: "9:12 AM" },
      { id: "m3", sender: "customer", text: "10 AM works great. How long does it usually take?", time: "9:14 AM" },
      { id: "m4", sender: "agent", text: "A balayage typically takes about 2.5–3 hours. I've reserved the 10:00 AM slot for you. You'll receive a confirmation shortly.", time: "9:14 AM" },
      { id: "m5", sender: "customer", text: "Perfect, see you at 10!", time: "9:15 AM" },
    ],
    notes: [],
  },
  {
    id: "c2",
    contact: "James Wilson",
    phone: "+1 555 9876543",
    initials: "JW",
    lastMessage: "I need to speak to someone about pricing",
    lastTime: "8 min ago",
    unread: 2,
    mode: "human",
    messages: [
      { id: "m6", sender: "customer", text: "Do you offer group discounts?", time: "9:05 AM" },
      { id: "m7", sender: "agent", text: "We do! For groups of 4 or more, we offer 15% off the total. Would you like me to check availability for your group?", time: "9:05 AM" },
      { id: "m8", sender: "customer", text: "Actually I need to speak to someone about pricing for corporate events", time: "9:07 AM" },
      { id: "m9", sender: "agent", text: "I understand you'd like to discuss corporate event pricing. Let me connect you with our team. A human agent will be with you shortly.", time: "9:07 AM" },
      { id: "m10", sender: "human", text: "Hi James, I'm Sarah from Bloom Studio. I'd be happy to discuss corporate event pricing. What size group are you looking at?", time: "9:10 AM" },
      { id: "m11", sender: "customer", text: "I need to speak to someone about pricing", time: "9:12 AM" },
    ],
    notes: ["Corporate event inquiry — follow up with pricing sheet"],
  },
  {
    id: "c3",
    contact: "Maria Garcia",
    phone: "+34 612 345 678",
    initials: "MG",
    lastMessage: "Can I reschedule my appointment?",
    lastTime: "22 min ago",
    unread: 1,
    mode: "agent",
    messages: [
      { id: "m12", sender: "customer", text: "Can I reschedule my appointment?", time: "8:50 AM" },
      { id: "m13", sender: "agent", text: "Of course, Maria! Which appointment would you like to reschedule? I see you have a Manicure & Pedicure booked for today at 2:00 PM.", time: "8:50 AM" },
      { id: "m14", sender: "customer", text: "Yes that one. Something came up at work. Do you have anything this week?", time: "8:52 AM" },
      { id: "m15", sender: "agent", text: "We have openings tomorrow at 11:00 AM and Thursday at 3:00 PM. Would either of those work for you?", time: "8:52 AM" },
      { id: "m16", sender: "customer", text: "Can I reschedule my appointment?", time: "8:55 AM" },
    ],
    notes: [],
  },
  {
    id: "c4",
    contact: "Ali Khan",
    phone: "+92 321 7654321",
    initials: "AK",
    lastMessage: "Thanks for the quick response!",
    lastTime: "1 hr ago",
    unread: 0,
    mode: "resolved",
    messages: [
      { id: "m17", sender: "customer", text: "What are your prices for men's haircuts?", time: "8:00 AM" },
      { id: "m18", sender: "agent", text: "Our men's haircut services start at: Basic Cut — $15, Cut & Style — $22, Premium Cut with Beard — $30. Would you like to book one?", time: "8:00 AM" },
      { id: "m19", sender: "customer", text: "I'll take the cut and style, tomorrow at 3:30 PM", time: "8:02 AM" },
      { id: "m20", sender: "agent", text: "Done! I've booked a Cut & Style for tomorrow at 3:30 PM. See you then!", time: "8:02 AM" },
      { id: "m21", sender: "customer", text: "Thanks for the quick response!", time: "8:03 AM" },
    ],
    notes: [],
  },
  {
    id: "c5",
    contact: "Priya Patel",
    phone: "+91 98765 43210",
    initials: "PP",
    lastMessage: "What facial treatments do you offer?",
    lastTime: "3 hr ago",
    unread: 0,
    mode: "agent",
    messages: [
      { id: "m22", sender: "customer", text: "What facial treatments do you offer?", time: "6:00 AM" },
      { id: "m23", sender: "agent", text: "We offer several facial treatments: Classic Facial — $45 (60 min), Deep Cleansing — $65 (75 min), Anti-Aging Treatment — $85 (90 min), and Brightening Facial — $70 (75 min). Would you like to know more about any of these?", time: "6:01 AM" },
      { id: "m24", sender: "customer", text: "What facial treatments do you offer?", time: "6:05 AM" },
    ],
    notes: ["New contact — potential regular client"],
  },
];

// ── Offerings ──

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  staff: string[];
  availability: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  description: string;
  image: string | null;
  active: boolean;
}

export const mockServices: Service[] = [
  { id: "s1", name: "Balayage", duration: "2.5 hrs", price: 120, description: "Hand-painted highlights for a natural, sun-kissed look.", staff: ["Sarah A.", "Maria G."], availability: "Mon–Sat", active: true },
  { id: "s2", name: "Men's Haircut", duration: "45 min", price: 22, description: "Classic or modern cut with styling.", staff: ["Ali K."], availability: "Mon–Fri", active: true },
  { id: "s3", name: "Manicure & Pedicure", duration: "1.5 hrs", price: 45, description: "Full nail care with polish or gel finish.", staff: ["Priya P."], availability: "Tue–Sat", active: true },
  { id: "s4", name: "Beard Trim", duration: "30 min", price: 15, description: "Precision trim and shaping with hot towel.", staff: ["Ali K."], availability: "Mon–Sat", active: true },
  { id: "s5", name: "Facial Treatment", duration: "1 hr", price: 55, description: "Deep cleansing facial customized to skin type.", staff: ["Maria G."], availability: "Wed–Sat", active: false },
  { id: "s6", name: "Hair Coloring", duration: "2 hrs", price: 95, description: "Full or partial color with premium products.", staff: ["Sarah A."], availability: "Mon–Sat", active: true },
];

export const mockProducts: Product[] = [
  { id: "p1", name: "Vitamin C Serum", price: 34, stock: 48, lowStockThreshold: 10, category: "Skincare", description: "Brightening serum with 15% vitamin C.", image: null, active: true },
  { id: "p2", name: "Keratin Shampoo", price: 18, stock: 5, lowStockThreshold: 10, category: "Hair Care", description: "Smoothing shampoo for frizz-prone hair.", image: null, active: true },
  { id: "p3", name: "Matte Clay Pomade", price: 14, stock: 32, lowStockThreshold: 10, category: "Styling", description: "Strong hold matte finish for all hair types.", image: null, active: true },
  { id: "p4", name: "Coconut Oil Mask", price: 28, stock: 3, lowStockThreshold: 10, category: "Hair Care", description: "Deep conditioning treatment mask.", image: null, active: true },
  { id: "p5", name: "Nail Polish Set", price: 24, stock: 22, lowStockThreshold: 10, category: "Nails", description: "Set of 6 seasonal colors.", image: null, active: true },
  { id: "p6", name: "Hot Towel Warmer", price: 89, stock: 0, lowStockThreshold: 5, category: "Equipment", description: "Professional countertop towel warmer.", image: null, active: false },
];

// ── Contacts ──

export interface Contact {
  id: string;
  name: string;
  phone: string;
  initials: string;
  firstContact: string;
  lastContact: string;
  tags: string[];
  totalSpend: number;
  bookingCount: number;
  blocked: boolean;
  notes: string[];
  chatHistory: { sender: "agent" | "customer" | "human"; text: string; time: string }[];
  bookingHistory: { service: string; date: string; status: string; amount: number }[];
}

export const mockContacts: Contact[] = [
  {
    id: "ct1", name: "Sarah Ahmed", phone: "+92 301 1234567", initials: "SA",
    firstContact: "Jan 15, 2026", lastContact: "Today",
    tags: ["Regular", "VIP"], totalSpend: 480, bookingCount: 6,
    blocked: false,
    notes: ["Prefers afternoon appointments", "Allergic to certain products — check before treatment"],
    chatHistory: [
      { sender: "customer", text: "Hi, I want to book a balayage for this Saturday", time: "9:12 AM" },
      { sender: "agent", text: "Hi Sarah! I'd be happy to help you book a balayage. We have openings at 10:00 AM and 2:00 PM this Saturday. Which works better for you?", time: "9:12 AM" },
      { sender: "customer", text: "10 AM works great. How long does it usually take?", time: "9:14 AM" },
      { sender: "agent", text: "A balayage typically takes about 2.5–3 hours. I've reserved the 10:00 AM slot for you.", time: "9:14 AM" },
    ],
    bookingHistory: [
      { service: "Balayage", date: "Jan 20, 2026", status: "Completed", amount: 120 },
      { service: "Manicure & Pedicure", date: "Feb 5, 2026", status: "Completed", amount: 45 },
      { service: "Hair Coloring", date: "Feb 18, 2026", status: "Completed", amount: 95 },
      { service: "Balayage", date: "Today", status: "Confirmed", amount: 120 },
    ],
  },
  {
    id: "ct2", name: "James Wilson", phone: "+1 555 9876543", initials: "JW",
    firstContact: "Feb 1, 2026", lastContact: "Today",
    tags: ["New", "Corporate"], totalSpend: 22, bookingCount: 1,
    blocked: false,
    notes: ["Corporate event inquiry — follow up with pricing sheet"],
    chatHistory: [
      { sender: "customer", text: "Do you offer group discounts?", time: "9:05 AM" },
      { sender: "agent", text: "We do! For groups of 4 or more, we offer 15% off the total.", time: "9:05 AM" },
      { sender: "customer", text: "I need to speak to someone about pricing for corporate events", time: "9:07 AM" },
      { sender: "human", text: "Hi James, I'm Sarah from Bloom Studio. I'd be happy to discuss corporate event pricing.", time: "9:10 AM" },
    ],
    bookingHistory: [
      { service: "Men's Haircut", date: "Feb 1, 2026", status: "Completed", amount: 22 },
    ],
  },
  {
    id: "ct3", name: "Maria Garcia", phone: "+34 612 345 678", initials: "MG",
    firstContact: "Dec 10, 2025", lastContact: "Today",
    tags: ["Regular"], totalSpend: 175, bookingCount: 4,
    blocked: false,
    notes: [],
    chatHistory: [
      { sender: "customer", text: "Can I reschedule my appointment?", time: "8:50 AM" },
      { sender: "agent", text: "Of course, Maria! Which appointment would you like to reschedule?", time: "8:50 AM" },
      { sender: "customer", text: "Yes that one. Something came up at work.", time: "8:52 AM" },
    ],
    bookingHistory: [
      { service: "Manicure & Pedicure", date: "Dec 15, 2025", status: "Completed", amount: 45 },
      { service: "Facial Treatment", date: "Jan 8, 2026", status: "Completed", amount: 55 },
      { service: "Manicure & Pedicure", date: "Today", status: "Pending", amount: 45 },
    ],
  },
  {
    id: "ct4", name: "Ali Khan", phone: "+92 321 7654321", initials: "AK",
    firstContact: "Jan 25, 2026", lastContact: "1 hr ago",
    tags: ["Regular"], totalSpend: 52, bookingCount: 3,
    blocked: false,
    notes: [],
    chatHistory: [
      { sender: "customer", text: "What are your prices for men's haircuts?", time: "8:00 AM" },
      { sender: "agent", text: "Our men's haircut services start at: Basic Cut — $15, Cut & Style — $22", time: "8:00 AM" },
      { sender: "customer", text: "I'll take the cut and style, tomorrow at 3:30 PM", time: "8:02 AM" },
    ],
    bookingHistory: [
      { service: "Men's Haircut", date: "Jan 28, 2026", status: "Completed", amount: 22 },
      { service: "Beard Trim", date: "Feb 10, 2026", status: "Completed", amount: 15 },
      { service: "Cut & Style", date: "Tomorrow", status: "Confirmed", amount: 22 },
    ],
  },
  {
    id: "ct5", name: "Priya Patel", phone: "+91 98765 43210", initials: "PP",
    firstContact: "Today", lastContact: "3 hr ago",
    tags: ["New"], totalSpend: 0, bookingCount: 0,
    blocked: false,
    notes: ["New contact — potential regular client"],
    chatHistory: [
      { sender: "customer", text: "What facial treatments do you offer?", time: "6:00 AM" },
      { sender: "agent", text: "We offer several facial treatments: Classic Facial — $45, Deep Cleansing — $65", time: "6:01 AM" },
    ],
    bookingHistory: [],
  },
  {
    id: "ct6", name: "David Chen", phone: "+852 9123 4567", initials: "DC",
    firstContact: "Nov 5, 2025", lastContact: "3 days ago",
    tags: ["VIP", "Regular"], totalSpend: 890, bookingCount: 12,
    blocked: false,
    notes: ["Long-time client", "Birthday in March — send promo"],
    chatHistory: [
      { sender: "customer", text: "Hey, can I get my usual appointment next week?", time: "2:00 PM" },
      { sender: "agent", text: "Of course, David! Your usual Balayage + Manicure combo, next Tuesday at 10 AM?", time: "2:01 PM" },
    ],
    bookingHistory: [
      { service: "Balayage", date: "Jan 5, 2026", status: "Completed", amount: 120 },
      { service: "Manicure & Pedicure", date: "Jan 5, 2026", status: "Completed", amount: 45 },
      { service: "Hair Coloring", date: "Feb 2, 2026", status: "Completed", amount: 95 },
    ],
  },
  {
    id: "ct7", name: "Emma Thompson", phone: "+44 7700 900123", initials: "ET",
    firstContact: "Oct 20, 2025", lastContact: "1 week ago",
    tags: ["VIP"], totalSpend: 1250, bookingCount: 15,
    blocked: false,
    notes: ["Referred 3 friends", "Prefers Sarah for all treatments"],
    chatHistory: [
      { sender: "customer", text: "Hi, I'd like to book for next Saturday please", time: "11:00 AM" },
      { sender: "agent", text: "Hi Emma! What service would you like?", time: "11:00 AM" },
    ],
    bookingHistory: [
      { service: "Balayage", date: "Feb 15, 2026", status: "Completed", amount: 120 },
      { service: "Facial Treatment", date: "Feb 15, 2026", status: "Completed", amount: 55 },
    ],
  },
  {
    id: "ct8", name: "Omar Hassan", phone: "+971 50 123 4567", initials: "OH",
    firstContact: "Feb 10, 2026", lastContact: "2 days ago",
    tags: ["Blocked"], totalSpend: 0, bookingCount: 0,
    blocked: true,
    notes: ["Blocked: spam messages"],
    chatHistory: [
      { sender: "customer", text: "Test message", time: "3:00 PM" },
      { sender: "agent", text: "Hi! How can I help you today?", time: "3:00 PM" },
    ],
    bookingHistory: [],
  },
];

// ── Bookings & Orders ──

export interface Booking {
  id: string;
  customer: string;
  service: string;
  staff: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

export interface Order {
  id: string;
  customer: string;
  products: { name: string; qty: number; price: number }[];
  total: number;
  date: string;
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
}

export const mockBookings: Booking[] = [
  { id: "b1", customer: "Sarah Ahmed", service: "Balayage", staff: "Sarah A.", date: "2026-07-27", time: "10:00 AM", status: "upcoming" },
  { id: "b2", customer: "James Wilson", service: "Men's Haircut", staff: "Ali K.", date: "2026-07-27", time: "11:30 AM", status: "upcoming" },
  { id: "b3", customer: "Maria Garcia", service: "Manicure & Pedicure", staff: "Priya P.", date: "2026-07-27", time: "2:00 PM", status: "upcoming" },
  { id: "b4", customer: "Ali Khan", service: "Cut & Style", staff: "Ali K.", date: "2026-07-28", time: "3:30 PM", status: "upcoming" },
  { id: "b5", customer: "Priya Patel", service: "Facial Treatment", staff: "Maria G.", date: "2026-07-28", time: "10:00 AM", status: "upcoming" },
  { id: "b6", customer: "David Chen", service: "Balayage + Manicure", staff: "Sarah A.", date: "2026-07-29", time: "10:00 AM", status: "upcoming" },
  { id: "b7", customer: "Emma Thompson", service: "Hair Coloring", staff: "Sarah A.", date: "2026-07-25", time: "11:00 AM", status: "completed" },
  { id: "b8", customer: "Ali Khan", service: "Beard Trim", staff: "Ali K.", date: "2026-07-24", time: "3:30 PM", status: "completed" },
  { id: "b9", customer: "Sarah Ahmed", service: "Manicure & Pedicure", staff: "Priya P.", date: "2026-07-22", time: "2:00 PM", status: "completed" },
  { id: "b10", customer: "James Wilson", service: "Men's Haircut", staff: "Ali K.", date: "2026-07-20", time: "11:30 AM", status: "cancelled" },
  { id: "b11", customer: "David Chen", service: "Facial Treatment", staff: "Maria G.", date: "2026-07-21", time: "10:00 AM", status: "cancelled" },
];

export const mockOrders: Order[] = [
  { id: "o1", customer: "Sarah Ahmed", products: [{ name: "Vitamin C Serum", qty: 2, price: 34 }, { name: "Keratin Shampoo", qty: 1, price: 18 }], total: 86, date: "2026-07-27", status: "pending" },
  { id: "o2", customer: "James Wilson", products: [{ name: "Matte Clay Pomade", qty: 3, price: 14 }], total: 42, date: "2026-07-27", status: "confirmed" },
  { id: "o3", customer: "David Chen", products: [{ name: "Vitamin C Serum", qty: 4, price: 34 }, { name: "Coconut Oil Mask", qty: 2, price: 28 }], total: 192, date: "2026-07-26", status: "fulfilled" },
  { id: "o4", customer: "Emma Thompson", products: [{ name: "Nail Polish Set", qty: 2, price: 24 }, { name: "Keratin Shampoo", qty: 2, price: 18 }], total: 84, date: "2026-07-25", status: "fulfilled" },
  { id: "o5", customer: "Maria Garcia", products: [{ name: "Coconut Oil Mask", qty: 1, price: 28 }], total: 28, date: "2026-07-25", status: "cancelled" },
  { id: "o6", customer: "Priya Patel", products: [{ name: "Matte Clay Pomade", qty: 1, price: 14 }, { name: "Vitamin C Serum", qty: 1, price: 34 }], total: 48, date: "2026-07-24", status: "confirmed" },
];

// ── Broadcasts ──

export interface Broadcast {
  id: string;
  message: string;
  template: string | null;
  audience: string;
  audienceSize: number;
  sentAt: string;
  delivered: number;
  read: number;
  status: "sent" | "scheduled" | "draft";
}

export const mockTemplates = [
  { id: "t1", name: "Appointment Reminder", body: "Hi {customer_name}, this is a reminder for your {service} appointment on {date} at {time}. See you soon!" },
  { id: "t2", name: "Promo Offer", body: "Hey {customer_name}! 🎉 We're running a special offer this week: {offer}. Reply STOP to opt out." },
  { id: "t3", name: "Order Update", body: "Hi {customer_name}, your order #{order_id} has been {status}. Track it here: {link}" },
  { id: "t4", name: "Welcome Message", body: "Welcome to {business_name}, {customer_name}! Thanks for connecting. How can we help you today?" },
  { id: "t5", name: "Follow-up", body: "Hi {customer_name}, thanks for visiting us recently! How was your experience? We'd love your feedback." },
];

export const mockBroadcasts: Broadcast[] = [
  { id: "bc1", message: "Happy New Year from Bloom Studio! 🎉 Enjoy 15% off all balayage services this January. Book now via WhatsApp!", template: "Promo Offer", audience: "All contacts", audienceSize: 142, sentAt: "2026-01-02T10:00:00", delivered: 138, read: 95, status: "sent" },
  { id: "bc2", message: "Valentine's Day special: Book any couples package and get a complimentary glass of prosecco! 💕 Limited slots available.", template: "Promo Offer", audience: "VIP", audienceSize: 18, sentAt: "2026-02-10T09:30:00", delivered: 18, read: 16, status: "sent" },
  { id: "bc3", message: "Hi there! Just a friendly reminder that your appointment is tomorrow at 10 AM. See you at Bloom Studio!", template: "Appointment Reminder", audience: "All contacts", audienceSize: 24, sentAt: "2026-03-15T16:00:00", delivered: 24, read: 22, status: "sent" },
  { id: "bc4", message: "We've got new spring hair colors in stock! Come check out our latest collection. Reply to book your spot.", template: "Promo Offer", audience: "Regular", audienceSize: 56, sentAt: "2026-04-01T11:00:00", delivered: 54, read: 41, status: "sent" },
  { id: "bc5", message: "Mother's Day is coming! Treat your mum to a pampering session. 10% off all facials and manicures. Book now!", template: "Promo Offer", audience: "All contacts", audienceSize: 142, sentAt: "2026-05-01T10:00:00", delivered: 135, read: 88, status: "sent" },
  { id: "bc6", message: "Summer sale starts now! 🌞 Get 20% off keratin treatments. Limited slots — reply BOOK to reserve yours.", template: "Promo Offer", audience: "All contacts", audienceSize: 148, sentAt: "2026-06-15T09:00:00", delivered: 144, read: 102, status: "sent" },
  { id: "bc7", message: "Hey {customer_name}! We'd love to see you again. Here's a 10% discount on your next visit. Just show this message.", template: "Follow-up", audience: "New", audienceSize: 12, sentAt: "2026-07-20T14:00:00", delivered: 11, read: 7, status: "sent" },
  { id: "bc8", message: "Exclusive VIP evening this Friday! Free mini-facials, drinks, and 25% off all products. You're on the list ✨", template: "Promo Offer", audience: "VIP", audienceSize: 18, sentAt: "2026-07-28T17:00:00", delivered: 0, read: 0, status: "scheduled" },
];

// ── Billing & Account ──

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}

export const mockInvoices: Invoice[] = [
  { id: "inv-2026-07", date: "2026-07-01", amount: 49, status: "paid", description: "Pro plan — July 2026" },
  { id: "inv-2026-06", date: "2026-06-01", amount: 49, status: "paid", description: "Pro plan — June 2026" },
  { id: "inv-2026-05", date: "2026-05-01", amount: 49, status: "paid", description: "Pro plan — May 2026" },
  { id: "inv-2026-04", date: "2026-04-01", amount: 29, status: "paid", description: "Starter plan — April 2026" },
  { id: "inv-2026-03", date: "2026-03-01", amount: 29, status: "paid", description: "Starter plan — March 2026" },
  { id: "inv-2026-02", date: "2026-02-01", amount: 29, status: "paid", description: "Starter plan — February 2026" },
];
