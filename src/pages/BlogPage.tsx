import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { breadcrumbsLd, SITE_URL } from "@/lib/seo";
import { useBlogs } from "@/hooks/useDirectus";
import { assetUrl } from "@/lib/directus";

const blogListLd = (posts: { id: string | number; title: string; category: string; excerpt: string }[]) => ({
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

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) : "";

const BlogPage = () => {
  const { data, isLoading } = useBlogs();
  const posts = (data ?? []).filter((p) => p.status === "published");

  return (
    <Layout>
      <SEO
        title="المدونة القانونية | مقالات ونصائح من محامين"
        description="مقالات قانونية متخصصة في قانون العمل، التجاري، الأحوال الشخصية والتحكيم بالسعودية. تحديثات وتفسيرات من خبراء المكتب."
        path="/blog"
        keywords={["مدونة قانونية", "مقالات قانون سعودي", "نصائح محامي"]}
        jsonLd={[
          blogListLd(
            posts.map((p) => ({
              id: p.slug || p.id,
              title: p.name,
              category: p.category,
              excerpt: p.excerpt ?? p.description ?? "",
            }))
          ),
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
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">لا توجد مقالات منشورة حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => {
                const cover = post.files?.[0] ? assetUrl(String(post.files[0]), { width: 800 }) : undefined;
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="glass-card rounded-xl overflow-hidden block group hover:shadow-xl transition-all h-full"
                    >
                      <div className="h-44 gradient-teal flex items-center justify-center overflow-hidden">
                        {cover ? (
                          <img src={cover} alt={post.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        ) : (
                          <span className="text-primary-foreground/20 font-heading text-7xl font-bold">{post.id}</span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">{post.category}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(post.date_created)}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {post.name}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt ?? post.description}
                        </p>
                        <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          اقرأ المزيد <ArrowLeft className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
