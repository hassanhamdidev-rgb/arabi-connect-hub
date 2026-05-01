import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Save,
  Lock,
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  BellRing,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useMe, useUpdateMe, useUpdatePassword, uploadAvatar } from "@/hooks/useProfile";
import { assetUrl } from "@/lib/directus";

const ProfilePage = () => {
  const { data: me, isLoading } = useMe();
  const updateMe = useUpdateMe();
  const updatePass = useUpdatePassword();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    title: "",
    description: "",
    gender: "" as "" | "male" | "female",
    email_notifications: true,
  });

  useEffect(() => {
    if (me) {
      setForm({
        first_name: me.first_name ?? "",
        last_name: me.last_name ?? "",
        email: me.email ?? "",
        phone: me.phone ?? "",
        title: me.title ?? "",
        description: me.description ?? "",
        gender: (me.gender as "male" | "female" | "") ?? "",
        email_notifications: me.email_notifications ?? true,
      });
    }
  }, [me]);

  const fullName =
    [form.first_name, form.last_name].filter(Boolean).join(" ") || me?.email || "—";
  const initials = (form.first_name?.[0] ?? "") + (form.last_name?.[0] ?? "") || "U";
  const avatarSrc = me?.avatar ? assetUrl(me.avatar, { width: 240, height: 240, fit: "cover" }) : undefined;

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateMe.mutateAsync({
        first_name: form.first_name.trim() || null,
        last_name: form.last_name.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        gender: form.gender || null,
        email_notifications: form.email_notifications,
      });
      toast.success("تم حفظ التغييرات");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    }
  };

  const handlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = String(fd.get("new") ?? "");
    const confirm = String(fd.get("confirm") ?? "");
    if (next.length < 8) return toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    if (next !== confirm) return toast.error("كلمتا المرور غير متطابقتين");
    try {
      await updatePass.mutateAsync({ password: next });
      (e.target as HTMLFormElement).reset();
      toast.success("تم تحديث كلمة المرور");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر التحديث");
    }
  };

  const handleAvatarPick = async (file: File) => {
    if (file.size > 3 * 1024 * 1024) return toast.error("الحد الأقصى 3MB");
    try {
      setUploading(true);
      const id = await uploadAvatar(file);
      await updateMe.mutateAsync({ avatar: id });
      toast.success("تم تحديث الصورة");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر التحديث");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout title="الملف الشخصي" description="إدارة بيانات حسابك ومعلوماتك">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar / identity */}
        <Card className="lg:col-span-1 overflow-hidden border-border/60 shadow-sm">
          <div className="h-28 bg-gradient-to-br from-primary/90 via-primary to-accent" />
          <CardContent className="pt-0 -mt-14 flex flex-col items-center text-center pb-6">
            <div className="relative mb-4">
              <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg">
                {avatarSrc && <AvatarImage src={avatarSrc} alt={fullName} />}
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold uppercase">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 left-0 h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md hover:bg-accent/90 transition disabled:opacity-60"
                aria-label="تغيير الصورة"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleAvatarPick(f);
                  e.currentTarget.value = "";
                }}
              />
            </div>

            {isLoading ? (
              <Skeleton className="h-5 w-40 mb-2" />
            ) : (
              <h2 className="font-heading font-bold text-lg">{fullName}</h2>
            )}
            <p className="text-sm text-muted-foreground">{form.title || me?.role || "—"}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {me?.role && (
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {me.role}
                </Badge>
              )}
              {me?.provider && (
                <Badge variant="outline" className="gap-1 capitalize">
                  <Sparkles className="h-3 w-3" />
                  {me.provider}
                </Badge>
              )}
            </div>

            <div className="w-full mt-6 pt-4 border-t border-border space-y-3 text-sm text-right">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{me?.email ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span dir="ltr" className="truncate">{me?.phone ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 shrink-0" />
                <span className="truncate">{me?.title ?? "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/60 bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                المعلومات الشخصية
              </CardTitle>
              <CardDescription>تحديث الاسم وبيانات التواصل والمسمى الوظيفي</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="الاسم الأول" htmlFor="first_name">
                    <Input
                      id="first_name"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      placeholder="مثلاً: خالد"
                      className="h-11"
                    />
                  </Field>
                  <Field label="اسم العائلة" htmlFor="last_name">
                    <Input
                      id="last_name"
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      placeholder="مثلاً: المجنوني"
                      className="h-11"
                    />
                  </Field>
                  <Field label="البريد الإلكتروني" htmlFor="email" icon={Mail}>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-11 pr-10"
                      dir="ltr"
                    />
                  </Field>
                  <Field label="رقم الهاتف" htmlFor="phone" icon={Phone}>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+966 5X XXX XXXX"
                      className="h-11 pr-10"
                      dir="ltr"
                    />
                  </Field>
                  <Field label="المسمى الوظيفي" htmlFor="title" icon={Briefcase}>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="محامي ومستشار قانوني"
                      className="h-11 pr-10"
                    />
                  </Field>
                  <Field label="الجنس" htmlFor="gender">
                    <select
                      id="gender"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as "male" | "female" | "" })}
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">— غير محدد —</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </Field>
                </div>

                <Field label="نبذة تعريفية" htmlFor="description">
                  <Textarea
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="نبذة مختصرة عنك، تخصصك وخبراتك..."
                    className="resize-none"
                  />
                </Field>

                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <BellRing className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm">إشعارات البريد الإلكتروني</div>
                      <div className="text-xs text-muted-foreground">تلقي تنبيهات النشاط على بريدك</div>
                    </div>
                  </div>
                  <Switch
                    checked={form.email_notifications}
                    onCheckedChange={(v) => setForm({ ...form, email_notifications: v })}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={updateMe.isPending} className="gap-2 min-w-32 h-11">
                    {updateMe.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/60 bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                تغيير كلمة المرور
              </CardTitle>
              <CardDescription>اختر كلمة مرور قوية لا تقل عن 8 أحرف</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePassword} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="كلمة المرور الجديدة" htmlFor="new">
                    <Input id="new" name="new" type="password" required className="h-11" />
                  </Field>
                  <Field label="تأكيد كلمة المرور" htmlFor="confirm">
                    <Input id="confirm" name="confirm" type="password" required className="h-11" />
                  </Field>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="outline" disabled={updatePass.isPending} className="gap-2 h-11">
                    {updatePass.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    تحديث كلمة المرور
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Field = ({
  label,
  htmlFor,
  icon: Icon,
  children,
}: {
  label: string;
  htmlFor: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
      {label}
    </Label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      )}
      {children}
    </div>
  </div>
);

export default ProfilePage;
