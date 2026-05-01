import { useParams, Link, Navigate } from "react-router-dom";
import { useFieldById, useRelatedFields } from "@/hooks/useDirectus";
import { assetUrl } from "@/lib/directus";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { breadcrumbsLd } from "@/lib/seo";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FieldPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: field, isLoading, error } = useFieldById(slug);
  const { data: items = [] } = useRelatedFields(field?.id, 3);

  if (isLoading) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </Layout>
    );
  }

  if (error || !field) return <Navigate to="/fields" replace />;

  const img = assetUrl(field.image, { width: 1600, fit: "cover" });

  return (
    <Layout>
      <SEO
        title={`${field.name} | مكتب خالد عويد المجنوني للمحاماة`}
        description={field.description}
        path={`/fields/${field.id}`}
        keywords={[field.name, field.type, "محاماة"]}
        jsonLd={[
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "المجالات", path: "/fields" },
            { name: field.name, path: `/fields/${field.id}` },
          ]),
        ]}
      />

      <section className="bg-muted/30 py-4">
        <div className="section-container">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">الرئيسية</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground rotate-180" />
            <Link to="/fields" className="text-muted-foreground hover:text-foreground">المجالات</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground rotate-180" />
            <span className="text-foreground font-medium">{field.name}</span>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            {field.type && (
              <div className="inline-block mb-4">
                <span className="text-xs font-semibold text-accent uppercase px-3 py-1 bg-accent/10 rounded-full">
                  {field.type}
                </span>
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">{field.name}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{field.description}</p>
          </motion.div>
        </div>
      </section>

      {img && (
        <section className="py-12">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img src={img} alt={field.name} className="w-full h-96 object-cover" />
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-20 bg-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {field.content}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">هل تحتاج للمساعدة؟</h2>
            <p className="text-muted-foreground mb-8">
              اتصل بنا اليوم للحصول على استشارة قانونية متخصصة في مجال {field.name}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link to="/contact" className="gap-2">
                  اطلب استشارة
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">المجالات الأخرى</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((related, index) => {
                const rImg = assetUrl(related.image, { width: 600, fit: "cover" });
                return (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/fields/${related.id}`}>
                      <div className="modern-card overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow">
                        <div className="relative h-40 overflow-hidden bg-muted">
                          {rImg ? (
                            <img
                              src={rImg}
                              alt={related.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full gradient-teal" />
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                            {related.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                            {related.description}
                          </p>
                          <div className="flex items-center gap-2 text-accent font-medium mt-3 group-hover:gap-3 transition-all">
                            <span>اقرأ المزيد</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FieldPostPage;
