import Layout from "@/components/Layout";
import ServicesSection from "@/components/landing/ServicesSection";
import CTASection from "@/components/landing/CTASection";
import SEO from "@/components/SEO";
import { breadcrumbsLd, serviceLd } from "@/lib/seo";

const ServicesPage = () => {
  return (
    <Layout>
      <SEO
        title="الخدمات القانونية | محاماة وتقاضي بالرياض"
        description="خدمات قانونية متكاملة: قضايا تجارية، عمالية، أحوال شخصية، صياغة عقود، وتمثيل أمام المحاكم السعودية. احجز استشارتك اليوم."
        path="/services"
        keywords={["خدمات قانونية", "صياغة عقود", "قضايا تجارية", "تمثيل قضائي"]}
        jsonLd={[
          serviceLd(
            "خدمات المحاماة والاستشارات القانونية",
            "تقديم استشارات قانونية وتمثيل قضائي للأفراد والشركات في المملكة العربية السعودية."
          ),
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "الخدمات", path: "/services" },
          ]),
        ]}
      />
      <section className="py-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">خدماتنا القانونية</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            نقدم مجموعة متكاملة من الخدمات القانونية المتخصصة
          </p>
        </div>
      </section>
      <ServicesSection />
      <CTASection />
    </Layout>
  );
};

export default ServicesPage;
