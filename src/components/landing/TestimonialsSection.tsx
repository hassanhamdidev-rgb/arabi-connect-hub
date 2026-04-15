import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "محمد العتيبي", role: "رجل أعمال", text: "تعاملت مع مكتب المجنوني في عدة قضايا تجارية وكانت النتائج ممتازة. احترافية عالية وتفانٍ في العمل.", rating: 5 },
  { name: "فاطمة الحربي", role: "سيدة أعمال", text: "أفضل مكتب محاماة تعاملت معه. سرعة في الإنجاز ومتابعة دقيقة لكل تفاصيل القضية.", rating: 5 },
  { name: "عبدالله السعيد", role: "مستثمر", text: "خبرة واسعة في القضايا العقارية. ساعدوني في حل نزاع معقد بأسرع وقت وبنتيجة ممتازة.", rating: 5 },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="text-accent font-medium text-sm">آراء عملائنا</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-2">
            ماذا يقول عملاؤنا عنا
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-foreground">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
