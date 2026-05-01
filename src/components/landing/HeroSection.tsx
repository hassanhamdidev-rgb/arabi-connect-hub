import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Scale } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import logoName from "@/assets/logo-name.png";
import logoMark from "@/assets/logo-mark.png";
import titleImage from "@/assets/low-title.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/85 to-primary/70" />
      </div>

      <div className="section-container relative z-10 py-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6 h-6">
              {/* <Scale className="w-6 h-6 text-gold" /> */}
              {/* <span className="text-gold font-medium text-sm">للمحاماة والاستشارات القانونية</span> */}
            </div>
<h3 className="mb-6 flex justify-center">
  <img
    src={titleImage}
    alt="خالد عويد المجنوني للمحاماة والاستشارات القانونية"
    className="w-38 h-38"
    width={240}
    height={240}
  />
</h3>
            <h1 className="mb-6">
              <img
                src={logoName}
                alt="خالد عويد المجنوني للمحاماة والاستشارات القانونية"
                className="w-full max-w-md lg:max-w-lg h-auto brightness-0 invert"
                width={600}
                height={240}
              />
              <span className="block text-gold text-2xl sm:text-3xl lg:text-4xl mt-4 font-heading font-semibold">
                حلول قانونية بثقة واحتراف
              </span>
            </h1>

            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8 max-w-lg">
              نقدم خدمات قانونية شاملة ومتخصصة تغطي جميع المجالات القانونية بخبرة عالية  في المملكة العربية السعودية.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/services">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-base px-8">
                  <Phone className="w-5 h-5" />
                  تعرف على خدماتنا
                </Button>
              </Link>
           
            </div>
          </motion.div>

          {/* Stats */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex gap-8 mt-14"
          >
            {[
              { number: "+500", label: "قضية ناجحة" },
              { number: "+15", label: "سنة خبرة" },
              { number: "+200", label: "عميل راضٍ" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-gold font-heading text-2xl sm:text-3xl font-bold">{stat.number}</div>
                <div className="text-primary-foreground/70 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div> */}
          </div>

          {/* Logo Mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
            <div className="relative bg-primary-foreground/5 backdrop-blur-sm border border-gold/30 rounded-3xl p-10 shadow-2xl">
              <motion.img
                src={logoMark}
                alt="شعار خالد عويد المجنوني"
                className="w-72 h-72 object-contain drop-shadow-2xl"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
