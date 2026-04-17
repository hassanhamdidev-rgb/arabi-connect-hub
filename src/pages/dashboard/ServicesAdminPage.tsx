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
import { Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { mockServices, type Service } from "@/lib/mockData";
import { toast } from "sonner";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const toggle = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleDelete = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast.success("تم حذف الخدمة");
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      title: String(fd.get("title")),
      description: String(fd.get("description")),
      icon: "Briefcase",
    };
    if (editing) {
      setServices(services.map(s => s.id === editing.id ? { ...s, ...data } : s));
      toast.success("تم التحديث");
    } else {
      setServices([...services, { id: String(Date.now()), ...data, active: true }]);
      toast.success("تمت الإضافة");
    }
    setOpen(false);
  };

  return (
    <DashboardLayout
      title="إدارة الخدمات"
      description="الخدمات المعروضة في الموقع"
      actions={
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> خدمة جديدة
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <Card key={s.id} className={!s.active ? "opacity-60" : ""}>
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
              <div className="h-11 w-11 rounded-lg gradient-teal flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <Badge variant={s.active ? "default" : "outline"}>
                {s.active ? "مفعّلة" : "موقوفة"}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">{s.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{s.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch checked={s.active} onCheckedChange={() => toggle(s.id)} />
                  <Label className="text-xs text-muted-foreground">عرض في الموقع</Label>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(s); setOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الخدمة" : "خدمة جديدة"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الخدمة</Label>
              <Input id="title" name="title" defaultValue={editing?.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea id="description" name="description" defaultValue={editing?.description} rows={4} required />
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

export default ServicesPage;
