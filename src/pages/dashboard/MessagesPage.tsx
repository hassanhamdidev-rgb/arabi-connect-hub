import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Reply, Trash2, MailOpen, Loader2 } from "lucide-react";
import {
  useContactMessages,
  useUpdateMessage,
  useDeleteMessage,
} from "@/hooks/useDirectus";
import type { ContactMessage } from "@/lib/directus";
import { toast } from "sonner";

const MessagesPage = () => {
  const { data: messages = [], isLoading } = useContactMessages();
  const updateMut = useUpdateMessage();
  const deleteMut = useDeleteMessage();

  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (!selected && messages.length > 0) setSelected(messages[0]);
  }, [messages, selected]);

  const select = async (m: ContactMessage) => {
    setSelected(m);
    if (!m.is_read) {
      try {
        await updateMut.mutateAsync({ id: m.id, data: { is_read: true } });
      } catch {
        /* ignore */
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMut.mutateAsync(id);
      if (selected?.id === id) setSelected(null);
      toast.success("تم الحذف");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر الحذف");
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    try {
      await updateMut.mutateAsync({
        id: selected.id,
        data: { is_replied: true, status: "replied" },
      });
      toast.success("تم تسجيل الرد");
      setReply("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر التحديث");
    }
  };

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <DashboardLayout
      title="الرسائل الواردة"
      description={`${unread} رسالة غير مقروءة من ${messages.length}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-16rem)]">
        {/* List */}
        <Card className="lg:col-span-1 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <div className="divide-y divide-border">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => select(m)}
                className={`w-full text-right p-4 hover:bg-muted/50 transition-colors ${
                  selected?.id === m.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-accent/10 text-accent text-sm">
                      {m.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-sm truncate ${!m.is_read ? "font-bold" : "font-medium"}`}>
                        {m.name}
                      </span>
                      {!m.is_read && <span className="h-2 w-2 rounded-full bg-accent shrink-0" />}
                    </div>
                    <div className="text-xs text-foreground truncate mb-1">{m.category}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.description}</div>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {m.date_created ? new Date(m.date_created).toLocaleString("ar-SA") : ""}
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {!isLoading && messages.length === 0 && (
              <div className="p-6 text-center text-muted-foreground text-sm">لا توجد رسائل</div>
            )}
          </div>
        </Card>

        {/* Detail */}
        <Card className="lg:col-span-2 flex flex-col">
          {selected ? (
            <>
              <div className="p-5 border-b border-border">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selected.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{selected.name}</div>
                      <div className="text-sm text-muted-foreground" dir="ltr">{selected.email}</div>
                      <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">{selected.phone}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={selected.is_replied ? "default" : "outline"} className="gap-1">
                      <MailOpen className="h-3 w-3" />
                      {selected.is_replied ? "تم الرد" : selected.is_read ? "مقروءة" : "جديدة"}
                    </Badge>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(selected.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h2 className="font-heading text-lg font-bold">{selected.category}</h2>
              </div>

              <div className="p-5 flex-1 overflow-y-auto">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {selected.description}
                </p>
              </div>

              <div className="p-5 border-t border-border space-y-3">
                <Textarea
                  placeholder="اكتب ردك..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleReply} disabled={updateMut.isPending} className="gap-2">
                    <Reply className="h-4 w-4" /> تسجيل الرد
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Mail className="h-12 w-12 mb-3 opacity-30" />
              <p>اختر رسالة لعرضها</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
