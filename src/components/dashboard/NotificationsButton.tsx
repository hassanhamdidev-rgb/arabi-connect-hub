import { Bell, MessageSquare, FileText, UserPlus, Settings as SettingsIcon, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications, useMarkNotification } from "@/hooks/useDirectus";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof MessageSquare> = {
  message: MessageSquare,
  article: FileText,
  user: UserPlus,
  system: SettingsIcon,
};

const NotificationsButton = () => {
  const { data: items = [], isLoading } = useNotifications();
  const markMut = useMarkNotification();

  const top5 = items.slice(0, 5);
  const unread = items.filter((n) => !n.is_read).length;

  const markAll = () => {
    items.filter((n) => !n.is_read).forEach((n) => markMut.mutate(n.id));
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
          <Button variant="ghost" size="sm" onClick={markAll} className="h-8 text-xs gap-1" disabled={unread === 0}>
            <CheckCheck className="h-3.5 w-3.5" /> قراءة الكل
          </Button>
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
              <button
                key={n.id}
                onClick={() => !n.is_read && markMut.mutate(n.id)}
                className={cn(
                  "w-full text-right flex items-start gap-3 p-3 border-b border-border/60 hover:bg-muted/60 transition-colors",
                  !n.is_read && "bg-accent/5"
                )}
              >
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{n.category}</span>
                    {!n.is_read && <span className="h-2 w-2 rounded-full bg-accent shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{n.description}</div>
                  <div className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {n.date_created ? new Date(n.date_created).toLocaleString("ar-SA") : ""}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsButton;
