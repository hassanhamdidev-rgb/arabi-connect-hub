import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, User, ArrowRight, Share2, MessageCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SEO from "@/components/SEO";
import { articleLd, breadcrumbsLd } from "@/lib/seo";
import { useBlogs } from "@/hooks/useDirectus";
import { assetUrl } from "@/lib/directus";
import MediaRenderer from "@/components/MediaRenderer";

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) : "";

const BlogPostPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useBlogs();
  const posts = (data ?? []).filter((p) => p.status === "published");

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const post = posts.find((p) => p.slug === id || String(p.id) === id);
  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.id !== post.id).slice(0, 5);
  const cover = post.files?.[0] ? assetUrl(String(post.files[0]), { width: 1600 }) : undefined;

  return (
    <Layout>
      <SEO
        title={`${post.meta_title || post.name} | المدونة القانونية`}
        description={post.meta_description || post.excerpt || post.description}
        path={`/blog/${post.slug || post.id}`}
        type="article"
        author={post.author}
        image={cover}
        keywords={[post.category, post.tag, "مقال قانوني"].filter(Boolean) as string[]}
        jsonLd={[
          articleLd({
            title: post.name,
            description: post.excerpt || post.description,
            path: `/blog/${post.slug || post.id}`,
            author: post.author,
            image: cover,
          }),
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "المدونة", path: "/blog" },
            { name: post.name, path: `/blog/${post.slug || post.id}` },
          ]),
        ]}
      />
      <section className="pt-32 pb-16 gradient-teal">
        <div className="section-container">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 text-sm">
            <ArrowRight className="h-4 w-4" /> العودة للمدونة
          </Link>
          <span className="inline-block text-xs bg-accent text-accent-foreground px-3 py-1 rounded-full font-medium mb-4">
            {post.category}
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            {post.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(post.date_created)}</span>
            {post.reading_time && <span>· {post.reading_time} د قراءة</span>}
          </div>
        </div>
      </section>

      {(post.files?.length ?? 0) > 0 && (
        <section className="py-12 bg-background">
          <div className="section-container">
            <Carousel opts={{ loop: true, direction: "rtl" }} className="max-w-5xl mx-auto">
              <CarouselContent>
                {(post.files ?? []).slice(0, 6).map((fileId, i) => (
                  <CarouselItem key={i} className="md:basis-2/3 lg:basis-1/2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="modern-card overflow-hidden"
                    >
                      <MediaRenderer
                        fileId={fileId}
                        alt={`${post.name} ${i + 1}`}
                        className="aspect-[16/10] rounded-2xl"
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </section>
      )}

      <section className="py-12 bg-background">
        <div className="section-container max-w-3xl">
          {post.tl_dr && (
            <div className="glass-card rounded-xl p-5 mb-8 border-r-4 border-accent">
              <div className="text-xs font-bold text-accent mb-1">باختصار</div>
              <p className="text-foreground text-sm leading-relaxed">{post.tl_dr}</p>
            </div>
          )}
          <article
            className="prose prose-lg max-w-none text-foreground leading-loose prose-headings:font-heading prose-headings:text-primary prose-a:text-accent"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4" /> شارك المقال:
            </span>
            <Button variant="outline" size="sm">فيسبوك</Button>
            <Button variant="outline" size="sm">تويتر</Button>
            <Button variant="outline" size="sm" className="gap-2"><MessageCircle className="h-4 w-4" /> واتساب</Button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="section-container">
            <h2 className="font-heading text-2xl font-bold mb-6 text-foreground">مقالات ذات صلة</h2>
            <Carousel opts={{ align: "start", direction: "rtl" }}>
              <CarouselContent>
                {related.map((p) => {
                  const rCover = p.files?.[0] ? assetUrl(String(p.files[0]), { width: 600 }) : undefined;
                  return (
                    <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/3">
                      <Link to={`/blog/${p.slug || p.id}`} className="glass-card rounded-xl overflow-hidden block group hover:shadow-xl transition-all h-full">
                        <div className="h-32 gradient-teal flex items-center justify-center overflow-hidden">
                          {rCover ? (
                            <img src={rCover} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <span className="text-primary-foreground/20 font-heading text-5xl font-bold">{p.id}</span>
                          )}
                        </div>
                        <div className="p-5">
                          <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                          <h3 className="font-heading font-bold text-foreground mt-2 group-hover:text-primary transition-colors line-clamp-2">{p.name}</h3>
                        </div>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPostPage;
