import Layout from "@/components/Layout";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import AboutPreview from "@/components/landing/AboutPreview";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import BlogPreview from "@/components/landing/BlogPreview";
import CTASection from "@/components/landing/CTASection";
import MapSection from "@/components/landing/MapSection";
import SEO from "@/components/SEO";
import { organizationLd, websiteLd } from "@/lib/seo";

const Index = () => {
  return (
    <Layout>
      <SEO
        title="خالد عويد المجنوني | محامي واستشارات قانونية بالرياض"
        description="مكتب خالد عويد المجنوني للمحاماة في الرياض. خدمات قانونية للأفراد والشركات: قضايا تجارية، عمالية، وأحوال شخصية بالسعودية."
        path="/"
        keywords={["محامي السعودية", "مكتب محاماة الرياض", "استشارة قانونية مجانية"]}
        jsonLd={[organizationLd, websiteLd]}
      />
      <HeroSection />
      <ServicesSection />
      <AboutPreview />
      <TestimonialsSection />
      <BlogPreview />
      <CTASection />
      <MapSection />
    </Layout>
  );
};

export default Index;
