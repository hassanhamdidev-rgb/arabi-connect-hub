import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { FileText, Shield, Save } from "lucide-react";
import { toast } from "sonner";

const defaultTerms = `1. القبول بالشروط
باستخدامك لهذا الموقع فإنك توافق على الالتزام بشروط الاستخدام التالية.

2. الخدمات القانونية
نقدم استشارات قانونية وفقًا للأنظمة المعمول بها في المملكة العربية السعودية.

3. السرية
نلتزم بالحفاظ على سرية معلومات العملاء وعدم الإفصاح عنها لأي طرف ثالث.`;

const defaultPolicy = `1. جمع المعلومات
نجمع المعلومات التي تقدمها طوعًا عبر نماذج التواصل والتسجيل.

2. استخدام البيانات
تستخدم بياناتك لتقديم الخدمات والتواصل معك بخصوص استفساراتك.

3. حماية البيانات
نطبق إجراءات أمنية صارمة لحماية بياناتك الشخصية.`;

const TermsPage = () => {
  const [terms, setTerms] = useState(defaultTerms);
  const [policy, setPolicy] = useState(defaultPolicy);
  const [termsActive, setTermsActive] = useState(true);
  const [policyActive, setPolicyActive] = useState(true);

  const save = (label: string) => toast.success(`تم حفظ ${label} بنجاح`);

  return (
    <DashboardLayout title="الشروط وسياسة الخصوصية" description="تحكم بمحتوى الشروط والسياسات الظاهرة في الموقع">
      <Tabs defaultValue="terms" className="w-full">
        <TabsList>
          <TabsTrigger value="terms" className="gap-2"><FileText className="h-4 w-4" /> شروط الاستخدام</TabsTrigger>
          <TabsTrigger value="policy" className="gap-2"><Shield className="h-4 w-4" /> سياسة الخصوصية</TabsTrigger>
        </TabsList>

        <TabsContent value="terms">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg">تحرير شروط الاستخدام</CardTitle>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={termsActive} onCheckedChange={setTermsActive} />
                {termsActive ? "ظاهر للزوار" : "مخفي"}
              </label>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">المحتوى</Label>
                <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} rows={14} className="font-body leading-loose" />
              </div>
              <Button onClick={() => save("شروط الاستخدام")} className="gap-2">
                <Save className="h-4 w-4" /> حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg">تحرير سياسة الخصوصية</CardTitle>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={policyActive} onCheckedChange={setPolicyActive} />
                {policyActive ? "ظاهرة للزوار" : "مخفية"}
              </label>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">المحتوى</Label>
                <Textarea value={policy} onChange={(e) => setPolicy(e.target.value)} rows={14} className="font-body leading-loose" />
              </div>
              <Button onClick={() => save("سياسة الخصوصية")} className="gap-2">
                <Save className="h-4 w-4" /> حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TermsPage;
