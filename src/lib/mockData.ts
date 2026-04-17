// Mock data for dashboard preview (no backend)

export interface Article {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft";
  views: number;
  date: string;
  author: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  active: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "blocked";
  joined: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  date: string;
}

export const mockArticles: Article[] = [
  { id: "1", title: "حقوقك القانونية عند الفصل التعسفي", category: "قضايا العمل", status: "published", views: 1240, date: "15 أبريل 2026", author: "خالد المجنوني" },
  { id: "2", title: "كيف تحمي حقوقك في العقود التجارية", category: "القضايا التجارية", status: "published", views: 890, date: "10 أبريل 2026", author: "خالد المجنوني" },
  { id: "3", title: "إجراءات رفع الدعوى في المحاكم السعودية", category: "إجراءات قانونية", status: "published", views: 654, date: "5 أبريل 2026", author: "خالد المجنوني" },
  { id: "4", title: "حقوق المرأة في نظام الأحوال الشخصية", category: "أحوال شخصية", status: "draft", views: 0, date: "1 أبريل 2026", author: "خالد المجنوني" },
  { id: "5", title: "التحكيم التجاري كبديل للتقاضي", category: "تحكيم", status: "published", views: 432, date: "28 مارس 2026", author: "خالد المجنوني" },
  { id: "6", title: "حماية الملكية الفكرية في السعودية", category: "ملكية فكرية", status: "draft", views: 0, date: "25 مارس 2026", author: "خالد المجنوني" },
];

export const mockServices: Service[] = [
  { id: "1", title: "القضايا التجارية", description: "تمثيل الشركات في النزاعات التجارية", icon: "Briefcase", active: true },
  { id: "2", title: "قضايا العمل", description: "الدفاع عن حقوق العمال وأصحاب العمل", icon: "Users", active: true },
  { id: "3", title: "الأحوال الشخصية", description: "قضايا الزواج والطلاق والحضانة", icon: "Heart", active: true },
  { id: "4", title: "التحكيم التجاري", description: "حلول بديلة للنزاعات التجارية", icon: "Scale", active: true },
  { id: "5", title: "الاستشارات القانونية", description: "استشارات شاملة لجميع المجالات", icon: "MessageSquare", active: false },
];

export const mockFAQ: FAQItem[] = [
  { id: "1", question: "ما هي خدماتكم القانونية؟", answer: "نقدم مجموعة شاملة من الخدمات القانونية تشمل القضايا التجارية والعمالية والأحوال الشخصية.", order: 1 },
  { id: "2", question: "كيف يمكنني حجز استشارة؟", answer: "يمكنكم حجز استشارة عبر صفحة التواصل أو الاتصال بنا مباشرة.", order: 2 },
  { id: "3", question: "ما هي تكلفة الاستشارة؟", answer: "تختلف التكلفة حسب نوع القضية وتعقيدها. يرجى التواصل معنا للحصول على عرض سعر.", order: 3 },
  { id: "4", question: "هل تقدمون خدمات التحكيم؟", answer: "نعم، نقدم خدمات التحكيم التجاري كبديل عن التقاضي التقليدي.", order: 4 },
];

export const mockUsers: AppUser[] = [
  { id: "1", name: "خالد المجنوني", email: "khalid@example.com", role: "admin", status: "active", joined: "1 يناير 2026" },
  { id: "2", name: "أحمد السالم", email: "ahmed@example.com", role: "user", status: "active", joined: "15 فبراير 2026" },
  { id: "3", name: "فاطمة الزهراني", email: "fatima@example.com", role: "user", status: "active", joined: "20 فبراير 2026" },
  { id: "4", name: "محمد العتيبي", email: "mohamed@example.com", role: "user", status: "blocked", joined: "10 مارس 2026" },
  { id: "5", name: "نورة القحطاني", email: "noura@example.com", role: "user", status: "active", joined: "25 مارس 2026" },
];

export const mockMessages: Message[] = [
  { id: "1", name: "سعد الغامدي", email: "saad@example.com", subject: "استفسار عن قضية تجارية", body: "السلام عليكم، أحتاج استشارة بخصوص نزاع تجاري مع أحد الموردين...", read: false, date: "منذ ساعتين" },
  { id: "2", name: "ريم العنزي", email: "reem@example.com", subject: "طلب موعد استشارة", body: "أرغب في حجز موعد استشارة قانونية في قضية أحوال شخصية.", read: false, date: "منذ 5 ساعات" },
  { id: "3", name: "عبدالله الشمري", email: "abdullah@example.com", subject: "استشارة عمالية", body: "تم فصلي من العمل بشكل مفاجئ وأريد معرفة حقوقي.", read: true, date: "أمس" },
  { id: "4", name: "هند المالكي", email: "hind@example.com", subject: "شكر وتقدير", body: "أشكركم على الخدمة الممتازة في قضيتي الأخيرة.", read: true, date: "منذ 3 أيام" },
];
