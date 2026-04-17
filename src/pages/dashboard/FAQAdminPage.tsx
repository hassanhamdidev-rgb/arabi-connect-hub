import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { mockFAQ, type FAQItem } from "@/lib/mockData";
import { toast } from "sonner";

const FAQAdminPage = () => {
  const [items, setItems] = useState<FAQItem[]>(mockFAQ);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast.success("تم الحذف");
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { question: String(fd.get("question")), answer: String(fd.get("answer")) };
    if (editing) {
      setItems(items.map(i => i.id === editing.id ? { ...i, ...data } : i));
      toast.success("تم التحديث");
    } else {
      setItems([...items, { id: String(Date.now()), ...data, order: items.length + 1 }]);
      toast.success("تمت الإضافة");
    }
    setOpen(false);
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
      <Card className="p-2">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-border">
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
              <AccordionContent className="px-12 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل السؤال" : "سؤال جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">السؤال</Label>
              <Input id="question" name="question" defaultValue={editing?.question} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">الإجابة</Label>
              <Textarea id="answer" name="answer" defaultValue={editing?.answer} rows={5} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button type="submit">حفظ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FAQAdminPage;
