import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Volume2, Bell, Mail, MessageSquare, Save } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [notifSound, setNotifSound] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [msgNotif, setMsgNotif] = useState(true);

  const save = () => toast.success("تم حفظ الإعدادات");

  const Row = ({
    icon: Icon,
    title,
    desc,
    value,
    onChange,
  }: { icon: typeof Bell; title: string; desc: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  return (
    <DashboardLayout title="الإعدادات" description="إعدادات الإشعارات والتفضيلات العامة">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> إعدادات الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            desc="تنبيهي فورًا عند وصول رسالة جديدة من العملاء"
            value={msgNotif}
            onChange={setMsgNotif}
          />
          <div className="pt-4">
            <Button onClick={save} className="gap-2">
              <Save className="h-4 w-4" /> حفظ الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SettingsPage;
