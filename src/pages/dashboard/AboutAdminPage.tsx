import { useState, useEffect } from "react";
import { useAbout, useSaveAbout } from "@/hooks/useDirectus";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Info, Plus, X, Upload, ImageIcon, Trash2 } from "lucide-react";
import { uploadFiles, assetUrl, normalizeFileIds } from "@/lib/directus";

type AboutForm = {
  vision: string;
  mission: string;
  value: string;
  about_office: string;
  experiences: string[];
  services: string[];
  images: string[];
};

const emptyForm: AboutForm = {
  vision: "",
  mission: "",
  value: "",
  about_office: "",
  experiences: [],
  services: [],
  images: [],
};

const AboutAdminPage = () => {
  const { data, isLoading } = useAbout();
  const saveMutation = useSaveAbout();
  const { toast } = useToast();

  const [form, setForm] = useState<AboutForm>(emptyForm);
  const [newExp, setNewExp] = useState("");
  const [newService, setNewService] = useState("");
  const [pendingUploads, setPendingUploads] = useState<File[]>([]);

  useEffect(() => {
    if (data) {
      setForm({
        vision: data.vision ?? "",
        mission: data.mission ?? "",
        value: data.value ?? "",
        about_office: data.about_office ?? "",
        experiences: Array.isArray(data.experiences) ? data.experiences : [],
        services: Array.isArray(data.services) ? data.services : [],
        images: normalizeFileIds(data.images),
      });
    }
  }, [data]);

  const update = <K extends keyof AboutForm>(key: K, value: AboutForm[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const addItem = (key: "experiences" | "services", value: string) => {
    if (!value.trim()) return;
    update(key, [...form[key], value.trim()]);
  };

  const removeItem = (key: "experiences" | "services", idx: number) =>
    update(
      key,
      form[key].filter((_, i) => i !== idx)
    );

  const removeImage = (id: string) =>
    update("images", form.images.filter((i) => i !== id));

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let imageIds = form.images;
      if (pendingUploads.length > 0) {
        const uploaded = await uploadFiles(pendingUploads);
        imageIds = [...imageIds, ...uploaded];
      }
      await saveMutation.mutateAsync({
        vision: form.vision,
        mission: form.mission,
        value: form.value,
        about_office: form.about_office,
        experiences: form.experiences,
        services: form.services,
        images: imageIds,
      });
      setForm((p) => ({ ...p, images: imageIds }));
      setPendingUploads([]);
      toast({ title: "تم حفظ البيانات بنجاح" });
    } catch (err) {
      toast({ title: "خطأ", description: err instanceof Error ? err.message : "تعذر الحفظ" });
    }
  };

  return (
    <DashboardLayout
      title="إدارة صفحة من نحن"
      description="تحديث بيانات جدول about: الرؤية، الرسالة، القيم، الخبرات، الخدمات والصور"
    >
      {isLoading ? (
        <Card className="p-8 text-center">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Info className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">معلومات المكتب</h2>
              <p className="text-sm text-muted-foreground">جدول singleton: <code className="text-xs bg-muted px-1 rounded">about</code></p>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-8">
            {/* Narrative section */}
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                المحتوى السردي
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vision">الرؤية *</Label>
                  <Textarea
                    id="vision"
                    value={form.vision}
                    onChange={(e) => update("vision", e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission">الرسالة *</Label>
                  <Textarea
                    id="mission"
                    value={form.mission}
                    onChange={(e) => update("mission", e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">القيم *</Label>
                  <Textarea
                    id="value"
                    value={form.value}
                    onChange={(e) => update("value", e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about_office">نبذة عن المكتب *</Label>
                  <Textarea
                    id="about_office"
                    value={form.about_office}
                    onChange={(e) => update("about_office", e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Experiences list */}
            <section className="space-y-3 pt-6 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                الخبرات
              </h3>
              <div className="flex gap-2">
                <Input
                  value={newExp}
                  onChange={(e) => setNewExp(e.target.value)}
                  placeholder="أضف خبرة جديدة..."
                  className="h-11"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem("experiences", newExp);
                      setNewExp("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addItem("experiences", newExp);
                    setNewExp("");
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> إضافة
                </Button>
              </div>
              <div className="space-y-2">
                {form.experiences.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">لا توجد خبرات بعد</p>
                )}
                {form.experiences.map((exp, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-md border border-border bg-muted/30">
                    <span className="flex-1 text-sm">{exp}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem("experiences", idx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* Services list */}
            <section className="space-y-3 pt-6 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                الخدمات
              </h3>
              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="أضف خدمة جديدة..."
                  className="h-11"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem("services", newService);
                      setNewService("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addItem("services", newService);
                    setNewService("");
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" /> إضافة
                </Button>
              </div>
              <div className="space-y-2">
                {form.services.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">لا توجد خدمات بعد</p>
                )}
                {form.services.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-md border border-border bg-muted/30">
                    <span className="flex-1 text-sm">{s}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem("services", idx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* Images gallery */}
            <section className="space-y-3 pt-6 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                صور المعرض (Carousel)
              </h3>
              <Label className="inline-flex cursor-pointer items-center gap-2 h-11 px-4 rounded-md border border-input bg-background hover:bg-muted/40 text-sm">
                <Upload className="h-4 w-4" />
                {pendingUploads.length > 0 ? `${pendingUploads.length} ملفات جديدة` : "إضافة صور"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setPendingUploads(Array.from(e.target.files ?? []))}
                />
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {form.images.map((id) => {
                  const url = assetUrl(id, { width: 400, height: 300, fit: "cover" });
                  return (
                    <div key={id} className="relative group rounded-md overflow-hidden border border-border bg-muted aspect-[4/3]">
                      {url ? (
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(id)}
                        className="absolute top-1 left-1 h-7 w-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        aria-label="حذف"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
                {pendingUploads.map((file, i) => (
                  <div key={i} className="relative rounded-md overflow-hidden border border-dashed border-primary bg-muted aspect-[4/3]">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">جديد</span>
                  </div>
                ))}
                {form.images.length === 0 && pendingUploads.length === 0 && (
                  <p className="col-span-full text-sm text-muted-foreground">لا توجد صور بعد</p>
                )}
              </div>
            </section>

            <div className="flex gap-2 justify-end pt-6 border-t border-border">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default AboutAdminPage;
