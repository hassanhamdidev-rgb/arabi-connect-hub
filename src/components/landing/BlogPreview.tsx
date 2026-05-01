import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBlogsList } from "@/hooks/useDirectus";

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) : "";

const BlogPreview = () => {
  const { data: blogs, isLoading } = useBlogsList({ limit: 3 });

  const posts = blogs ?? [];

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="section-container flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="flex items-center justify-between mb-14">
          <div>
            <span className="text-accent font-medium text-sm">المدونة القانونية</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-2">
              أحدث المقالات
            </h2>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              جميع المقالات
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="modern-card block group h-full">
                <div className="h-48 gradient-teal flex items-center justify-center card-sheen">
                  <span className="text-primary-foreground/30 font-heading text-6xl font-bold">{i + 1}</span>
                </div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="chip text-accent border-accent/30 bg-accent/10">{post.category}</span>
                    <span className="chip">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date_created)}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{post.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.excerpt || post.description}</p>
                  <span className="link-btn text-sm">اقرأ المزيد <ArrowLeft className="w-4 h-4" /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
