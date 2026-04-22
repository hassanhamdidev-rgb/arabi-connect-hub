import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { Scale, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useServices } from "@/hooks/useDirectus";

const ServicesSection = () => {
  const { data, isLoading } = useServices();
  const services = (data ?? []).filter((s) => s.status === "active");

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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-muted-foreground">لا توجد خدمات متاحة حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const IconCmp =
                (service.icon && (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[service.icon]) ||
                Scale;
              return (
                <motion.div
                  key={service.id}
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
                      <IconCmp className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">{service.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{service.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
