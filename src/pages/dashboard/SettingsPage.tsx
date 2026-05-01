import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Volume2, Bell, Mail, MessageSquare, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMe, useUpdateMe } from "@/hooks/useProfile";

const SettingsPage = () => {
  const { data: me } = useMe();
  const updateMe = useUpdateMe();

  const [notifSound, setNotifSound] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [msgNotif, setMsgNotif] = useState(true);

  useEffect(() => {
    if (me) setEmailNotif(me.email_notifications ?? true);
    try {
      const raw = localStorage.getItem("almajnouni_prefs");
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.notifSound === "boolean") setNotifSound(p.notifSound);
        if (typeof p.pushNotif === "boolean") setPushNotif(p.pushNotif);
        if (typeof p.msgNotif === "boolean") setMsgNotif(p.msgNotif);
      }
    } catch {
      /* ignore */
    }
  }, [me]);

  const save = async () => {
    try {
      await updateMe.mutateAsync({ email_notifications: emailNotif });
      localStorage.setItem(
        "almajnouni_prefs",
        JSON.stringify({ notifSound, pushNotif, msgNotif })
      );
      toast.success("تم حفظ الإعدادات");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر الحفظ");
    }
  };

  const Row = ({
    icon: Icon,
    title,
    desc,
    value,
    onChange,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    desc: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background hover:bg-muted/30 transition p-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  return (
    <DashboardLayout title="الإعدادات" description="إعدادات الإشعارات والتفضيلات العامة">
      <Card className="max-w-3xl border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent border-b border-border">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Bell className="h-4 w-4" />
            </span>
            إعدادات الإشعارات
          </CardTitle>
          <CardDescription>تحكم بكيفية تلقّيك للتنبيهات والرسائل</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <Row
            icon={Volume2}
            title="صوت الإشعارات"
            desc="تشغيل أو إيقاف صوت التنبيه عند وصول إشعار جديد"
            value={notifSound}
            onChange={setNotifSound}
          />
          <Row
            icon={Bell}
            title="الإشعارات الفورية"
            desc="تلقي الإشعارات الفورية في المتصفح"
            value={pushNotif}
            onChange={setPushNotif}
          />
          <Row
            icon={Mail}
            title="إشعارات البريد الإلكتروني"
            desc="إرسال نسخة من الإشعارات إلى بريدك"
            value={emailNotif}
            onChange={setEmailNotif}
          />
          <Row
            icon={MessageSquare}
            title="إشعارات الرسائل الواردة"
            desc="تنبيهي فوراً عند وصول رسالة جديدة من العملاء"
            value={msgNotif}
            onChange={setMsgNotif}
          />
          <div className="pt-4 flex justify-end">
            <Button onClick={save} disabled={updateMe.isPending} className="gap-2 h-11 min-w-32">
              {updateMe.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              حفظ الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SettingsPage;
