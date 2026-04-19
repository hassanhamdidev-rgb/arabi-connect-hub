import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, User, ArrowRight, Share2, MessageCircle } from "lucide-react";
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

const posts = [
  { id: "1", title: "حقوقك القانونية عند الفصل التعسفي", category: "قضايا العمل", date: "15 أبريل 2026", author: "خالد المجنوني", excerpt: "تعرف على حقوقك القانونية في حالة الفصل التعسفي." },
  { id: "2", title: "كيف تحمي حقوقك في العقود التجارية", category: "القضايا التجارية", date: "10 أبريل 2026", author: "خالد المجنوني", excerpt: "دليل شامل لأهم النقاط في العقود التجارية." },
  { id: "3", title: "إجراءات رفع الدعوى في المحاكم السعودية", category: "إجراءات قانونية", date: "5 أبريل 2026", author: "خالد المجنوني", excerpt: "شرح مبسط للإجراءات المطلوبة." },
  { id: "4", title: "حقوق المرأة في نظام الأحوال الشخصية", category: "أحوال شخصية", date: "1 أبريل 2026", author: "خالد المجنوني", excerpt: "نظرة شاملة على حقوق المرأة." },
  { id: "5", title: "التحكيم التجاري كبديل للتقاضي", category: "تحكيم", date: "28 مارس 2026", author: "خالد المجنوني", excerpt: "مزايا التحكيم التجاري." },
  { id: "6", title: "حماية الملكية الفكرية في السعودية", category: "ملكية فكرية", date: "25 مارس 2026", author: "خالد المجنوني", excerpt: "كيفية حماية علاماتك التجارية." },
];

const galleryGradients = [
  "linear-gradient(135deg, hsl(var(--teal)) 0%, hsl(var(--teal-dark)) 100%)",
  "linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--gold-dark)) 100%)",
  "linear-gradient(135deg, hsl(var(--teal-light)) 0%, hsl(var(--gold)) 100%)",
];

const BlogPostPage = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);
  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.id !== id).slice(0, 5);

  return (
    <Layout>
      <SEO
        title={`${post.title} | المدونة القانونية`}
        description={post.excerpt}
        path={`/blog/${post.id}`}
        type="article"
        author={post.author}
        keywords={[post.category, "مقال قانوني", "محامي السعودية"]}
        jsonLd={[
          articleLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.id}`,
            author: post.author,
          }),
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "المدونة", path: "/blog" },
            { name: post.title, path: `/blog/${post.id}` },
          ]),
        ]}
      />
      {/* Hero */}
      <section className="py-16 gradient-teal">
        <div className="section-container">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 text-sm">
            <ArrowRight className="h-4 w-4" /> العودة للمدونة
          </Link>
          <span className="inline-block text-xs bg-accent text-accent-foreground px-3 py-1 rounded-full font-medium mb-4">
            {post.category}
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date}</span>
          </div>
        </div>
      </section>

      {/* Modern Carousel */}
      <section className="py-12 bg-background">
        <div className="section-container">
          <Carousel opts={{ loop: true, direction: "rtl" }} className="max-w-5xl mx-auto">
            <CarouselContent>
              {galleryGradients.map((g, i) => (
                <CarouselItem key={i} className="md:basis-2/3 lg:basis-1/2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="aspect-[16/10] rounded-2xl shadow-xl overflow-hidden flex items-end p-8 relative"
                    style={{ background: g }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="relative text-primary-foreground">
                      <div className="text-xs opacity-80 mb-1">صورة {i + 1}</div>
                      <div className="font-heading font-bold text-xl">{post.title}</div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Article body */}
      <section className="py-12 bg-background">
        <div className="section-container max-w-3xl">
          <article className="prose prose-lg max-w-none text-foreground leading-loose">
            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
            <p className="mb-4">
              يعد هذا المجال من أهم المجالات القانونية التي تتطلب خبرة عميقة وفهمًا دقيقًا للأنظمة واللوائح المعمول بها في المملكة العربية السعودية.
              نقدم لكم في هذا المقال شرحًا تفصيليًا لأبرز الجوانب التي يجب الانتباه إليها.
            </p>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-4 text-primary">النقاط الرئيسية</h2>
            <ul className="space-y-2 list-disc pr-6">
              <li>فهم الإطار القانوني الحاكم للقضية</li>
              <li>توثيق جميع الإجراءات والمراسلات</li>
              <li>الاستعانة بمحامٍ متخصص في وقت مبكر</li>
              <li>معرفة المواعيد النظامية والمدد القانونية</li>
            </ul>
            <h2 className="font-heading text-2xl font-bold mt-8 mb-4 text-primary">الخلاصة</h2>
            <p>
              ننصح بالتواصل مع مكتبنا للحصول على استشارة قانونية مخصصة لحالتكم، حيث نملك الخبرة الكافية للتعامل مع مختلف القضايا بكفاءة عالية.
            </p>
          </article>

          {/* Share */}
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

      {/* Related */}
      <section className="py-12 bg-muted/30">
        <div className="section-container">
          <h2 className="font-heading text-2xl font-bold mb-6 text-foreground">مقالات ذات صلة</h2>
          <Carousel opts={{ align: "start", direction: "rtl" }}>
            <CarouselContent>
              {related.map((p) => (
                <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/3">
                  <Link to={`/blog/${p.id}`} className="glass-card rounded-xl overflow-hidden block group hover:shadow-xl transition-all h-full">
                    <div className="h-32 gradient-teal flex items-center justify-center">
                      <span className="text-primary-foreground/20 font-heading text-5xl font-bold">{p.id}</span>
                    </div>
                    <div className="p-5">
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                      <h3 className="font-heading font-bold text-foreground mt-2 group-hover:text-primary transition-colors">{p.title}</h3>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostPage;
