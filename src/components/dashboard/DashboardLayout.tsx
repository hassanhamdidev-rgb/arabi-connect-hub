import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationsButton from "./NotificationsButton";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

const DashboardLayout = ({ children, title, description, actions }: Props) => {
  const { user } = useAuth();
  const initials = (() => {
    if (!user) return "خم";
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
    if (name) return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
    return user.email.slice(0, 2).toUpperCase();
  })();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <SidebarTrigger className="h-9 w-9 rounded-lg border border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-sm" />
              <div className="relative max-w-sm w-full hidden md:block">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="بحث..." className="pr-9 h-9 bg-background/60" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <NotificationsButton />
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">{initials}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Page header */}
          <div className="border-b border-border bg-card/50 px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              {actions && <div className="flex gap-2">{actions}</div>}
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
