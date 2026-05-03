import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  HelpCircle,
  Layers,
  Users,
  Mail,
  UserCircle,
  LogOut,
  Home,
  ShieldCheck,
  Settings,
  Link,
  Info,
  Share2,
  Share
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";

const mainItems = [
  { title: "نظرة عامة", url: "/dashboard", icon: LayoutDashboard, end: true },
  { title: "المجالات", url: "/dashboard/fields", icon: Share },
  { title: "المنشورات", url: "/dashboard/articles", icon: FileText },
  { title: "الخدمات", url: "/dashboard/services", icon: Briefcase },
  { title: "الأسئلة الشائعة", url: "/dashboard/faq", icon: HelpCircle },
  { title: "التصنيفات", url: "/dashboard/categories", icon: Layers },
  { title: "الروابط", url: "/dashboard/links", icon: Link },
  { title: "من نحن", url: "/dashboard/about", icon: Info },
];

const manageItems = [
  { title: "المستخدمون", url: "/dashboard/users", icon: Users },
  { title: "الرسائل الواردة", url: "/dashboard/messages", icon: Mail },
  { title: "الشروط والسياسة", url: "/dashboard/terms", icon: ShieldCheck },
  // { title: "الإعدادات", url: "/dashboard/settings", icon: Settings },
  { title: "الملف الشخصي", url: "/dashboard/profile", icon: UserCircle },
];

const DashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("تم تسجيل الخروج");
    navigate("/auth", { replace: true });
  };

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email
    : "خالد المجنوني";

  const getCls = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90"
      : "hover:bg-muted text-foreground";

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-10 w-10 rounded object-cover shrink-0" />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-bold text-sm truncate">لوحة التحكم</span>
              <span className="text-xs text-muted-foreground truncate">{displayName}</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>المحتوى</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const active =
                  item.end
                    ? location.pathname === item.url
                    : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end={item.end} className={getCls(active)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>الإدارة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => {
                const active = location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getCls(active)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/" className="hover:bg-muted text-foreground">
                <Home className="h-4 w-4" />
                {!collapsed && <span>عودة للموقع</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>تسجيل الخروج</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
