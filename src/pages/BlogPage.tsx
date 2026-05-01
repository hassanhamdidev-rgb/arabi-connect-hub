import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, ArrowLeft, Loader2, ChevronDown, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { breadcrumbsLd, SITE_URL } from "@/lib/seo";
import { useBlogsList, useBlogsCount, useIncrementBlogViews } from "@/hooks/useDirectus";
import { useAuth } from "@/hooks/useAuth";
import MediaRenderer from "@/components/MediaRenderer";
import type { Blog } from "@/lib/directus";

const PAGE_SIZE = 6;

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
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<Blog[]>([]);

  const { data: pageData, isLoading, isFetching, error, isError, refetch } = useBlogsList({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const { data: total = 0 } = useBlogsCount();
  const { mutate: incrementViews } = useIncrementBlogViews();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!pageData) return;
    setAccumulated((prev) => {
      if (page === 1) return pageData;
      const seen = new Set(prev.map((p) => p.id));
      return [...prev, ...pageData.filter((p) => !seen.has(p.id))];
    });
  }, [pageData, page]);

  const hasMore = accumulated.length < total;
  const handleLoadMore = () => setPage((p) => p + 1);

  const handleBlogClick = (postId: number) => {
    if (isAuthenticated) incrementViews(postId);
  };

  return (
    <Layout>
      <SEO
        title="المدونة القانونية | مقالات ونصائح من محامين"
        description="مقالات قانونية متخصصة في قانون العمل، التجاري، الأحوال الشخصية والتحكيم بالسعودية. تحديثات وتفسيرات من خبراء المكتب."
        path="/blog"
        keywords={["مدونة قانونية", "مقالات قانون سعودي", "نصائح محامي"]}
        jsonLd={[
          blogListLd(
            accumulated.map((p) => ({
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
      <section className="pt-36 pb-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">المدونة القانونية</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            مقالات قانونية متخصصة لتثقيفكم ومساعدتكم في فهم حقوقكم
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="section-container">
          {isLoading && page === 1 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-6 max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">خطأ في تحميل المقالات</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {error?.message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً."}
                </p>
                <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  حاول مرة أخرى
                </Button>
              </div>
            </div>
          ) : accumulated.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">لا توجد مقالات منشورة حالياً.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accumulated.map((post, i) => {
                  const firstFile = post.files?.[0];
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % PAGE_SIZE) * 0.05 }}
                    >
                      <Link
                        to={`/blog/${post.slug || post.id}`}
                        className="modern-card block group h-full"
                        onClick={() => handleBlogClick(post.id)}
                      >
                        <div className="h-48 overflow-hidden card-sheen">
                          {firstFile ? (
                            <MediaRenderer fileId={firstFile} alt={post.name} className="h-full" />
                          ) : (
                            <div className="h-full gradient-teal flex items-center justify-center">
                              <span className="text-primary-foreground/20 font-heading text-7xl font-bold">{post.id}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 relative z-10">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="chip text-accent border-accent/30 bg-accent/10">{post.category}</span>
                            <span className="chip">
                              <Calendar className="w-3 h-3" /> {formatDate(post.date_created)}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                            {post.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt ?? post.description}
                          </p>
                          <span className="link-btn text-sm">
                            اقرأ المزيد <ArrowLeft className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button onClick={handleLoadMore} size="lg" className="gap-2" disabled={isFetching}>
                    {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                    تحميل المزيد من المقالات
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
