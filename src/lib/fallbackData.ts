/**
 * Fallback data used when the Directus API is unavailable
 * or for static dropdown options across the app.
 */

import {
  Briefcase,
  Users,
  Heart,
  Scale,
  MessageSquare,
  HelpCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Globe,
  ShieldCheck,
  Gavel,
  BookOpen,
  Building2,
  Landmark,
  Award,
  Clock,
  Star,
  Newspaper,
  Send,
  type LucideIcon,
  Upload,
} from "lucide-react";

/* -------------------------- Contact / Office info ------------------------- */

export const FALLBACK_CONTACT = {
  phone: "0555518556",
  whatsapp: "0555518556",
  email: "support@lawkhalid.com",
  address: "الرياض، المملكة العربية السعودية",
  workingHours: "الأحد - الخميس: 9:00 ص - 5:00 م",
};

export const FALLBACK_SOCIAL_LINKS = [
  { id: "fb",  name: "Facebook",  url: "#", icon: "facebook_square" },
  { id: "tw",  name: "Twitter",   url: "#", icon: "x_twitter" },
  { id: "wa",  name: "WhatsApp",  url: "#", icon: "whatsapp" },
  { id: "li",  name: "LinkedIn",  url: "#", icon: "linkedin" },
  { id: "ig",  name: "Instagram", url: "#", icon: "instagram" },
  { id: "yt",  name: "YouTube",   url: "#", icon: "youtube" },
  { id: "tg",  name: "Telegram",  url: "#", icon: "telegram" },
  { id: "sc",  name: "Snapchat",  url: "#", icon: "snapchat" },
  { id: "tt",  name: "TikTok",    url: "#", icon: "tiktok" },
];

/* ------------------- Contact page categories (dropdown) ------------------- */

export const FALLBACK_CONTACT_CATEGORIES = [
  { id: 1, name: "استشارة قانونية" },
  { id: 2, name: "قضايا تجارية" },
  { id: 3, name: "قضايا عمالية" },
  { id: 4, name: "أحوال شخصية" },
  { id: 5, name: "تحكيم" },
  { id: 6, name: "ملكية فكرية" },
  { id: 7, name: "استفسار عام" },
];

/* --------------------------- Form dropdown options ------------------------ */

export const READING_TIME_OPTIONS = [
  { value: 5,  labelAr: "5 دقائق" },
  { value: 10, labelAr: "10 دقائق" },
  { value: 15, labelAr: "15 دقيقة" },
  { value: 20, labelAr: "20 دقيقة" },
  { value: 30, labelAr: "30 دقيقة" },
  { value: 45, labelAr: "45 دقيقة" },
  { value: 60, labelAr: "ساعة" },
  { value: 90, labelAr: "ساعة ونصف" },
];

export const SERVICE_TYPE_OPTIONS = [
  { value: "individual", labelAr: "خدمة فردية" },
  { value: "business",   labelAr: "خدمة شركات" },
  { value: "general",    labelAr: "عامة" },
  { value: "consultation", labelAr: "استشارة" },
];

export const SERVICE_DURATION_OPTIONS = [
  { value: "30 دقيقة", labelAr: "30 دقيقة" },
  { value: "ساعة",     labelAr: "ساعة" },
  { value: "ساعتان",   labelAr: "ساعتان" },
  { value: "نصف يوم",  labelAr: "نصف يوم" },
  { value: "يوم كامل", labelAr: "يوم كامل" },
  { value: "أسبوع",    labelAr: "أسبوع" },
  { value: "حسب القضية", labelAr: "حسب القضية" },
];

export const FAQ_CATEGORY_OPTIONS = [
  { value: "عام", labelAr: "عام" },
  { value: "خدمات", labelAr: "خدمات" },
  { value: "أتعاب", labelAr: "الأتعاب والتكاليف" },
  { value: "إجراءات", labelAr: "إجراءات قانونية" },
  { value: "استشارات", labelAr: "استشارات" },
  { value: "قضايا", labelAr: "قضايا" },
];

export const STATUS_OPTIONS = [
  { value: "draft", labelAr: "مسودة" },
  { value: "published", labelAr: "منشور" },
];

/* ------------------------------ Icon library ------------------------------ */
/** Lucide icons available for selection in admin forms (services / faq) */
export const ICON_OPTIONS: { value: string; labelAr: string; Icon: LucideIcon }[] = [
  { value: "Briefcase",      labelAr: "حقيبة", Icon: Briefcase },
  { value: "Scale",          labelAr: "ميزان العدالة", Icon: Scale },
  { value: "Gavel",          labelAr: "مطرقة قضائية", Icon: Gavel },
  { value: "Users",          labelAr: "أشخاص", Icon: Users },
  { value: "Heart",          labelAr: "قلب", Icon: Heart },
  { value: "MessageSquare",  labelAr: "رسالة", Icon: MessageSquare },
  { value: "HelpCircle",     labelAr: "مساعدة", Icon: HelpCircle },
  { value: "FileText",       labelAr: "مستند", Icon: FileText },
  { value: "BookOpen",       labelAr: "كتاب", Icon: BookOpen },
  { value: "Building2",      labelAr: "مبنى", Icon: Building2 },
  { value: "Landmark",       labelAr: "محكمة", Icon: Landmark },
  { value: "ShieldCheck",    labelAr: "حماية", Icon: ShieldCheck },
  { value: "Award",          labelAr: "جائزة", Icon: Award },
  { value: "Clock",          labelAr: "ساعة", Icon: Clock },
  { value: "Star",           labelAr: "نجمة", Icon: Star },
  { value: "Newspaper",      labelAr: "صحيفة", Icon: Newspaper },
  { value: "Phone",          labelAr: "هاتف", Icon: Phone },
  { value: "Mail",           labelAr: "بريد", Icon: Mail },
  { value: "MapPin",         labelAr: "موقع", Icon: MapPin },
  { value: "Globe",          labelAr: "عالم", Icon: Globe },
  { value: "Send",           labelAr: "إرسال", Icon: Send },
  { value: "Upload",         labelAr: "رفع ملف", Icon: Upload },
  { value: "Other",          labelAr: "أخرى", Icon: Briefcase },
  { value: "None",           labelAr: "بدون أيقونة", Icon: null },


  
];

/** Social platform icons (for /dashboard/links) */
export const SOCIAL_ICON_OPTIONS = [
  { value: "facebook_square", labelAr: "Facebook" },
  { value: "x_twitter",       labelAr: "X (Twitter)" },
  { value: "whatsapp",        labelAr: "WhatsApp" },
  { value: "linkedin",        labelAr: "LinkedIn" },
  { value: "instagram",       labelAr: "Instagram" },
  { value: "youtube",         labelAr: "YouTube" },
  { value: "telegram",        labelAr: "Telegram" },
  { value: "snapchat",        labelAr: "Snapchat" },
  { value: "tiktok",          labelAr: "TikTok" },
  { value: "Other",            labelAr: "أخرى" },

  
];

/** Lookup helper for icon components by name */
export function getIconByName(name?: string | null): LucideIcon {
  const found = ICON_OPTIONS.find((i) => i.value === name);
  return found?.Icon ?? Briefcase;
}
