import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, Mail, Eye, TrendingUp, ArrowUp, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useBlogs,
  useServices,
  useFaqs,
  useContactMessages,
} from "@/hooks/useDirectus";
import StatsCharts from "@/components/dashboard/StatsCharts";

const DashboardHome = () => {
  const { data: blogs = [] } = useBlogs();
  const { data: services = [] } = useServices();
  const { data: faqs = [] } = useFaqs();
  const { data: messages = [] } = useContactMessages();

  const totalViews = blogs.reduce((s, a) => s + (a.views ?? 0), 0);
  const unread = messages.filter((m) => !m.is_read).length;

  const stats = [
    {
      label: "إجمالي المقالات",
      value: blogs.length,
      icon: FileText,
      color: "text-primary bg-primary/10",
    },
    {
      label: "الخدمات النشطة",
      value: services.filter((s) => s.status === "active").length,
      icon: Briefcase,
      color: "text-accent bg-accent/10",
    },
    {
      label: "الرسائل الجديدة",
      value: unread,
      icon: Mail,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "إجمالي المشاهدات",
      value: totalViews.toLocaleString("ar-SA"),
      icon: Eye,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  const topArticles = [...blogs].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);
  const recentMessages = messages.slice(0, 4);

  return (
    <DashboardLayout title="نظرة عامة" description="مرحباً بك في لوحة التحكم — ملخص نشاط الموقع">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium flex items-center gap-1 text-green-600">
                  <ArrowUp className="h-3 w-3" /> مباشر
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <StatsCharts blogs={blogs} messages={messages} services={services} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              المقالات الأكثر مشاهدة
            </CardTitle>
            <Link to="/dashboard/articles" className="text-xs text-primary hover:underline">
              عرض الكل
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topArticles.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">لا توجد مقالات بعد</p>
            )}
            {topArticles.map((a, i) => (
              <Link
                key={a.id}
                to={`/blog/${a.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{a.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.category} • {a.date_created ? new Date(a.date_created).toLocaleDateString("ar-SA") : ""}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                  <Eye className="h-3.5 w-3.5" />
                  {(a.views ?? 0).toLocaleString("ar-SA")}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-accent" />
              أحدث الرسائل
            </CardTitle>
            <Link to="/dashboard/messages" className="text-xs text-primary hover:underline">
              عرض الكل
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">لا توجد رسائل</p>
            )}
            {recentMessages.map((m) => (
              <Link
                key={m.id}
                to="/dashboard/messages"
                className="block p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">{m.name}</span>
                  {!m.is_read && <span className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                </div>
                <div className="text-xs text-muted-foreground truncate">{m.category}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  {m.date_created ? new Date(m.date_created).toLocaleString("ar-SA") : ""}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">الأسئلة الشائعة</div>
              <div className="text-2xl font-bold">{faqs.length}</div>
            </div>
            <HelpCircle className="h-8 w-8 text-primary/50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">إجمالي الرسائل</div>
              <div className="text-2xl font-bold">{messages.length}</div>
            </div>
            <Mail className="h-8 w-8 text-accent/50" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
