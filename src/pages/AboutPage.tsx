import Layout from "@/components/Layout";
import { CheckCircle, Target, Eye, Award } from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">من نحن</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            تعرف على مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">نبذة عن المكتب</h2>
              <p className="text-muted-foreground leading-relaxed">
                مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية هو مكتب قانوني رائد في المملكة العربية السعودية، يقدم خدمات قانونية متميزة تجمع بين الخبرة العميقة والمهنية العالية. تأسس المكتب برؤية واضحة لتقديم أفضل الحلول القانونية للأفراد والشركات، مع الالتزام بأعلى معايير الجودة والسرية.
              </p>
            </motion.div>

            {/* Values */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Target, title: "رسالتنا", desc: "تقديم خدمات قانونية متميزة تحقق العدالة وتحمي حقوق عملائنا بأعلى معايير المهنية." },
                { icon: Eye, title: "رؤيتنا", desc: "أن نكون المكتب القانوني الأول في المملكة من حيث الجودة والثقة والاحترافية." },
                { icon: Award, title: "قيمنا", desc: "النزاهة والشفافية والتميز في الأداء والالتزام بأخلاقيات المهنة." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Experience */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">خبراتنا</h2>
              <div className="space-y-4">
                {[
                  "القضايا التجارية والشركات",
                  "قضايا الأحوال الشخصية",
                  "القضايا الجنائية والتأديبية",
                  "القضايا العقارية والإيجارية",
                  "قضايا العمل والعمال",
                  "التحكيم التجاري الدولي",
                ].map((exp) => (
                  <div key={exp} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-foreground">{exp}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
