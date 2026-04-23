import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import CTASection from "@/components/landing/CTASection";
import SEO from "@/components/SEO";
import { breadcrumbsLd, serviceLd } from "@/lib/seo";
import { useServices } from "@/hooks/useDirectus";
import { Loader2, Scale, User, Briefcase } from "lucide-react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

type FilterType = "individual" | "business" | undefined;

const labels: Record<NonNullable<FilterType>, { title: string; tagline: string; eyebrow: string; Icon: typeof User }> = {
  individual: {
    title: "خدمات الأفراد",
    tagline: "حلول قانونية تناسب احتياجاتك الشخصية والعائلية",
    eyebrow: "للأفراد",
    Icon: User,
  },
  business: {
    title: "خدمات الأعمال والشركات",
    tagline: "استشارات وعقود متخصصة لشركتك ومنشأتك",
    eyebrow: "للشركات",
    Icon: Briefcase,
  },
};

const ServicesPage = () => {
  const params = useParams<{ type?: string }>();
  const filter: FilterType =
    params.type === "individual" || params.type === "business" ? params.type : undefined;

  const { data, isLoading } = useServices();

  const services = useMemo(() => {
    const list = (data ?? []).filter((s) => s.status === "active");
    if (!filter) return list;
    return list.filter((s) => (s.type ?? "").toLowerCase() === filter);
  }, [data, filter]);

  const heading = filter ? labels[filter] : {
    title: "خدماتنا القانونية",
    tagline: "نقدم مجموعة متكاملة من الخدمات القانونية المتخصصة",
    eyebrow: "خدماتنا",
    Icon: Scale,
  };

  const path = filter ? `/services/${filter}` : "/services";

  return (
    <Layout>
      <SEO
        title={`${heading.title} | محاماة وتقاضي بالرياض`}
        description={`${heading.tagline}. احجز استشارتك اليوم مع مكتب خالد عويد المجنوني.`}
        path={path}
        keywords={["خدمات قانونية", filter === "business" ? "قانون شركات" : "قضايا أفراد", "محامي الرياض"]}
        jsonLd={[
          serviceLd(heading.title, heading.tagline),
          breadcrumbsLd(
            filter
              ? [
                  { name: "الرئيسية", path: "/" },
                  { name: "الخدمات", path: "/services" },
                  { name: heading.eyebrow, path },
                ]
              : [
                  { name: "الرئيسية", path: "/" },
                  { name: "الخدمات", path: "/services" },
                ]
          ),
        ]}
      />

      <section className="pt-36 pb-16 gradient-teal">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 mb-4">
            <heading.Icon className="w-3.5 h-3.5 text-accent" />
            <span className="text-primary-foreground/90 text-xs font-medium">{heading.eyebrow}</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-3">
            {heading.title}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">{heading.tagline}</p>

          {/* Tabs */}
          <div className="mt-8 inline-flex p-1 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 gap-1">
            {[
              { label: "الكل", to: "/services", active: !filter },
              { label: "فردي", to: "/services/individual", active: filter === "individual" },
              { label: "أعمال", to: "/services/business", active: filter === "business" },
            ].map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  t.active
                    ? "bg-accent text-accent-foreground shadow"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="section-container">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">
              لا توجد خدمات متاحة في هذه الفئة حالياً.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => {
                const IconCmp =
                  (service.icon &&
                    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[service.icon]) ||
                  Scale;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/services`} className="modern-card p-6 block group h-full">
                      <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <IconCmp className="w-7 h-7 text-secondary-foreground" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                            {service.name}
                          </h3>
                          {service.type && (
                            <span className="chip text-[10px]">{service.type === "business" ? "أعمال" : service.type === "individual" ? "فردي" : service.type}</span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                          {service.description}
                        </p>
                        <span className="link-btn text-sm">
                          اعرف المزيد <Scale className="w-4 h-4" />
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

      <CTASection />
    </Layout>
  );
};

export default ServicesPage;
