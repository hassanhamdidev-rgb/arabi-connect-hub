import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { breadcrumbsLd } from "@/lib/seo";
import { useFieldsList, useFieldsCount } from "@/hooks/useDirectus";
import { assetUrl } from "@/lib/directus";
import type { Field } from "@/lib/directus";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 9;

const FieldsPage = () => {
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<Field[]>([]);

  const { data: pageData, isLoading, isFetching, error } = useFieldsList({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const { data: total = 0 } = useFieldsCount();

  useEffect(() => {
    if (!pageData) return;
    setAccumulated((prev) => {
      if (page === 1) return pageData;
      const seen = new Set(prev.map((f) => f.id));
      return [...prev, ...pageData.filter((f) => !seen.has(f.id))];
    });
  }, [pageData, page]);

  const hasMore = accumulated.length < total;

  return (
    <Layout>
      <SEO
        title="مجالات التخصص | مكتب خالد عويد المجنوني للمحاماة"
        description="تعرف على مجالات تخصص مكتب خالد عويد المجنوني."
        path="/fields"
        keywords={["مجالات التخصص", "الخدمات القانونية", "محامي متخصص"]}
        jsonLd={[
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "مجالات التخصص", path: "/fields" },
          ]),
        ]}
      />

      <section className="pt-36 pb-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
            مجالات التخصص
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            تعرف على مجالات التخصص المختلفة التي يغطيها مكتبنا
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="section-container">
          {isLoading && page === 1 && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-12 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">حدث خطأ في التحميل</p>
            </div>
          )}

          {!error && accumulated.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accumulated.map((field, index) => {
                  const img = assetUrl(field.image, { width: 800, fit: "cover" });
                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index % PAGE_SIZE) * 0.05 }}
                    >
                      <Link to={`/fields/${field.id}`}>
                        <div className="modern-card overflow-hidden h-full flex flex-col group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                          <div className="relative h-48 overflow-hidden bg-muted">
                            {img ? (
                              <img
                                src={img}
                                alt={field.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full gradient-teal" />
                            )}
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            {field.type && (
                              <span className="text-xs font-semibold text-accent mb-2 uppercase">
                                {field.type}
                              </span>
                            )}
                            <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                              {field.name}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                              {field.description}
                            </p>
                            <div className="flex items-center gap-2 text-accent font-medium mt-4 group-hover:gap-3 transition-all">
                              <span>اقرأ المزيد</span>
                              <ArrowLeft className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button onClick={() => setPage((p) => p + 1)} size="lg" className="gap-2" disabled={isFetching}>
                    {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                    تحميل المزيد
                  </Button>
                </div>
              )}
            </>
          ) : (
            !isLoading && !error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد مجالات متاحة حالياً</p>
              </div>
            )
          )}
        </div>
      </section>
    </Layout>
  );
};

export default FieldsPage;
