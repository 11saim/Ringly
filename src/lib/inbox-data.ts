/* ── Types ── */

export interface Customer {
  id: string;
  name: string;
  phone: string;
  initials: string;
  avatar?: string;
  online: boolean;
  tags: string[];
  language: string;
  lifetimeValue: number;
  lastSeen: string;
  purchaseHistory: { item: string; date: string; amount: number }[];
  previousBookings: { service: string; date: string; status: string }[];
}

export interface Conversation {
  id: string;
  customer: Customer;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  channel: "whatsapp";
  handler: "ai" | "human";
  status: "active" | "pending" | "resolved" | "vip";
  hasBooking: boolean;
  assignedTo?: string;
  sentiment: "positive" | "neutral" | "negative";
  intent: string;
  duration: string;
}

export type MessageSender = "customer" | "ai" | "agent";

export interface Message {
  id: string;
  sender: MessageSender;
  senderName?: string;
  text?: string;
  time: string;
  date: string;
  type: "text" | "image" | "voice" | "booking" | "payment" | "location" | "quick-reply" | "typing";
  bookingData?: {
    service: string;
    date: string;
    time: string;
    status: "confirmed" | "pending" | "cancelled";
  };
  paymentData?: {
    amount: string;
    status: "paid" | "pending" | "failed";
    method: string;
  };
  quickReplies?: string[];
  locationData?: {
    name: string;
    address: string;
  };
}

export interface AISuggestion {
  id: string;
  type: "reply" | "action" | "knowledge";
  title: string;
  content: string;
  confidence: number;
  source?: string;
}

export type FilterType = "all" | "unread" | "ai-needs-help" | "bookings" | "orders" | "vip" | "resolved" | "assigned";

/* ── Mock Data ── */

export const conversations: Conversation[] = [
  {
    id: "c1",
    customer: {
      id: "u1", name: "Ahmed Khan", phone: "+971 50 123 4567", initials: "AK", online: true,
      tags: ["VIP", "Regular"], language: "English", lifetimeValue: 2340, lastSeen: "2m ago",
      purchaseHistory: [
        { item: "Balayage", date: "Dec 15", amount: 450 },
        { item: "Men's Haircut", date: "Nov 28", amount: 80 },
      ],
      previousBookings: [
        { service: "Balayage", date: "Dec 15", status: "completed" },
        { service: "Men's Haircut", date: "Nov 28", status: "completed" },
      ],
    },
    lastMessage: "Can I book a balayage for tomorrow?",
    lastMessageTime: "2m", unread: 3, channel: "whatsapp", handler: "ai",
    status: "active", hasBooking: true, assignedTo: "AI Agent",
    sentiment: "neutral", intent: "Booking Request", duration: "4m",
  },
  {
    id: "c2",
    customer: {
      id: "u2", name: "Sofia Martinez", phone: "+971 55 987 6543", initials: "SM", online: true,
      tags: ["VIP"], language: "Spanish", lifetimeValue: 4120, lastSeen: "1m ago",
      purchaseHistory: [
        { item: "Hair Coloring", date: "Dec 10", amount: 380 },
        { item: "Blow Dry", date: "Dec 3", amount: 120 },
      ],
      previousBookings: [
        { service: "Hair Coloring", date: "Dec 10", status: "completed" },
      ],
    },
    lastMessage: "Thank you for the quick response!",
    lastMessageTime: "8m", unread: 0, channel: "whatsapp", handler: "ai",
    status: "resolved", hasBooking: false, assignedTo: "AI Agent",
    sentiment: "positive", intent: "Follow-up", duration: "12m",
  },
  {
    id: "c3",
    customer: {
      id: "u3", name: "Fatima Al-Rashid", phone: "+971 52 456 7890", initials: "FA", online: false,
      tags: ["New"], language: "Arabic", lifetimeValue: 320, lastSeen: "38m ago",
      purchaseHistory: [], previousBookings: [],
    },
    lastMessage: "Do you offer home service?",
    lastMessageTime: "38m", unread: 1, channel: "whatsapp", handler: "ai",
    status: "pending", hasBooking: false, assignedTo: "AI Agent",
    sentiment: "neutral", intent: "Service Inquiry", duration: "2m",
  },
  {
    id: "c4",
    customer: {
      id: "u4", name: "James Lee", phone: "+971 56 321 0987", initials: "JL", online: false,
      tags: [], language: "English", lifetimeValue: 890, lastSeen: "2h ago",
      purchaseHistory: [{ item: "Men's Haircut", date: "Dec 1", amount: 80 }],
      previousBookings: [{ service: "Men's Haircut", date: "Dec 1", status: "completed" }],
    },
    lastMessage: "I need to reschedule my appointment.",
    lastMessageTime: "2h", unread: 0, channel: "whatsapp", handler: "human",
    status: "active", hasBooking: true, assignedTo: "Ali N.",
    sentiment: "negative", intent: "Reschedule", duration: "8m",
  },
  {
    id: "c5",
    customer: {
      id: "u5", name: "Restaurant ABC", phone: "+971 4 234 5678", initials: "RA", online: true,
      tags: ["Business", "VIP"], language: "English", lifetimeValue: 8900, lastSeen: "5m ago",
      purchaseHistory: [{ item: "Bulk Booking (10)", date: "Nov 20", amount: 2400 }],
      previousBookings: [{ service: "Bulk Styling", date: "Nov 20", status: "completed" }],
    },
    lastMessage: "We need to book for our staff event.",
    lastMessageTime: "15m", unread: 2, channel: "whatsapp", handler: "ai",
    status: "active", hasBooking: true, assignedTo: "AI Agent",
    sentiment: "positive", intent: "Bulk Booking", duration: "6m",
  },
  {
    id: "c6",
    customer: {
      id: "u6", name: "Nour Hassan", phone: "+971 50 111 2233", initials: "NH", online: false,
      tags: ["Refund"], language: "English", lifetimeValue: 150, lastSeen: "1h ago",
      purchaseHistory: [{ item: "Haircut", date: "Dec 18", amount: 150 }],
      previousBookings: [],
    },
    lastMessage: "I want a refund for my last visit.",
    lastMessageTime: "1h", unread: 1, channel: "whatsapp", handler: "human",
    status: "pending", hasBooking: false, assignedTo: "Ali N.",
    sentiment: "negative", intent: "Refund Request", duration: "15m",
  },
  {
    id: "c7",
    customer: {
      id: "u7", name: "Layla Mahmoud", phone: "+971 55 444 5566", initials: "LM", online: true,
      tags: ["New"], language: "Arabic", lifetimeValue: 0, lastSeen: "Just now",
      purchaseHistory: [], previousBookings: [],
    },
    lastMessage: "Hi! What are your prices for coloring?",
    lastMessageTime: "1m", unread: 1, channel: "whatsapp", handler: "ai",
    status: "active", hasBooking: false, assignedTo: "AI Agent",
    sentiment: "neutral", intent: "Price Inquiry", duration: "1m",
  },
];

