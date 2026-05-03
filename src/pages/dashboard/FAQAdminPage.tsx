import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, GripVertical, Loader2, Search } from "lucide-react";
import { useFaqsPaginated, useSaveFaq, useDeleteFaq } from "@/hooks/useDirectus";
import { PaginationControls } from "@/components/dashboard/PaginationControls";
import { FAQ_CATEGORY_OPTIONS, ICON_OPTIONS, getIconByName } from "@/lib/fallbackData";
import type { Faq } from "@/lib/directus";
import { toast } from "sonner";

const LIMIT = 10;

const FAQAdminPage = () => {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);

  const { data: items = [], isLoading } = useFaqsPaginated({ 
    limit: LIMIT, 
    offset, 
    search: search || undefined 
  });
  const saveMut = useSaveFaq();
  const delMut = useDeleteFaq();

  const handleDelete = async (id: number) => {
    try {
      await delMut.mutateAsync(id);
      toast.success("تم الحذف");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحذف");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Partial<Faq> = {
      question: String(fd.get("question")),
      answer: String(fd.get("answer")),
      category: String(fd.get("category") ?? "عام"),
      icon: String(fd.get("icon") ?? "HelpCircle"),
      meta_title: String(fd.get("question")).slice(0, 60),
      meta_description: String(fd.get("answer")).slice(0, 160),
      tl_dr: String(fd.get("answer")).slice(0, 200),
      status: "active",
    };
    try {
      await saveMut.mutateAsync(editing ? { id: editing.id, ...data } : data);
      toast.success(editing ? "تم التحديث" : "تمت الإضافة");
      setOpen(false);
      setOffset(0); // Reset to first page
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحفظ");
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setOffset(0); // Reset to first page on search
  };

  const handleLoadMore = () => {
    setOffset((prev) => prev + LIMIT);
  };

  const handleReset = () => {
    setSearch("");
    setOffset(0);
  };

  return (
    <DashboardLayout
      title="إدارة الأسئلة الشائعة"
      description={`${items.length > 0 ? "تحميل..." : "0"} سؤال`}
      actions={
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> سؤال جديد
        </Button>
      }
    >
      {/* Search */}
      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن الأسئلة..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-9"
          />
        </div>
      </Card>

      {isLoading && offset === 0 ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">لا توجد أسئلة</p>
        </Card>
      ) : (
        <>
          <Card className="p-2">
            <Accordion type="single" collapsible className="w-full">
              {items.map((item) => (
                <AccordionItem key={item.id} value={String(item.id)} className="border-border">
                  <div className="flex items-center gap-2 pl-4">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <AccordionTrigger className="flex-1 text-right hover:no-underline">
                      <span className="font-medium">{item.question}</span>
                    </AccordionTrigger>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditing(item); setOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <AccordionContent className="px-12 text-muted-foreground whitespace-pre-wrap">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          <PaginationControls
            offset={offset}
            limit={LIMIT}
            totalItems={items.length}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
            onReset={handleReset}
          />
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Edit className="h-4 w-4" />
                </span>
                {editing ? "تعديل السؤال" : "سؤال جديد"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ساعد عملاءك بإجابات واضحة على الأسئلة المتكررة
              </p>
            </DialogHeader>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="question">السؤال</Label>
              <Input id="question" name="question" defaultValue={editing?.question} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">الإجابة</Label>
              <Textarea id="answer" name="answer" defaultValue={editing?.answer} rows={6} required className="resize-none" placeholder="اكتب إجابة مفصلة وواضحة..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Select name="category" defaultValue={editing?.category ?? "عام"}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="اختر تصنيفاً" /></SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.labelAr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">الأيقونة</Label>
                <Select name="icon" defaultValue={editing?.icon ?? "HelpCircle"}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="اختر أيقونة" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((o) => {
                      const Icon = o.Icon;
                      return (
                        <SelectItem key={o.value} value={o.value}>
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {o.labelAr}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border -mx-6 px-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11">إلغاء</Button>
              <Button type="submit" disabled={saveMut.isPending} className="gap-2 min-w-32 h-11">
                {saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "حفظ التعديلات" : "إضافة السؤال"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FAQAdminPage;
