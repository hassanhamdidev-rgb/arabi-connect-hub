import { Bell, MessageSquare, FileText, UserPlus, Settings as SettingsIcon, CheckCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications, useMarkNotification, useDeleteNotification, useDeleteAllNotifications } from "@/hooks/useDirectus";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { playNotificationSound } from "@/lib/notifications";

const iconMap: Record<string, typeof MessageSquare> = {
  message: MessageSquare,
  article: FileText,
  user: UserPlus,
  system: SettingsIcon,
};

const NotificationsButton = () => {
  const { data: items = [], isLoading } = useNotifications();
  const markMut = useMarkNotification();
  const deleteMut = useDeleteNotification();
  const deleteAllMut = useDeleteAllNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();
  const previousUnreadCountRef = useRef(0);

  const top5 = items.slice(0, 5);
  const unread = items.filter((n) => !n.is_read).length;

  // Play sound when new notifications arrive
  useEffect(() => {
    if (!isLoading && unread > previousUnreadCountRef.current) {
      playNotificationSound(0.6);
    }
    previousUnreadCountRef.current = unread;
  }, [unread, isLoading]);

  const markAll = () => {
    items.filter((n) => !n.is_read).forEach((n) => markMut.mutate(n.id));
  };

  const deleteOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMut.mutate(id, {
      onSuccess: () => {
        toast({
          title: "تم الحذف",
          description: "تم حذف الإشعار بنجاح",
        });
      },
    });
  };

  const deleteAll = () => {
    deleteAllMut.mutate(items.map((n) => n.id), {
      onSuccess: () => {
        toast({
          title: "تم حذف الكل",
          description: `تم حذف ${items.length} إشعار`,
        });
      },
    });
  };

  const handleClick = (n: typeof items[number]) => {
    if (!n.is_read) markMut.mutate(n.id);
    if (n.url) navigate('/dashboard/messages');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="الإشعارات">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1 left-1 h-4 min-w-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div>
            <div className="font-heading font-bold text-sm">الإشعارات</div>
            <div className="text-xs text-muted-foreground">{unread} غير مقروءة</div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={markAll} className="h-8 text-xs gap-1" disabled={unread === 0}>
              <CheckCheck className="h-3.5 w-3.5" /> قراءة الكل
            </Button>
            <Button variant="ghost" size="sm" onClick={deleteAll} className="h-8 text-xs gap-1" disabled={items.length === 0}>
              <Trash2 className="h-3.5 w-3.5" /> حذف الكل
            </Button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="p-6 text-center text-sm text-muted-foreground">جاري التحميل...</div>
          )}
          {!isLoading && top5.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">لا توجد إشعارات</div>
          )}
          {top5.map((n) => {
            const Icon = iconMap[n.icon ?? "system"] ?? SettingsIcon;
            return (
              <div
                key={n.id}
                className={cn(
                  "w-full text-right flex items-start gap-3 p-3 border-b border-border/60 hover:bg-muted/60 transition-colors group",
                  !n.is_read && "bg-accent/5"
                )}
              >
                <button
                  onClick={() => handleClick(n)}
                  className="flex-1 flex items-start gap-3 cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{n.category}</span>
                      {!n.is_read && <span className="h-2 w-2 rounded-full bg-accent shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px] overflow-clip overflow-ellipsis line-clamp-1">{n.description}</div>
                    <div className="text-[10px] text-muted-foreground/70 mt-0.5">
                      {n.date_created ? new Date(n.date_created).toLocaleString("ar-SA") : ""}
                    </div>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => deleteOne(n.id, e)}
                  className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsButton;
