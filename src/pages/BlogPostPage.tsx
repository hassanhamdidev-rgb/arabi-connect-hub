import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, User, ArrowRight, Share2, MessageCircle, Loader2, BookOpen } from "lucide-react";
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
import { useBlogBySlug, useRelatedBlogs, useIncrementBlogViews } from "@/hooks/useDirectus";
import { useAuth } from "@/hooks/useAuth";
import { assetUrl, normalizeFileIds } from "@/lib/directus";
import MediaRenderer from "@/components/MediaRenderer";
import { useEffect } from "react";

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) : "";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = useBlogBySlug(slug);
  const { data: related = [] } = useRelatedBlogs(post?.id, 5);
  const { mutate: incrementViews } = useIncrementBlogViews();
  const { isAuthenticated } = useAuth();

  // Increment views when post is loaded (only if user is authenticated)
  useEffect(() => {
    if (post && post.id && isAuthenticated) {
      incrementViews(post.id);
    }
  }, [post?.id, isAuthenticated, incrementViews]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!post) return <Navigate to="/blog" replace />;

  const fileIds = normalizeFileIds(post.files);
  const cover = fileIds[0] ? assetUrl(fileIds[0], { width: 1600 }) : undefined;

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
          <br />
          <span className="inline-flex items-center gap-1.5 text-xs bg-accent text-accent-foreground px-3 py-1 rounded-full font-medium mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            نوع المدونة: {post.category}
          </span>
          <h1 className="font-heading text-xl sm:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            {post.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(post.date_created)}</span>
            {post.reading_time && <span> مدة القراءة: {post.reading_time}</span>}
          </div>
        </div>
      </section>

      {fileIds.length > 0 && (
        <section className="py-12 bg-background">
          <div className="section-container">
            <Carousel opts={{ loop: true, direction: "rtl" }} className="max-w-5xl mx-auto">
              <CarouselContent>
                {fileIds.slice(0, 6).map((fileId, i) => {
                  const fileUrl = assetUrl(fileId);
                  const fileExt = fileId.split('.').pop()?.toLowerCase() || '';
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);
                  const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(fileExt);
                  const isAudio = ['mp3', 'wav', 'ogg', 'm4a'].includes(fileExt);
                  // Default to image when extension can't be inferred from a UUID
                  const treatAsImage = isImage || (!isVideo && !isAudio);

                  return (
                    <CarouselItem key={i} className="md:basis-2/3 lg:basis-1/2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="modern-card overflow-hidden"
                      >
                        {treatAsImage && (
                          <img
                            src={fileUrl}
                            alt={`${post.name} ${i + 1}`}
                            className="w-full aspect-[16/10] object-cover rounded-2xl"
                            loading="lazy"
                          />
                        )}
                        {isVideo && (
                          <video
                            src={fileUrl}
                            controls
                            className="w-full aspect-[16/10] rounded-2xl bg-black"
                          />
                        )}
                        {isAudio && (
                          <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 aspect-[16/10] flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M18.285 1.993a.75.75 0 00-1.04.177c-1.37 1.873-2.72 3.795-3.8 5.633-1.056 1.797-1.844 3.483-2.222 4.871-.378-1.388-1.166-3.074-2.222-4.871-1.08-1.838-2.43-3.76-3.8-5.633a.75.75 0 10-1.217.863c1.34 1.828 2.636 3.642 3.668 5.398.957 1.636 1.69 3.179 2.121 4.55.352-1.25.97-2.702 1.831-4.246 1.077-1.85 2.397-3.76 3.73-5.578a.75.75 0 00-.176-1.041zM10 9.5c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.015-4.5-4.5-4.5z" />
                                </svg>
                              </div>
                              <audio
                                src={fileUrl}
                                controls
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                        {!treatAsImage && !isVideo && !isAudio && (
                          <div className="bg-muted rounded-2xl p-8 aspect-[16/10] flex items-center justify-center flex-col gap-4">
                            <svg className="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <a
                              href={fileUrl}
                              download
                              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v6m0 0v2m0-2h2m-2 0H2m16-6v6m0 0v2m0-2h2m-2 0h-2M4 12a8 8 0 018-8m8 8a8 8 0 01-8 8m0-16a8 8 0 018 8m-8-8a8 8 0 00-8 8m0 0H2m20 0h2" />
                              </svg>
                              تحميل الملف
                            </a>
                          </div>
                        )}
                      </motion.div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </section>
      )}

      <section className="py-12 bg-background">
        <div className="section-container ">
          {/* {(post.excerpt || post.description) && (
            <div className="modern-card rounded-xl p-6 mb-8 border-r-4 border-primary bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">وصف المقال</div>
              <p className="text-foreground text-base leading-relaxed font-medium">{post.excerpt || post.description}</p>
            </div>
          )} */}
          {(post.excerpt || post.description) && (
  <div className="relative mb-8 pr-6 py-5 rounded-lg bg-muted/40 border-r-4 border-primary shadow-sm hover:shadow-md transition">
    
    {/* subtle accent line glow */}
    <span className="absolute right-0 top-0 h-full w-1 bg-primary/60 rounded-r-lg border-r-orange-200"></span>

    <div className="text-xs font-semibold text-primary mb-2 tracking-wide">
      وصف المقال
    </div>

    <p className="text-foreground/90 text-base leading-relaxed">
      {post.excerpt || post.description}
    </p>
  </div>
)}
          {post.tl_dr && (
            <div className="glass-card rounded-xl p-5 mb-8 border-r-4 border-accent">
              <div className="text-xs font-bold text-accent mb-1">ملخص المدونة</div>
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
          <a
  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
  target="_blank"
>
   <Button variant="outline" size="sm">فيسبوك</Button>
</a>
<a
  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.description)}`}
  target="_blank"
>
   <Button variant="outline" size="sm">تويتر</Button>
</a>
           <a
  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
  target="_blank"
>
  <Button variant="outline" size="sm">لنكدان</Button>
</a>
           <a
  href={`https://wa.me/?text=${encodeURIComponent(post.description + " " + window.location.href)}`}
  target="_blank"
>
              <Button variant="outline" size="sm" className="gap-2"><MessageCircle className="h-4 w-4" /> واتساب</Button>

</a>
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
                  const rIds = normalizeFileIds(p.files);
                  const rCover = rIds[0] ? assetUrl(rIds[0], { width: 600 }) : undefined;
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
