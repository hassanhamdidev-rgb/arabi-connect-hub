import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "خبرة تزيد عن 15 عاماً في مختلف المجالات القانونية",
  "فريق من المحامين المتخصصين والمؤهلين",
  "نسبة نجاح مرتفعة في القضايا",
  "سرية تامة ومعاملة احترافية",
];

const AboutPreview = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-medium text-sm">من نحن</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-6">
              مكتب محاماة بمعايير عالمية
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية يقدم خدمات قانونية متميزة تجمع بين الخبرة العميقة والمهنية العالية. نحن نؤمن بأن كل عميل يستحق أفضل تمثيل قانوني ممكن.
            </p>
            <div className="space-y-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/about">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                اقرأ المزيد عنا
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "+500", label: "قضية ناجحة", color: "text-accent" },
                  { number: "+15", label: "سنة خبرة", color: "text-primary" },
                  { number: "+200", label: "عميل", color: "text-accent" },
                  { number: "98%", label: "نسبة الرضا", color: "text-primary" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-xl bg-muted">
                    <div className={`font-heading text-3xl font-bold ${stat.color}`}>{stat.number}</div>
                    <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
