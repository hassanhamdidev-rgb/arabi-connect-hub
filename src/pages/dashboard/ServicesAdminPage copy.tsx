import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Briefcase, Loader2 } from "lucide-react";
import { useServices, useSaveService, useDeleteService } from "@/hooks/useDirectus";
import type { Service } from "@/lib/directus";
import { toast } from "sonner";

const ServicesAdminPage = () => {
  const { data: services = [], isLoading } = useServices();
  const saveMut = useSaveService();
  const delMut = useDeleteService();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);

  const toggle = async (s: Service) => {
    try {
      await saveMut.mutateAsync({
        id: s.id,
        status: s.status === "active" ? "inactive" : "active",
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر التحديث");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await delMut.mutateAsync(id);
      toast.success("تم حذف الخدمة");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحذف");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("title")).trim();
    const data: Partial<Service> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").slice(0, 80),
      description: String(fd.get("description")),
      icon: String(fd.get("icon") ?? "Briefcase"),
      status: "active",
      type: String(fd.get("type") ?? "general"),
      price: String(fd.get("price") ?? ""),
      duration: String(fd.get("duration") ?? ""),
      meta_title: name,
      meta_description: String(fd.get("description")).slice(0, 160),
      tl_dr: String(fd.get("description")).slice(0, 200),
      featured: "false",
      image: editing?.image ?? "",
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
      title="إدارة الخدمات"
      description={`${services.length} خدمة`}
      actions={
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> خدمة جديدة
        </Button>
      }
    >
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => {
          const active = s.status === "active";
          return (
            <Card key={s.id} className={!active ? "opacity-60" : ""}>
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                <div className="h-11 w-11 rounded-lg gradient-teal flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary-foreground" />
                </div>
                <Badge variant={active ? "default" : "outline"}>
                  {active ? "مفعّلة" : "موقوفة"}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">{s.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{s.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Switch checked={active} onCheckedChange={() => toggle(s)} />
                    <Label className="text-xs text-muted-foreground">عرض في الموقع</Label>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(s); setOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setPendingDelete(s)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الخدمة" : "خدمة جديدة"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الخدمة</Label>
              <Input id="title" name="title" defaultValue={editing?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea id="description" name="description" defaultValue={editing?.description} rows={4} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="icon">الأيقونة</Label>
                <Input id="icon" name="icon" defaultValue={editing?.icon ?? "Briefcase"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">النوع</Label>
                <Input id="type" name="type" defaultValue={editing?.type ?? "general"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">السعر</Label>
                <Input id="price" name="price" defaultValue={editing?.price} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">المدة</Label>
                <Input id="duration" name="duration" defaultValue={editing?.duration} />
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

      <Dialog open={!!pendingDelete} onOpenChange={(isOpen) => !isOpen && setPendingDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد حذف الخدمة</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من حذف الخدمة
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

export default ServicesAdminPage;
