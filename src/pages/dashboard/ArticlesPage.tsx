import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { mockArticles, type Article } from "@/lib/mockData";
import { toast } from "sonner";

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);

  const filtered = articles.filter(a =>
    a.title.includes(search) || a.category.includes(search)
  );

  const openNew = () => { setEditing(null); setOpen(true); };
  const openEdit = (a: Article) => { setEditing(a); setOpen(true); };

  const handleDelete = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
    toast.success("تم حذف المقال");
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: String(fd.get("title")),
      category: String(fd.get("category")),
      status: String(fd.get("status")) as "published" | "draft",
    };
    if (editing) {
      setArticles(articles.map(a => a.id === editing.id ? { ...a, ...data } : a));
      toast.success("تم تحديث المقال");
    } else {
      setArticles([{ id: String(Date.now()), ...data, views: 0, date: "اليوم", author: "خالد المجنوني" }, ...articles]);
      toast.success("تمت إضافة المقال");
    }
    setOpen(false);
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
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في المقالات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">العنوان</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">المشاهدات</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium max-w-xs truncate">{a.title}</TableCell>
                <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                <TableCell>
                  <Badge variant={a.status === "published" ? "default" : "outline"}>
                    {a.status === "published" ? "منشور" : "مسودة"}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {a.views.toLocaleString("ar-SA")}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{a.date}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(a.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  لا توجد مقالات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل المقال" : "مقال جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">العنوان</Label>
              <Input id="title" name="title" defaultValue={editing?.title} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Input id="category" name="category" defaultValue={editing?.category} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <select id="status" name="status" defaultValue={editing?.status ?? "draft"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">المحتوى</Label>
              <Textarea id="content" name="content" rows={6} placeholder="اكتب محتوى المقال..." />
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

export default ArticlesPage;
