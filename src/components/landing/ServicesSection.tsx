import { Link } from "react-router-dom";
import { Scale, FileText, Users, Building2, Shield, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  { icon: Scale, title: "القضايا التجارية", desc: "تمثيل قانوني متخصص في النزاعات التجارية والعقود" },
  { icon: FileText, title: "الاستشارات القانونية", desc: "استشارات قانونية شاملة للأفراد والشركات" },
  { icon: Users, title: "قضايا الأحوال الشخصية", desc: "معالجة قضايا الأسرة والطلاق والحضانة" },
  { icon: Building2, title: "القضايا العقارية", desc: "حل النزاعات العقارية وصياغة العقود" },
  { icon: Shield, title: "القضايا الجنائية", desc: "دفاع متخصص في القضايا الجنائية" },
  { icon: Briefcase, title: "قضايا العمل", desc: "حماية حقوق العمال وأصحاب العمل" },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="text-accent font-medium text-sm">خدماتنا القانونية</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-2">
            نغطي جميع المجالات القانونية
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            نقدم مجموعة شاملة من الخدمات القانونية المتخصصة لتلبية جميع احتياجاتكم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to="/services"
                className="glass-card rounded-xl p-6 block group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
