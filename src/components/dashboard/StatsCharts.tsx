import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Blog, ContactMessage, Service } from "@/lib/directus";

interface Props {
  blogs: Blog[];
  messages: ContactMessage[];
  services: Service[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--gold))",
  "hsl(var(--teal-light))",
  "hsl(var(--gold-dark))",
];

const DAY_LABELS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function buildLast7Days(blogs: Blog[], messages: ContactMessage[]) {
  const today = new Date();
  const days: { day: string; views: number; messages: number; key: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ day: DAY_LABELS[d.getDay()], views: 0, messages: 0, key });
  }
  const map = new Map(days.map((d) => [d.key, d]));

  for (const b of blogs) {
    if (!b.date_created) continue;
    const k = b.date_created.slice(0, 10);
    const row = map.get(k);
    if (row) row.views += b.views ?? 0;
  }
  for (const m of messages) {
    if (!m.date_created) continue;
    const k = m.date_created.slice(0, 10);
    const row = map.get(k);
    if (row) row.messages += 1;
  }
  return days;
}

function buildCategoryData(blogs: Blog[]) {
  const counts = new Map<string, number>();
  for (const b of blogs) {
    const key = b.category?.trim() || "غير مصنف";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

const StatsCharts = ({ blogs, messages, services }: Props) => {
  const trendData = buildLast7Days(blogs, messages);
  const categoryData = buildCategoryData(blogs);
  const hasCategoryData = categoryData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            المشاهدات والرسائل (آخر 7 أيام)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gMsgs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="views" name="المشاهدات" stroke="hsl(var(--primary))" fill="url(#gViews)" strokeWidth={2} />
              <Area type="monotone" dataKey="messages" name="الرسائل" stroke="hsl(var(--accent))" fill="url(#gMsgs)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            توزيع التصنيفات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasCategoryData ? (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
              لا توجد بيانات بعد
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            أعلى المقالات مشاهدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {blogs.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
              لا توجد مقالات بعد
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={[...blogs]
                  .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
                  .slice(0, 7)
                  .map((b) => ({ name: b.name?.length > 18 ? b.name.slice(0, 18) + "…" : b.name, views: b.views ?? 0 }))}
                margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="views" name="المشاهدات" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCharts;
