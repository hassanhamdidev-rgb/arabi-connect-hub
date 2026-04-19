export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "message" | "article" | "user" | "system";
  date: string;
  read: boolean;
}

export const initialNotifications: AppNotification[] = [
  { id: "1", title: "رسالة جديدة", body: "سعد الغامدي أرسل استفسارًا عن قضية تجارية", type: "message", date: "منذ 5 دقائق", read: false },
  { id: "2", title: "مقال نُشر", body: "تم نشر مقال «التحكيم التجاري كبديل للتقاضي»", type: "article", date: "منذ ساعة", read: false },
  { id: "3", title: "مستخدم جديد", body: "انضم نورة القحطاني إلى الموقع", type: "user", date: "منذ 3 ساعات", read: false },
  { id: "4", title: "تحديث النظام", body: "تم تحديث صلاحيات المسؤول بنجاح", type: "system", date: "أمس", read: true },
  { id: "5", title: "رسالة جديدة", body: "ريم العنزي طلبت موعد استشارة", type: "message", date: "أمس", read: true },
];
