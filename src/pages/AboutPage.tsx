import Layout from "@/components/Layout";
import { CheckCircle, Target, Eye, Award } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { breadcrumbsLd, organizationLd } from "@/lib/seo";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import logoMark from "@/assets/logo-mark.png";
import { useAbout } from "@/hooks/useDirectus";
import { assetUrl } from "@/lib/directus";

const fallbackExperiences = [
  "القضايا التجارية والشركات",
  "قضايا الأحوال الشخصية",
  "القضايا الجنائية والتأديبية",
  "القضايا العقارية والإيجارية",
  "قضايا العمل والعمال",
  "التحكيم التجاري الدولي",
];
const fallbackAbout =
  "مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية هو مكتب قانوني رائد في المملكة العربية السعودية، يقدم خدمات قانونية متميزة تجمع بين الخبرة العميقة والمهنية العالية.";

const AboutPage = () => {
  const { data } = useAbout();
  const images = (data?.images ?? []).map(String);
  const experiences = data?.experiences && data.experiences.length > 0 ? data.experiences : fallbackExperiences;
  const aboutOffice = data?.about_office || fallbackAbout;
 <img src={`https://low-firm-directus.ammxdv.easypanel.host/assets/b5f4d7d6-ec20-4265-b424-29aaaebdd7cb`} alt="Logo" className="w-16 h-16 object-contain" />
  return (
    <Layout>
      <SEO
        title="من نحن | مكتب خالد عويد المجنوني للمحاماة"
        description="تعرف على مكتب خالد عويد المجنوني: خبرة قانونية موثوقة في الرياض، رؤيتنا، قيمنا وفريق المحامين المتخصص في القانون السعودي."
        path="/about"
        keywords={["عن المكتب", "محامي معتمد الرياض", "خبرة قانونية"]}
        jsonLd={[
          organizationLd,
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "من نحن", path: "/about" },
          ]),
        ]}
      />
      {

      }



  {/* Hero */}
      <section className="pt-36 pb-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">من نحن</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            تعرف على مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية
          </p>
        </div>
      </section>

      {/* Carousel — pulled from about.images */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="section-container">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {images.length > 0 ? (
                images.map((id , index) => {
                  const url = assetUrl(id[0], { width: 1600, fit: "cover" });
                  return (
                    <CarouselItem key={id} className="pl-2 md:pl-4 basis-full">
                      <div className="modern-card overflow-hidden min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-muted">
                        {url ? (
                          <img src={url[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <img src={`https://low-firm-directus.ammxdv.easypanel.host/assets/b5f4d7d6-ec20-4265-b424-29aaaebdd7cb`} alt="" className="w-16 h-16 object-contain" />
                        )}
                      </div>
                    </CarouselItem>
                  );
                })
              ) : (
                <CarouselItem className="pl-2 md:pl-4 basis-full">
                  <div className="modern-card p-8 text-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center gap-4">
                    <img src={`https://low-firm-directus.ammxdv.easypanel.host/assets/b5f4d7d6-ec20-4265-b424-29aaaebdd7cb`} alt="logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                    <p className="text-muted-foreground">لم تُضف صور المعرض بعد</p>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">نبذة عن المكتب</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{aboutOffice}</p>
            </motion.div>

            {/* Values */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Target, title: "رسالتنا", desc: data?.mission || "تقديم خدمات قانونية متميزة تحقق العدالة وتحمي حقوق عملائنا بأعلى معايير المهنية." },
                { icon: Eye, title: "رؤيتنا", desc: data?.vision || "أن نكون المكتب القانوني الأول في المملكة من حيث الجودة والثقة والاحترافية." },
                { icon: Award, title: "قيمنا", desc: data?.value || "النزاهة والشفافية والتميز في الأداء والالتزام بأخلاقيات المهنة." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="modern-card p-6 text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <item.icon className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Experience */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">خبراتنا</h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp} className="modern-card flex items-center gap-3 p-4 group">
                    <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <span className="text-foreground font-medium">{exp}</span>
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