export const activeConversationMessages: Message[] = [
  { id: "m1", sender: "customer", text: "Hi! I want to book a balayage appointment for tomorrow.", time: "10:23 AM", date: "Today", type: "text" },
  { id: "m2", sender: "ai", text: "Hello Ahmed! I'd be happy to help you book a balayage appointment. Let me check availability for tomorrow.", time: "10:23 AM", date: "Today", type: "text" },
  { id: "m3", sender: "ai", text: "Great news! We have availability at 10:00 AM and 2:00 PM tomorrow. Which time works better for you?", time: "10:24 AM", date: "Today", type: "text", quickReplies: ["10:00 AM", "2:00 PM", "Other time"] },
  { id: "m4", sender: "customer", text: "10:00 AM works perfectly!", time: "10:25 AM", date: "Today", type: "text" },
  { id: "m5", sender: "ai", text: "Perfect! I've booked your balayage appointment for tomorrow at 10:00 AM.", time: "10:25 AM", date: "Today", type: "text" },
  { id: "m6", sender: "ai", time: "10:25 AM", date: "Today", type: "booking", bookingData: { service: "Balayage", date: "Tomorrow", time: "10:00 AM", status: "confirmed" } },
  { id: "m7", sender: "ai", text: "You'll receive a confirmation on WhatsApp. Is there anything else you'd like to add?", time: "10:26 AM", date: "Today", type: "text" },
  { id: "m8", sender: "customer", text: "Can I also add a deep conditioning treatment?", time: "10:28 AM", date: "Today", type: "text" },
  { id: "m9", sender: "ai", text: "Absolutely! I've added a deep conditioning treatment. The total will be $480 (Balayage $420 + Deep Conditioning $60). Would you like to proceed?", time: "10:28 AM", date: "Today", type: "text" },
  { id: "m10", sender: "customer", text: "Yes please! Thank you so much.", time: "10:30 AM", date: "Today", type: "text" },
  { id: "m11", sender: "ai", text: "You're all set! Your appointment is confirmed:\n\nBalayage + Deep Conditioning\nTomorrow at 10:00 AM\nTotal: $480\n\nWe'll send you a reminder the night before. See you tomorrow! 💇‍♀️", time: "10:30 AM", date: "Today", type: "text" },
];

export const aiSuggestions: AISuggestion[] = [
  { id: "s1", type: "reply", title: "Suggested Reply", content: "Hi Ahmed! Your appointment is confirmed for tomorrow at 10:00 AM for Balayage + Deep Conditioning. Total: $480. See you there! 💇‍♀️", confidence: 94 },
  { id: "s2", type: "action", title: "Send Appointment Reminder", content: "Send a WhatsApp reminder 24 hours before the appointment", confidence: 88 },
  { id: "s3", type: "knowledge", title: "Aftercare Instructions", content: "Share balayage aftercare guide with the customer", confidence: 82, source: "Knowledge Base: Hair Treatments" },
];

export const recommendedActions = [
  { id: "a1", label: "Book Appointment", icon: "calendar" },
  { id: "a2", label: "Send Payment Link", icon: "credit-card" },
  { id: "a3", label: "Transfer to Human", icon: "user" },
  { id: "a4", label: "Create Order", icon: "package" },
  { id: "a5", label: "Broadcast Later", icon: "send" },
];
