export type BusinessType = "service" | "product";

export interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

export interface ServiceItem {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export interface ProductItem {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  category: string;
}

export interface EscalationTrigger {
  triggerType: string;
  customPhrase: string;
  isEnabled: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface DocumentItem {
  sourceType: "upload" | "paste";
  rawText: string;
}

export interface OnboardingData {
  businessType: BusinessType | null;
  whatsappConnected: boolean;
  description: string;
  industry: string;
  timezone: string;
  currency: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  address: string;
  socialLinks: Record<string, string>;
  hours: Record<number, DaySchedule>;
  agentDisplayName: string;
  tone: string;
  greetingMessage: string;
  signoffMessage: string;
  useEmoji: boolean;
  responseLength: string;
  fallbackMessage: string;
  bannedTerms: string[];
  services: ServiceItem[];
  products: ProductItem[];
  cancellationPolicy: string;
  refundPolicy: string;
  escalationTriggers: EscalationTrigger[];
  escalationNotifyTarget: string;
  faqs: FaqItem[];
  documents: DocumentItem[];
}

export const defaultOnboardingData: OnboardingData = {
  businessType: null,
  whatsappConnected: false,
  description: "",
  industry: "",
  timezone: "UTC+00:00 London",
  currency: "USD",
  supportEmail: "",
  supportPhone: "",
  websiteUrl: "",
  address: "",
  socialLinks: {},
  hours: {
    0: { open: "09:00", close: "17:00", closed: true },
    1: { open: "09:00", close: "18:00", closed: false },
    2: { open: "09:00", close: "18:00", closed: false },
    3: { open: "09:00", close: "18:00", closed: false },
    4: { open: "09:00", close: "18:00", closed: false },
    5: { open: "09:00", close: "18:00", closed: false },
    6: { open: "10:00", close: "16:00", closed: false },
  },
  agentDisplayName: "Assistant",
  tone: "friendly",
  greetingMessage: "Hi! Welcome to {business_name}. How can I help you today?",
  signoffMessage: "Thanks for reaching out! Have a great day.",
  useEmoji: false,
  responseLength: "concise",
  fallbackMessage:
    "I'm not sure about that, but I can connect you with someone who can help. One moment!",
  bannedTerms: [],
  services: [],
  products: [],
  cancellationPolicy:
    "Customers may cancel or reschedule up to 24 hours before their appointment at no charge.",
  refundPolicy:
    "Full refund within 7 days of purchase with receipt. Store credit within 14 days.",
  escalationTriggers: [
    { triggerType: "refund_request", customPhrase: "", isEnabled: true },
    { triggerType: "angry_customer", customPhrase: "", isEnabled: true },
    { triggerType: "cant_answer", customPhrase: "", isEnabled: true },
    { triggerType: "asks_for_human", customPhrase: "", isEnabled: false },
  ],
  escalationNotifyTarget: "",
  faqs: [],
  documents: [],
};

export const stepLabels = [
  "Business type",
  "WhatsApp",
  "Profile",
  "Persona",
  "Offerings",
  "Policies",
  "Knowledge base",
  "Review",
] as const;
