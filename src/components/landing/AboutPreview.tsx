import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "فريق من المحامين المتخصصين والمؤهلين",
  "نسبة نجاح مرتفعة في القضايا",
  "سرية تامة ومعاملة احترافية",
];

const AboutPreview = () => {
  return (
  
    <section className="py-20 bg-muted">
  <div className="section-container">
    <div className="grid grid-cols-1 gap-12 items-center justify-items-center text-center">
      
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-accent font-medium text-3xl">من نحن</span>

        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
          مكتب محاماة بمعايير عالمية
        </h2>

        <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
          مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية يقدم خدمات قانونية متميزة تجمع بين الخبرة العميقة والمهنية العالية. نحن نؤمن بأن كل عميل يستحق أفضل تمثيل قانوني ممكن.
        </p>

        <div className="space-y-3 mb-8 flex flex-col items-center">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3 justify-center">
              <CheckCircle className="w-7 h-7 text-accent" />
              <span className="text-foreground text-lg">{f}</span>
            </div>
          ))}
        </div>

        <Link to="/about">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            اقرأ المزيد عنا
          </Button>
        </Link>

      </motion.div>

    </div>
  </div>
</section>
  );
};

export default AboutPreview;
