import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { Scale, Loader2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/useDirectus";

const ServicesSection = () => {
  const { data, isLoading } = useServices();
  const [displayCount, setDisplayCount] = useState(6);
  const services = (data ?? []).filter((s) => s.status === "active");
  const displayedServices = services.slice(0, displayCount);
  const hasMore = displayCount < services.length;



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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedServices.map((service, i) => {
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
                    to={`/service/${service.slug}`}
                    className="modern-card p-6 block group h-full"
                  >
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <IconCmp className="w-7 h-7 text-secondary-foreground" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{service.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">{service.description}</p>
                      <span className="link-btn text-sm">اعرف المزيد <Scale className="w-4 h-4" /></span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-12">
                <a href="services" >
                    <Button
                  size="lg"
                  className="gap-2"
                >
                  تحميل المزيد من الخدمات
                  <ChevronDown className="w-4 h-4" />
                </Button>
                </a>
              
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
