import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCategories, useSaveCategory, useDeleteCategory } from "@/hooks/useDirectus";
import type { Category } from "@/lib/directus";
import { Plus, Edit2, Edit , Trash2, Search, Loader2, Briefcase, ImageIcon, Upload, Layers , AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORY_TYPES = [
  { value: "blog", label: "مدونة" },
  { value: "service", label: "خدمة" },
  { value: "faq", label: "أسئلة شائعة" },
  { value: "report", label: "تقرير" },
  { value: "contact", label: "رسالة" },
  { value: "field", label: "مجال" },
];

const CategoriesAdminPage = () => {
  const { data: items = [], isLoading } = useCategories();
  const saveMut = useSaveCategory();
  const delMut = useDeleteCategory();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [categories, setCategories] = useState(CATEGORY_TYPES);
  
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      try {
        await delMut.mutateAsync(id);
        toast.success("تم حذف التصنيف");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "تعذر الحذف");
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Partial<Category> = {
      name: String(fd.get("name")),
      type: String(fd.get("type")),
      description: String(fd.get("description")),
      tl_dr: String(fd.get("tl_dr") ?? String(fd.get("description")).slice(0, 200)),
      status: "published",
    };

    try {
      await saveMut.mutateAsync(editing ? { id: editing.id, ...data } : data);
      toast.success(editing ? "تم تحديث التصنيف" : "تمت إضافة التصنيف");
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحفظ");
    }
  };

  return (
    <DashboardLayout
      title="إدارة التصنيفات"
      description={`${items.length} تصنيف`}
      actions={
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> تصنيف جديد
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const typeLabel = CATEGORY_TYPES.find(t => t.value === item.type)?.label || item.type;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Layers className="h-3 w-3" />
                        {typeLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-sm truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "published" ? "outline" : "secondary"}>
                        {item.status === "published" ? "منشور" : "مسودة"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => { setEditing(item); setOpen(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    لا توجد تصنيفات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border">
            <DialogHeader className="mt-5">
              <DialogTitle className="text-xl flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Layers className="h-4 w-4" />
                </span>
                {editing ? "تعديل التصنيف" : "تصنيف جديد"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                أنشئ أو عدّل التصنيفات المستخدمة في المدونة والخدمات والأسئلة الشائعة
              </p>
            </DialogHeader>
          </div>
          <form onSubmit={handleSave} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">اسم التصنيف</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={editing?.name} 
                required 
                className="h-11"
                placeholder="مثل: تطوير الويب"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">النوع</Label>
{/* ------------------------ */}
{categoriesError && (
                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700 flex gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{categoriesError}</span>
                    </div>
                  )}
   <Select
  name="type"
  defaultValue={editing?.type ?? "blog"}
>
  <SelectTrigger>
    <SelectValue placeholder="اختر نوع التصنيف" />
  </SelectTrigger>
  <SelectContent>
    {categories.map((category) => (
      <SelectItem
        key={`${category.value}-${category.label}`}
        value={category.value}
      >
        {category.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
{/* ------------------------- */}

              {/* <select
                id="type"
                name="type"
                defaultValue={editing?.type ?? "blog"}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                {CATEGORY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={editing?.description} 
                rows={4}
                required 
                className="resize-none"
                placeholder="اكتب وصفاً مفصلاً للتصنيف"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tl_dr">ملخص سريع (اختياري)</Label>
              <Textarea 
                id="tl_dr" 
                name="tl_dr" 
                defaultValue={editing?.tl_dr ?? ""} 
                rows={2}
                className="resize-none"
                placeholder="ملخص قصير للعرض السريع"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border -mx-6 px-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11">
                إلغاء
              </Button>
              <Button type="submit" disabled={saveMut.isPending} className="gap-2 min-w-32 h-11">
                {saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "حفظ التعديلات" : "إضافة التصنيف"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CategoriesAdminPage;
