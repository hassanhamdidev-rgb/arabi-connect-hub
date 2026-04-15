import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const posts = [
  { id: "1", title: "حقوقك القانونية عند الفصل التعسفي", category: "قضايا العمل", date: "15 أبريل 2026", excerpt: "تعرف على حقوقك القانونية في حالة الفصل التعسفي وكيفية المطالبة بالتعويض المناسب." },
  { id: "2", title: "كيف تحمي حقوقك في العقود التجارية", category: "القضايا التجارية", date: "10 أبريل 2026", excerpt: "دليل شامل لأهم النقاط التي يجب مراعاتها عند توقيع العقود التجارية." },
  { id: "3", title: "إجراءات رفع الدعوى في المحاكم السعودية", category: "إجراءات قانونية", date: "5 أبريل 2026", excerpt: "شرح مبسط للإجراءات المطلوبة لرفع دعوى قضائية في المملكة العربية السعودية." },
];

const BlogPreview = () => {
  return (
    <section className="py-20 bg-muted">
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
              <Link to={`/blog/${post.id}`} className="glass-card rounded-xl overflow-hidden block group hover:shadow-xl transition-all">
                <div className="h-48 gradient-teal flex items-center justify-center">
                  <span className="text-primary-foreground/30 font-heading text-6xl font-bold">{post.id}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">{post.category}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
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
