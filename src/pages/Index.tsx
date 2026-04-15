import Layout from "@/components/Layout";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import AboutPreview from "@/components/landing/AboutPreview";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import BlogPreview from "@/components/landing/BlogPreview";
import CTASection from "@/components/landing/CTASection";
import MapSection from "@/components/landing/MapSection";

const Index = () => {
  return (
    <Layout>
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
