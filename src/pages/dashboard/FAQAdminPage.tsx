import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useFaqs, useSaveFaq, useDeleteFaq } from "@/hooks/useDirectus";
import type { Fqa } from "@/lib/directus";
import { toast } from "sonner";

const FAQAdminPage = () => {
  const { data: items = [], isLoading } = useFaqs();
  const saveMut = useSaveFaq();
  const delMut = useDeleteFaq();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Fqa | null>(null);

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
    const data: Partial<Fqa> = {
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
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحفظ");
    }
  };

  return (
    <DashboardLayout
      title="إدارة الأسئلة الشائعة"
      description={`${items.length} سؤال`}
      actions={
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> سؤال جديد
        </Button>
      }
    >
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل السؤال" : "سؤال جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="question">السؤال</Label>
              <Input id="question" name="question" defaultValue={editing?.question} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">الإجابة</Label>
              <Textarea id="answer" name="answer" defaultValue={editing?.answer} rows={5} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Input id="category" name="category" defaultValue={editing?.category ?? "عام"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">الأيقونة</Label>
                <Input id="icon" name="icon" defaultValue={editing?.icon ?? "HelpCircle"} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button type="submit" disabled={saveMut.isPending} className="gap-2 min-w-24">
                {saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                حفظ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FAQAdminPage;
