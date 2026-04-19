import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { breadcrumbsLd, SITE_URL } from "@/lib/seo";

const blogListLd = (posts: { id: string; title: string; category: string; excerpt: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "المدونة القانونية",
  url: `${SITE_URL}/blog`,
  inLanguage: "ar-SA",
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    url: `${SITE_URL}/blog/${p.id}`,
    articleSection: p.category,
    description: p.excerpt,
  })),
});

const posts = [
  { id: "1", title: "حقوقك القانونية عند الفصل التعسفي", category: "قضايا العمل", date: "15 أبريل 2026", excerpt: "تعرف على حقوقك القانونية في حالة الفصل التعسفي وكيفية المطالبة بالتعويض المناسب وفق نظام العمل السعودي." },
  { id: "2", title: "كيف تحمي حقوقك في العقود التجارية", category: "القضايا التجارية", date: "10 أبريل 2026", excerpt: "دليل شامل لأهم النقاط التي يجب مراعاتها عند توقيع العقود التجارية لحماية مصالحك." },
  { id: "3", title: "إجراءات رفع الدعوى في المحاكم السعودية", category: "إجراءات قانونية", date: "5 أبريل 2026", excerpt: "شرح مبسط للإجراءات المطلوبة لرفع دعوى قضائية في المملكة العربية السعودية." },
  { id: "4", title: "حقوق المرأة في نظام الأحوال الشخصية", category: "أحوال شخصية", date: "1 أبريل 2026", excerpt: "نظرة شاملة على حقوق المرأة في نظام الأحوال الشخصية السعودي الجديد." },
  { id: "5", title: "التحكيم التجاري كبديل للتقاضي", category: "تحكيم", date: "28 مارس 2026", excerpt: "مزايا التحكيم التجاري وكيف يمكن أن يوفر وقتاً وجهداً مقارنة بالتقاضي التقليدي." },
  { id: "6", title: "حماية الملكية الفكرية في السعودية", category: "ملكية فكرية", date: "25 مارس 2026", excerpt: "كيفية حماية علاماتك التجارية وبراءات اختراعك وحقوق النشر في المملكة." },
];

const BlogPage = () => {
  return (
    <Layout>
      <SEO
        title="المدونة القانونية | مقالات ونصائح من محامين"
        description="مقالات قانونية متخصصة في قانون العمل، التجاري، الأحوال الشخصية والتحكيم بالسعودية. تحديثات وتفسيرات من خبراء المكتب."
        path="/blog"
        keywords={["مدونة قانونية", "مقالات قانون سعودي", "نصائح محامي"]}
        jsonLd={[
          blogListLd(posts),
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "المدونة", path: "/blog" },
          ]),
        ]}
      />
      <section className="py-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">المدونة القانونية</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            مقالات قانونية متخصصة لتثقيفكم ومساعدتكم في فهم حقوقكم
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.id}`} className="glass-card rounded-xl overflow-hidden block group hover:shadow-xl transition-all h-full">
                  <div className="h-44 gradient-teal flex items-center justify-center">
                    <span className="text-primary-foreground/20 font-heading text-7xl font-bold">{post.id}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">{post.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      اقرأ المزيد <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
