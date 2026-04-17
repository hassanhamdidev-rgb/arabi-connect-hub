import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save, Lock } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("تم حفظ التغييرات");
  };

  return (
    <DashboardLayout title="الملف الشخصي" description="إدارة بيانات حسابك">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-28 w-28">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">خم</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 left-0 h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md hover:bg-accent/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="font-heading font-bold text-lg">خالد عويد المجنوني</h2>
            <p className="text-sm text-muted-foreground mb-4">المسؤول الرئيسي</p>
            <div className="w-full pt-4 border-t border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المقالات</span>
                <span className="font-medium">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الردود</span>
                <span className="font-medium">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">منذ</span>
                <span className="font-medium">يناير 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">المعلومات الشخصية</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input id="name" defaultValue="خالد عويد المجنوني" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" defaultValue="khalid@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input id="phone" defaultValue="+966 5X XXX XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">المسمى الوظيفي</Label>
                    <Input id="title" defaultValue="محامي ومستشار قانوني" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">نبذة تعريفية</Label>
                  <Textarea id="bio" rows={4} defaultValue="محامي ومستشار قانوني متخصص في القضايا التجارية والعمالية والأحوال الشخصية بخبرة تتجاوز 15 عاماً." />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" /> حفظ التغييرات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-4 w-4" /> تغيير كلمة المرور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">كلمة المرور الحالية</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new">كلمة المرور الجديدة</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
                    <Input id="confirm" type="password" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="outline">تحديث كلمة المرور</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
