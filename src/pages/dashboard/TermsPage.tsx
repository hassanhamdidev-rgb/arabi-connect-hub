import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Shield, Save, Loader2 } from "lucide-react";
import { useTerms, useSaveTerms } from "@/hooks/useDirectus";
import { toast } from "sonner";

const TermsPage = () => {
  const { data, isLoading } = useTerms();
  const saveMut = useSaveTerms();

  const [terms, setTerms] = useState("");
  const [policy, setPolicy] = useState("");

  useEffect(() => {
    if (data) {
      setTerms(data.terms ?? "");
      setPolicy(data.policy ?? "");
    }
  }, [data]);

  const save = async (which: "terms" | "policy") => {
    try {
      await saveMut.mutateAsync(
        which === "terms" ? { terms } : { policy }
      );
      toast.success(`تم حفظ ${which === "terms" ? "شروط الاستخدام" : "سياسة الخصوصية"} بنجاح`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحفظ");
    }
  };

  return (
    <DashboardLayout
      title="الشروط وسياسة الخصوصية"
      description="تحكم بمحتوى الشروط والسياسات الظاهرة في الموقع"
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="terms" className="w-full">
          <TabsList>
            <TabsTrigger value="terms" className="gap-2">
              <FileText className="h-4 w-4" /> شروط الاستخدام
            </TabsTrigger>
            <TabsTrigger value="policy" className="gap-2">
              <Shield className="h-4 w-4" /> سياسة الخصوصية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تحرير شروط الاستخدام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">المحتوى</Label>
                  <Textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    rows={14}
                    className="font-body leading-loose"
                  />
                </div>
                <Button onClick={() => save("terms")} disabled={saveMut.isPending} className="gap-2">
                  {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policy">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تحرير سياسة الخصوصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">المحتوى</Label>
                  <Textarea
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                    rows={14}
                    className="font-body leading-loose"
                  />
                </div>
                <Button onClick={() => save("policy")} disabled={saveMut.isPending} className="gap-2">
                  {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default TermsPage;
