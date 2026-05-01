import { useState } from "react";
import { useFields, useSaveField, useDeleteField } from "@/hooks/useDirectus";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Search, Loader2, Briefcase, ImageIcon, Upload } from "lucide-react";
import { uploadFiles, assetUrl, type Field } from "@/lib/directus";

const FieldsAdminPage = () => {
  const { data: items = [], isLoading } = useFields();
  const saveMut = useSaveField();
  const delMut = useDeleteField();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Field | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Field | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);

  const filtered = items.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.type?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setImageFile(null);
    setImageId(null);
    setOpen(true);
  };

  const openEdit = (item: Field) => {
    setEditing(item);
    setImageFile(null);
    setImageId(item.image ?? null);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await delMut.mutateAsync(id);
      toast({ title: "تم حذف المجال بنجاح" });
      setPendingDelete(null);
    } catch (e) {
      toast({ title: "خطأ", description: e instanceof Error ? e.message : "تعذر الحذف" });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data: Partial<Field> = {
      name: String(fd.get("name") ?? "").trim(),
      type: String(fd.get("type") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      content: String(fd.get("content") ?? "").trim(),
      status: fd.get("status") as "published" | "draft",
    };

    if (!data.name) {
      toast({ title: "خطأ", description: "اسم المجال مطلوب" });
      return;
    }

    try {
      let finalImage = imageId;
      if (imageFile) {
        const ids = await uploadFiles([imageFile]);
        finalImage = ids[0] ?? null;
      }
      if (finalImage) data.image = finalImage;

      await saveMut.mutateAsync(editing ? { id: editing.id, ...data } : data);
      toast({ title: editing ? "تم تحديث المجال" : "تم إضافة المجال بنجاح" });
      setOpen(false);
    } catch (e) {
      toast({ title: "خطأ", description: e instanceof Error ? e.message : "تعذر الحفظ" });
    }
  };

  const previewSrc =
    imageFile != null
      ? URL.createObjectURL(imageFile)
      : assetUrl(imageId, { width: 400, fit: "cover" });

  return (
    <DashboardLayout
      title="إدارة المجالات"
      description={`${items.length} مجالات إجمالاً`}
      actions={
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> مجال جديد
        </Button>
      }
    >
      <Card className="p-4 mb-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن المجالات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصورة</TableHead>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const thumb = assetUrl(item.image, { width: 120, height: 80, fit: "cover" });
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="h-12 w-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {thumb ? (
                            <img src={thumb} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.status === "published" ? "default" : "secondary"}>
                          {item.status === "published" ? "منشور" : "مسودة"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPendingDelete(item)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا توجد مجالات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </span>
                {editing ? "تعديل المجال" : "مجال جديد"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                البيانات تتطابق مع جدول <code className="text-xs bg-muted px-1 rounded">fields</code>
              </p>
            </DialogHeader>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                المعلومات الأساسية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المجال *</Label>
                  <Input id="name" name="name" defaultValue={editing?.name ?? ""} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">النوع</Label>
                  <Input id="type" name="type" defaultValue={editing?.type ?? ""} className="h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editing?.status ?? "published"}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="published">منشور</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                صورة المجال
              </h3>
              <div className="flex items-start gap-4">
                <div className="h-24 w-32 rounded-md overflow-hidden bg-muted border border-border flex items-center justify-center shrink-0">
                  {previewSrc ? (
                    <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
                    <span className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-input bg-background hover:bg-muted/40 text-sm">
                      <Upload className="h-4 w-4" /> {imageFile ? imageFile.name : "اختر صورة"}
                    </span>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground">PNG / JPG / WEBP — حتى 5MB</p>
                </div>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                المحتوى
              </h3>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editing?.description ?? ""}
                  placeholder="وصف قصير للمجال"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">المحتوى التفصيلي</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editing?.content ?? ""}
                  placeholder="محتوى تفصيلي للمجال"
                  rows={6}
                />
              </div>
            </section>

            <div className="flex gap-2 justify-end pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={saveMut.isPending}>
                {saveMut.isPending ? "جاري الحفظ..." : editing ? "تحديث" : "إضافة"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المجال</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف "{pendingDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && handleDelete(pendingDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default FieldsAdminPage;
