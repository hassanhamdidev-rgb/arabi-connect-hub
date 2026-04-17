import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Ban, CheckCircle2, Shield } from "lucide-react";
import { mockUsers, type AppUser } from "@/lib/mockData";
import { toast } from "sonner";

const UsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = users.filter(u => u.name.includes(search) || u.email.includes(search));

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u));
    toast.success("تم تحديث الحالة");
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setUsers([...users, {
      id: String(Date.now()),
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      role: String(fd.get("role")) as "admin" | "user",
      status: "active",
      joined: "اليوم",
    }]);
    toast.success("تمت إضافة المستخدم");
    setOpen(false);
  };

  return (
    <DashboardLayout
      title="إدارة المستخدمين"
      description={`${users.length} مستخدم`}
      actions={
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> إضافة مستخدم
        </Button>
      }
    >
      <Card className="p-4 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث بالاسم أو البريد..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-9" />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ الانضمام</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {u.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === "admin" ? "default" : "secondary"} className="gap-1">
                    {u.role === "admin" && <Shield className="h-3 w-3" />}
                    {u.role === "admin" ? "مسؤول" : "مستخدم"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={u.status === "active" ? "outline" : "destructive"}
                    className={u.status === "active" ? "border-green-500 text-green-700" : ""}>
                    {u.status === "active" ? "نشط" : "محظور"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{u.joined}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => toggleStatus(u.id)} className="gap-1">
                    {u.status === "active" ? (
                      <><Ban className="h-3.5 w-3.5" /> حظر</>
                    ) : (
                      <><CheckCircle2 className="h-3.5 w-3.5" /> تفعيل</>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">الدور / الصلاحيات</Label>
              <select id="role" name="role" defaultValue="user"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="user">مستخدم عادي</option>
                <option value="admin">مسؤول (admin)</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button type="submit">إضافة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UsersPage;
