import Layout from "@/components/Layout";
import ServicesSection from "@/components/landing/ServicesSection";
import CTASection from "@/components/landing/CTASection";

const ServicesPage = () => {
  return (
    <Layout>
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
