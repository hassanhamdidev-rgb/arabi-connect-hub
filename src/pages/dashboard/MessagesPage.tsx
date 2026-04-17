import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Reply, Trash2, MailOpen } from "lucide-react";
import { mockMessages, type Message } from "@/lib/mockData";
import { toast } from "sonner";

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selected, setSelected] = useState<Message | null>(messages[0] ?? null);
  const [reply, setReply] = useState("");

  const select = (m: Message) => {
    setSelected(m);
    if (!m.read) setMessages(messages.map(x => x.id === m.id ? { ...x, read: true } : x));
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success("تم الحذف");
  };

  const handleReply = () => {
    if (!reply.trim()) return;
    toast.success("تم إرسال الرد");
    setReply("");
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <DashboardLayout title="الرسائل الواردة" description={`${unread} رسالة غير مقروءة من ${messages.length}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-16rem)]">
        {/* List */}
        <Card className="lg:col-span-1 overflow-y-auto">
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
                      <span className={`text-sm truncate ${!m.read ? "font-bold" : "font-medium"}`}>
                        {m.name}
                      </span>
                      {!m.read && <span className="h-2 w-2 rounded-full bg-accent shrink-0" />}
                    </div>
                    <div className="text-xs text-foreground truncate mb-1">{m.subject}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.body}</div>
                    <div className="text-xs text-muted-foreground/70 mt-1">{m.date}</div>
                  </div>
                </div>
              </button>
            ))}
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
                      <div className="text-sm text-muted-foreground">{selected.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <MailOpen className="h-3 w-3" /> {selected.date}
                    </Badge>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(selected.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h2 className="font-heading text-lg font-bold">{selected.subject}</h2>
              </div>

              <div className="p-5 flex-1 overflow-y-auto">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{selected.body}</p>
              </div>

              <div className="p-5 border-t border-border space-y-3">
                <Textarea
                  placeholder="اكتب ردك..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleReply} className="gap-2">
                    <Reply className="h-4 w-4" /> إرسال الرد
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
