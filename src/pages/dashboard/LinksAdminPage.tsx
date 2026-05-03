import { useState } from "react";
import { useSocialLinks, useSaveSocialLink, useDeleteSocialLink } from "@/hooks/useDirectus";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Search, Loader2, ExternalLink } from "lucide-react";
import type { SocialLink } from "@/hooks/useDirectus";
import { SOCIAL_ICON_OPTIONS } from "@/lib/fallbackData";
import { socialIconSvg } from "@/lib/socialIcons";

const LinksAdminPage = () => {
  const { data: links = [], isLoading } = useSocialLinks();
  const saveMut = useSaveSocialLink();
  const delMut = useDeleteSocialLink();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SocialLink | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"published" | "draft">("published");

  const filtered = links.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.url?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setSelectedIcon("");
    setSelectedStatus("published");
    setOpen(true);
  };

  const openEdit = (link: SocialLink) => {
    setEditing(link);
    setSelectedIcon(link.icon ?? "");
    setSelectedStatus(link.status ?? "published");
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await delMut.mutateAsync(id);
      toast({ title: "تم حذف الرابط بنجاح" });
      setPendingDelete(null);
    } catch (e) {
      toast({ title: "خطأ", description: e instanceof Error ? e.message : "تعذر الحذف" });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data: Partial<SocialLink> = {
      name: String(fd.get("name") ?? "").trim(),
      url: String(fd.get("url") ?? "").trim(),
      icon: String(fd.get("icon") ?? "").trim(),
      status: fd.get("status") as "published" | "draft",
    };

    if (!data.name || !data.url) {
      toast({ title: "خطأ", description: "الاسم والرابط مطلوبان" });
      return;
    }

    try {
      await saveMut.mutateAsync(editing ? { id: editing.id, ...data } : data);
      toast({ title: editing ? "تم تحديث الرابط" : "تم إضافة الرابط بنجاح" });
      setOpen(false);
      setSelectedIcon("");
      setSelectedStatus("published");
    } catch (e) {
      toast({ title: "خطأ", description: e instanceof Error ? e.message : "تعذر الحفظ" });
    }
  };

  return (
    <DashboardLayout
      title="إدارة الروابط الاجتماعية"
      description={`${links.length} روابط إجمالاً`}
      actions={
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> رابط جديد
        </Button>
      }
    >
      <Card className="p-4 mb-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن الروابط..."
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
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">الرابط</TableHead>
                <TableHead className="text-right">الأيقونة</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{link.url}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-5 w-5 inline-flex items-center justify-center text-primary">
                          {socialIconSvg(link.icon)}
                        </span>
                        <span className="text-xs text-muted-foreground">{link.icon}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={link.status === "published" ? "default" : "secondary"}>
                        {link.status === "published" ? "منشور" : "مسودة"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(link)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPendingDelete(link)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا توجد روابط
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border">
            <DialogHeader className="mt-5">
              <DialogTitle className="text-xl flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <ExternalLink className="h-4 w-4" />
                </span>
                {editing ? "تعديل الرابط" : "رابط اجتماعي جديد"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                أضف رابط اجتماعي جديد أو عدل رابط موجود
              </p>
            </DialogHeader>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium">اسم المنصة *</label>
              <Input
                name="name"
                defaultValue={editing?.name ?? ""}
                placeholder="مثال: facebook"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">الرابط *</label>
              <Input
                name="url"
                type="url"
                defaultValue={editing?.url ?? ""}
                placeholder="https://..."
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">الأيقونة</label>
              <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="اختر منصة" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_ICON_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 inline-flex items-center justify-center text-primary">
                          {socialIconSvg(o.value)}
                        </span>
                        {o.labelAr}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="icon" value={selectedIcon} />
              <p className="text-xs text-muted-foreground">يُستخدم لاختيار الأيقونة المعروضة في الموقع</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">الحالة</label>
              <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as "published" | "draft")}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="status" value={selectedStatus} />
            </div>

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

      {/* Delete Confirmation */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الرابط</AlertDialogTitle>
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

export default LinksAdminPage;
