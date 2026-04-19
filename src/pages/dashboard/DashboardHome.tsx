import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Mail, Eye, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { mockArticles, mockMessages, mockUsers } from "@/lib/mockData";
import StatsCharts from "@/components/dashboard/StatsCharts";

const stats = [
  { label: "إجمالي المقالات", value: mockArticles.length, change: "+12%", trend: "up", icon: FileText, color: "text-primary bg-primary/10" },
  { label: "المستخدمون", value: mockUsers.length, change: "+5%", trend: "up", icon: Users, color: "text-accent bg-accent/10" },
  { label: "الرسائل الجديدة", value: mockMessages.filter(m => !m.read).length, change: "+3", trend: "up", icon: Mail, color: "text-blue-600 bg-blue-50" },
  { label: "إجمالي المشاهدات", value: mockArticles.reduce((s, a) => s + a.views, 0).toLocaleString("ar-SA"), change: "-2%", trend: "down", icon: Eye, color: "text-purple-600 bg-purple-50" },
];

const DashboardHome = () => {
  const recentArticles = [...mockArticles].sort((a, b) => b.views - a.views).slice(0, 5);
  const recentMessages = mockMessages.slice(0, 4);

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
                <span className={`text-xs font-medium flex items-center gap-1 ${s.trend === "up" ? "text-green-600" : "text-destructive"}`}>
                  {s.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {s.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <StatsCharts />

      {/* Two-col content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              المقالات الأكثر مشاهدة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentArticles.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.category} • {a.date}</div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                  <Eye className="h-3.5 w-3.5" />
                  {a.views.toLocaleString("ar-SA")}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-accent" />
              أحدث الرسائل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.map((m) => (
              <div key={m.id} className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">{m.name}</span>
                  {!m.read && <span className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                </div>
                <div className="text-xs text-muted-foreground truncate">{m.subject}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">{m.date}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
