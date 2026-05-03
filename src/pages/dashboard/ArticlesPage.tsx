import { useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye, Loader2, LayoutGrid, Table2, Upload, ImageIcon, X } from "lucide-react";
import { useBlogs, useSaveBlog, useDeleteBlog, useCategories } from "@/hooks/useDirectus";
import { uploadFiles, assetUrl, normalizeFileIds, type Blog } from "@/lib/directus";
import { READING_TIME_OPTIONS, STATUS_OPTIONS } from "@/lib/fallbackData";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";



const isUuid = (value?: string | null) =>
  Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));

const ArticlesPage = () => {
  const { data: articles = [], isLoading } = useBlogs();
  const { data: categories = [] } = useCategories();
  const saveMut = useSaveBlog();
  const delMut = useDeleteBlog();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Blog | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [contentHtml, setContentHtml] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const blogCategories = categories.filter((item) => item.type?.toLowerCase() === "blog");

  const filtered = articles.filter((a) =>
    a.name?.includes(search) || a.category?.includes(search)
  );

  const openNew = () => {
    setEditing(null);
    setSelectedFiles([]);
    setContentHtml("");
    setOpen(true);
  };
  const openEdit = (a: Blog) => {
    setEditing(a);
    setSelectedFiles([]);
    setContentHtml(a.content ?? "");
    setOpen(true);
  };

  const applyFormat = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setContentHtml(editorRef.current?.innerHTML ?? "");
  };

  const handleDelete = async (id: number) => {
    try {
      await delMut.mutateAsync(id);
      toast.success("تم حذف المقال");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحذف");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("title")).trim();
    const readingTimeRaw = Number(fd.get("reading_time"));
    const readingTime = Number.isFinite(readingTimeRaw) && readingTimeRaw > 0 ? readingTimeRaw : null;
    const featured = fd.get("featured") === "on";
    const authorId = isUuid(user?.id) ? user!.id : undefined;

    if (selectedFiles.length > 4) {
      toast.error("الحد الأقصى 4 ملفات");
      return;
    }

    if (selectedFiles.some((file) => file.size > 5 * 1024 * 1024)) {
      toast.error("حجم كل ملف يجب ألا يتجاوز 5MB");
      return;
    }

    const data: Partial<Blog> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").slice(0, 80),
      category: String(fd.get("category")),
      status: fd.get("status") as "published" | "draft",
      description: String(fd.get("description") ?? ""),
      content: contentHtml.trim(),
      reading_time: readingTime,
      featured,
    };
    if (authorId) {
      data.author = authorId;
    }
    try {
      if (selectedFiles.length > 0) {
        const uploadedFileIds = await uploadFiles(selectedFiles);
        data.files = uploadedFileIds;
      }

      await saveMut.mutateAsync(editing ? { id: editing.id, ...data } : data);
      toast.success(editing ? "تم تحديث المقال" : "تمت إضافة المقال");
      setOpen(false);
      setSelectedFiles([]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحفظ");
    }
  };

  return (
    <DashboardLayout
      title="إدارة المقالات والمدونة"
      description={`${articles.length} مقالات إجمالاً`}
      actions={
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> مقال جديد
        </Button>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في المقالات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              size="sm"
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => setViewMode("table")}
              className="gap-1.5"
            >
              <Table2 className="h-4 w-4" />
              جدول
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewMode === "card" ? "default" : "outline"}
              onClick={() => setViewMode("card")}
              className="gap-1.5"
            >
              <LayoutGrid className="h-4 w-4" />
              بطاقات
            </Button>
          </div>
        </div>
      </Card>

      {viewMode === "table" ? (
        <Card>
          <Table >
            <TableHeader>
              <TableRow  className=" py-8">
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">التصنيف</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">المشاهدات</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 ">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filtered.map((a) => (
                <TableRow key={a.id}  className=" ">
                  <TableCell className="font-medium max-w-xs truncate ">{a.name}</TableCell>
                  <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={a.status === "published" ? "default" : "outline"}>
                      {a.status === "published" ? "منشور" : "مسودة"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    {(a.views ?? 0).toLocaleString("ar-SA")}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {a.date_created ? new Date(a.date_created).toLocaleDateString("ar-SA") : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setPendingDelete(a)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    لا توجد مقالات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading && (
            <Card className="md:col-span-2 xl:col-span-3 p-8">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
            </Card>
          )}
          {!isLoading && filtered.map((a) => {
            const cover = normalizeFileIds(a.files)[0];
            return (
            <Card key={a.id} className="p-4">
              {cover && (
                <div className="aspect-[16/9] -m-4 mb-3 overflow-hidden bg-muted rounded-t-md">
                  <img src={assetUrl(cover, { width: 600, height: 340, fit: "cover" })} alt={a.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold line-clamp-2">{a.name}</h3>
                <Badge variant={a.status === "published" ? "default" : "outline"} className="shrink-0">
                  {a.status === "published" ? "منشور" : "مسودة"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{a.category}</Badge>
                {a.featured && <Badge variant="outline">مميز</Badge>}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {a.description || "—"}
              </p>
              <div className="text-xs text-muted-foreground flex items-center justify-between mb-3">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {(a.views ?? 0).toLocaleString("ar-SA")}
                </span>
                <span>{a.date_created ? new Date(a.date_created).toLocaleDateString("ar-SA") : "—"}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 flex-1" onClick={() => openEdit(a)}>
                  <Edit className="h-4 w-4" />
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1.5"
                  onClick={() => setPendingDelete(a)}
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </Button>
              </div>
            </Card>
            );
          })}
          {!isLoading && filtered.length === 0 && (
            <Card className="md:col-span-2 xl:col-span-3 p-8 text-center text-muted-foreground">
              لا توجد مقالات
            </Card>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0">
          <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Edit className="h-4 w-4" />
                </span>
                {editing ? "تعديل المقال" : "مقال جديد"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {editing ? "تحديث محتوى وبيانات المقال" : "أضف مقالًا جديدًا للمدونة"}
              </p>
            </DialogHeader>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                المعلومات الأساسية
              </h3>
              <div className="space-y-2">
                <Label htmlFor="title">العنوان</Label>
                <Input id="title" name="title" defaultValue={editing?.name} required className="h-11" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <Select name="category" defaultValue={editing?.category ?? undefined} required>
                    <SelectTrigger className="h-11"><SelectValue placeholder="اختر تصنيف المدونة" /></SelectTrigger>
                    <SelectContent>
                      {blogCategories.map((item) => (
                        <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select name="status" defaultValue={editing?.status ?? "draft"}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.labelAr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reading_time">مدة القراءة</Label>
                  <Select name="reading_time" defaultValue={editing?.reading_time ? String(editing.reading_time) : undefined}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="اختر مدة القراءة" /></SelectTrigger>
                    <SelectContent>
                      {READING_TIME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>{option.labelAr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>مقال مميز</Label>
                  <label className="flex h-11 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm cursor-pointer hover:bg-muted/40 transition">
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={Boolean(editing?.featured)}
                      className="h-4 w-4 accent-primary"
                    />
                    عرض كمقال مميز في الواجهة
                  </label>
                </div>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                المحتوى
              </h3>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف المختصر</Label>
                <Textarea id="description" name="description" rows={2} defaultValue={editing?.description} required className="resize-none" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">المحتوى الكامل</Label>
                <div className="rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                  <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/40">
                    <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("bold")}>B</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("italic")}><em>I</em></Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("underline")}><u>U</u></Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("insertUnorderedList")}>• List</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("insertOrderedList")}>1. List</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("formatBlock", "h2")}>H2</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("formatBlock", "p")}>P</Button>
                  </div>
                  <div
                    id="content"
                    ref={editorRef}
                    contentEditable
                    dir="rtl"
                    className="min-h-[200px] p-3 text-sm focus:outline-none prose prose-sm max-w-none bg-background"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                    onInput={(e) => setContentHtml((e.currentTarget as HTMLDivElement).innerHTML)}
                  />
                </div>
                <input type="hidden" name="content" value={contentHtml} />
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                المرفقات
              </h3>
              {editing && normalizeFileIds(editing.files).length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">الملفات الحالية</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {normalizeFileIds(editing.files).map((fid) => (
                      <div key={fid} className="aspect-square rounded-md border border-border bg-muted overflow-hidden">
                        <img src={assetUrl(fid, { width: 200, height: 200, fit: "cover" })} alt="" className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="files">{editing ? "استبدال الملفات" : "ملفات المقال"} (حد أقصى 4، كل ملف 5MB)</Label>
                <Label htmlFor="files" className="inline-flex cursor-pointer items-center gap-2 h-11 px-4 rounded-md border border-input bg-background hover:bg-muted/40 text-sm w-full">
                  <Upload className="h-4 w-4" />
                  {selectedFiles.length > 0 ? `${selectedFiles.length} ملفات جديدة` : "اختر ملفات (صور/PDF)"}
                </Label>
                <Input
                  id="files"
                  name="files"
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                  className="hidden"
                />
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-md border border-dashed border-primary bg-muted overflow-hidden">
                        {file.type.startsWith("image/") ? (
                          <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs p-2 text-center text-muted-foreground">{file.name}</div>
                        )}
                        <button type="button" onClick={() => setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 left-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <DialogFooter className="pt-2 border-t border-border -mx-6 px-6 pb-0 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11">إلغاء</Button>
              <Button type="submit" disabled={saveMut.isPending} className="h-11 min-w-32 gap-2">
                {saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "حفظ التعديلات" : "نشر المقال"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDelete} onOpenChange={(isOpen) => !isOpen && setPendingDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد حذف المقال</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من حذف المقال
            {" "}
            <span className="font-medium text-foreground">"{pendingDelete?.name}"</span>
            ؟ لا يمكن التراجع عن هذه العملية.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
              disabled={delMut.isPending}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                if (!pendingDelete) return;
                await handleDelete(pendingDelete.id);
                setPendingDelete(null);
              }}
              disabled={delMut.isPending}
            >
              {delMut.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ArticlesPage;
