import { useParams, Link, Navigate } from "react-router-dom";
import { useServices } from "@/hooks/useDirectus";
import { assetUrl } from "@/lib/directus";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { breadcrumbsLd, serviceLd } from "@/lib/seo";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Clock, DollarSign, Briefcase, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ServicePostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: items = [], isLoading, error } = useServices();

  const service = items.find(
    (s) => s.slug === slug && s.status === "active"
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </Layout>
    );
  }

  if (error || !service) return <Navigate to="/services" replace />;

  const img = assetUrl(service.image, { width: 1600, fit: "cover" });
  const serviceTypeLabel = service.type === "business" ? "للشركات" : "للأفراد";
  const serviceTypeArabic = service.type === "business" ? "خدمات الأعمال والشركات" : "خدمات الأفراد";

  // Parse FAQs if it's a JSON string
  let faqs = [];
  if (service.faqs) {
    try {
      faqs = typeof service.faqs === "string" ? JSON.parse(service.faqs) : service.faqs;
      if (!Array.isArray(faqs)) faqs = [];
    } catch {
      faqs = [];
    }
  }

  return (
    <Layout>
      <SEO
        title={`${service.meta_title || service.name} | محاماة وتقاضي بالرياض`}
        description={service.meta_description || service.description}
        path={`/service/${service.slug}`}
        keywords={[service.name, serviceTypeArabic, "محامي الرياض", "استشارة قانونية"]}
        jsonLd={[
          serviceLd(service.name, service.description),
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "الخدمات", path: "/services" },
            { name: service.name, path: `/service/${service.slug}` },
          ]),
        ]}
      />

      {/* Breadcrumb */}
      <section className="bg-muted/30 py-4">
        <div className="section-container">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">الرئيسية</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground rotate-180" />
            <Link to="/services" className="text-muted-foreground hover:text-foreground">الخدمات</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground rotate-180" />
            <span className="text-foreground font-medium">{service.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="inline-block mb-4">
              <span className="text-xs font-semibold text-accent uppercase px-3 py-1 bg-accent/10 rounded-full">
                {serviceTypeLabel}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">{service.name}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{service.description}</p>

            {/* Service Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {service.price && (
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <DollarSign className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">التكلفة</p>
                    <p className="font-semibold text-foreground">{service.price}</p>
                  </div>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">المدة</p>
                    <p className="font-semibold text-foreground">{service.duration}</p>
                  </div>
                </div>
              )}
              {service.type && (
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <Briefcase className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">النوع</p>
                    <p className="font-semibold text-foreground">{serviceTypeArabic}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Image */}
      {img && (
        <section className="py-12">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img src={img} alt={service.name} className="w-full h-96 object-cover" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Service Summary */}
      {service.tl_dr && (
        <section className="py-16 bg-primary/5">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">ملخص الخدمة</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {service.tl_dr}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {faqs.length > 0 && (
        <section className="py-20 bg-background">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-foreground mb-12 text-center">الأسئلة الشائعة</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq: any, index: number) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-right">
                      {faq.question || faq.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-right">
                      {faq.answer || faq.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">هل تحتاج للمساعدة؟</h2>
            <p className="text-muted-foreground mb-8">
              اتصل بنا اليوم للحصول على استشارة قانونية متخصصة في خدمة {service.name}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link to="/contact" className="gap-2">
                  اطلب استشارة
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/services">
                  الخدمات الأخرى
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">خدمات ذات صلة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items
              .filter((s) => s.id !== service.id && s.status === "active" && s.type === service.type)
              .slice(0, 3)
              .map((related, index) => {
                const rImg = assetUrl(related.image, { width: 600, fit: "cover" });
                return (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/service/${related.slug}`}>
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

export default ServicePostPage;
