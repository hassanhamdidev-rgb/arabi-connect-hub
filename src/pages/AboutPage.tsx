// import Layout from "@/components/Layout";
// import { CheckCircle, Target, Eye, Award } from "lucide-react";
// import { motion } from "framer-motion";
// import SEO from "@/components/SEO";
// import { breadcrumbsLd, organizationLd } from "@/lib/seo";
// import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
// import logoMark from "@/assets/logo-mark.png";
// import { useAbout } from "@/hooks/useDirectus";
// import { assetUrl } from "@/lib/directus";

// const fallbackExperiences = [
//   "القضايا التجارية والشركات",
//   "قضايا الأحوال الشخصية",
//   "القضايا الجنائية والتأديبية",
//   "القضايا العقارية والإيجارية",
//   "قضايا العمل والعمال",
//   "التحكيم التجاري الدولي",
// ];
// const fallbackAbout =
//   "مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية هو مكتب قانوني رائد في المملكة العربية السعودية، يقدم خدمات قانونية متميزة تجمع بين الخبرة العميقة والمهنية العالية.";

// const AboutPage = () => {
//   const { data } = useAbout();

//   // `about.images` is an M2M relation. Items can be:
//   //  - a string/number (file UUID), or
//   //  - a junction object: { id, directus_files_id: "<uuid>" | { id: "<uuid>" } }
//   // Normalize each entry to a plain file UUID string.
//   const imageIds: string[] = ((data?.images as unknown[]) ?? [])
//     .map((entry) => {
//       if (!entry) return "";
//       if (typeof entry === "string" || typeof entry === "number") return String(entry);
//       if (typeof entry === "object") {
//         const obj = entry as Record<string, unknown>;
//         const dfi = obj.directus_files_id;
//         if (typeof dfi === "string" || typeof dfi === "number") return String(dfi);
//         if (dfi && typeof dfi === "object" && "id" in (dfi as object)) {
//           return String((dfi as { id: unknown }).id ?? "");
//         }
//         if (typeof obj.id === "string") return obj.id;
//       }
//       return "";
//     })
//     .filter(Boolean);

//   const experiences = data?.experiences && data.experiences.length > 0 ? data.experiences : fallbackExperiences;
//   const aboutOffice = data?.about_office || fallbackAbout;

//   return (
//     <Layout>
//       <SEO
//         title="من نحن | مكتب خالد عويد المجنوني للمحاماة"
//         description="تعرف على مكتب خالد عويد المجنوني: خبرة قانونية موثوقة في الرياض، رؤيتنا، قيمنا وفريق المحامين المتخصص في القانون السعودي."
//         path="/about"
//         keywords={["عن المكتب", "محامي معتمد الرياض", "خبرة قانونية"]}
//         jsonLd={[
//           organizationLd,
//           breadcrumbsLd([
//             { name: "الرئيسية", path: "/" },
//             { name: "من نحن", path: "/about" },
//           ]),
//         ]}
//       />

//       {/* Hero */}
//       <section className="pt-36 pb-20 gradient-teal">
//         <div className="section-container text-center">
//           <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">من نحن</h1>
//           <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
//             تعرف على مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية
//           </p>
//         </div>
//       </section>

//       {/* Carousel — pulled from about.images */}
//       {/* <section className="py-12 md:py-20 bg-muted/30">
//         <div className="section-container">
//           <Carousel className="w-full max-w-4xl mx-auto">
//             <CarouselContent className="-ml-2 md:-ml-4">
//               {imageIds.length > 0 ? (
//                 imageIds.map((id, index) => {
//                   const url = assetUrl(id, { width: 1600, fit: "cover" });
//                   return (
//                     <CarouselItem key={`${id}-${index}`} className="pl-2 md:pl-4 basis-full">
//                       <div className="modern-card overflow-hidden min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center bg-muted">
//                         {url ? (
//                           <img
//                             src={url}
//                             alt={`صورة المكتب ${index + 1}`}
//                             loading="lazy"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <img src={logoMark} alt="logo" className="w-16 h-16 object-contain" />
//                         )}
//                       </div>
//                     </CarouselItem>
//                   );
//                 })
//               ) : (
//                 <CarouselItem className="pl-2 md:pl-4 basis-full">
//                   <div className="modern-card p-8 text-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center gap-4">
//                     <img src={`https://low-firm-directus.ammxdv.easypanel.host/assets/b5f4d7d6-ec20-4265-b424-29aaaebdd7cb`} alt="logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
//                     <p className="text-muted-foreground">لم تُضف صور المعرض بعد</p>
//                   </div>
//                 </CarouselItem>
//               )}
//             </CarouselContent>
//             <CarouselPrevious className="hidden md:flex" />
//             <CarouselNext className="hidden md:flex" />
//           </Carousel>
//         </div>
//       </section> */}
// {/* Carousel — pulled from about.images */}
// <section className="py-12 md:py-20 bg-muted/30">
//   <div className="section-container">
//     <Carousel className="w-full max-w-4xl mx-auto">

//       {/* Header row: label + counter */}
//       <div className="flex justify-between items-center pb-4 mb-6 border-b border-border">
//         <span className="text-lg font-semibold text-foreground">معرض الصور</span>
//         <span className="text-sm text-muted-foreground">
//           <span className="text-foreground font-medium">
//             {/* counter rendered by shadcn Carousel state if needed */}
//           </span>
//         </span>
//       </div>

//       <CarouselContent className="items-center -ml-2 md:-ml-4">
//         {imageIds.length > 0 ? (
//           imageIds.map((id, index) => {
//             const url = assetUrl(id, { width: 1600, fit: "cover" });
//             const isCurrent = /* tie to carousel API state */ false;
//             return (
//               <CarouselItem
//                 key={`${id}-${index}`}
//                 className="pl-2 md:pl-4 basis-[75%] md:basis-[60%] transition-all duration-400"
//               >
//                 <div
//                   className={`overflow-hidden rounded-[20px] transition-all duration-400 ${
//                     isCurrent
//                       ? "h-[320px] opacity-100 scale-100 shadow-lg"
//                       : "h-[280px] opacity-55 scale-90"
//                   } flex items-end bg-muted`}
//                 >
//                   {url ? (
//                     <div className="relative w-full h-full">
//                       <img
//                         src={url}
//                         alt={`صورة المكتب ${index + 1}`}
//                         loading="lazy"
//                         className="w-full h-full object-cover"
//                       />
//                       <span className="absolute bottom-4 left-4 text-white text-2xl font-light tracking-wide drop-shadow">
//                         {/* optional label */}
//                       </span>
//                     </div>
//                   ) : (
//                     <img src={logoMark} alt="logo" className="w-16 h-16 object-contain m-auto" />
//                   )}
//                 </div>
//               </CarouselItem>
//             );
//           })
//         ) : (
//           <CarouselItem className="pl-2 md:pl-4 basis-full">
//             <div className="rounded-[20px] min-h-[320px] flex flex-col items-center justify-center gap-4 bg-muted">
//               <img
//                 src="https://low-firm-directus.ammxdv.easypanel.host/assets/b5f4d7d6-ec20-4265-b424-29aaaebdd7cb"
//                 alt="logo"
//                 className="w-16 h-16 object-contain"
//               />
//               <p className="text-muted-foreground">لم تُضف صور المعرض بعد</p>
//             </div>
//           </CarouselItem>
//         )}
//       </CarouselContent>

//       {/* Arrows */}
//       <CarouselPrevious className="hidden md:flex rounded-full border border-border bg-background shadow-none" />
//       <CarouselNext className="hidden md:flex rounded-full border border-border bg-background shadow-none" />

//       {/* Dot indicators */}
//       <div className="flex justify-center gap-2 mt-5">
//         {imageIds.map((_, i) => (
//           <div
//             key={i}
//             className="h-2 rounded-full bg-border transition-all duration-300"
//             style={{ width: i === 0 ? "24px" : "8px" }}
//           />
//         ))}
//       </div>

//     </Carousel>
//   </div>
// </section>
//       {/* About Content */}
//       <section className="py-20 bg-background">
//         <div className="section-container">
//           <div className="max-w-4xl mx-auto space-y-12">
//             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
//               <h2 className="font-heading text-2xl font-bold text-foreground mb-4">نبذة عن المكتب</h2>
//               <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{aboutOffice}</p>
//             </motion.div>

//             {/* Values */}
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 { icon: Target, title: "رسالتنا", desc: data?.mission || "تقديم خدمات قانونية متميزة تحقق العدالة وتحمي حقوق عملائنا بأعلى معايير المهنية." },
//                 { icon: Eye, title: "رؤيتنا", desc: data?.vision || "أن نكون المكتب القانوني الأول في المملكة من حيث الجودة والثقة والاحترافية." },
//                 { icon: Award, title: "قيمنا", desc: data?.value || "النزاهة والشفافية والتميز في الأداء والالتزام بأخلاقيات المهنة." },
//               ].map((item, i) => (
//                 <motion.div
//                   key={item.title}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.1 }}
//                   className="modern-card p-6 text-center group"
//                 >
//                   <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
//                     <item.icon className="w-7 h-7 text-secondary-foreground" />
//                   </div>
//                   <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
//                   <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Experience */}
//             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
//               <h2 className="font-heading text-2xl font-bold text-foreground mb-6">خبراتنا</h2>
//               <div className="space-y-4">
//                 {experiences.map((exp) => (
//                   <div key={exp} className="modern-card flex items-center gap-3 p-4 group">
//                     <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
//                       <CheckCircle className="w-5 h-5 text-secondary-foreground" />
//                     </div>
//                     <span className="text-foreground font-medium">{exp}</span>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default AboutPage;
import { useCallback, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { CheckCircle, Target, Eye, Award } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { breadcrumbsLd, organizationLd } from "@/lib/seo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import logoMark from "@/assets/logo-mark.png";
import { useAbout } from "@/hooks/useDirectus";
import { assetUrl } from "@/lib/directus";

/* ─────────────────────────────────────────────────────────────
   Fallback data
───────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   Inner carousel — must live inside <Carousel> to access context
───────────────────────────────────────────────────────────── */
interface CarouselInnerProps {
  imageIds: string[];
}

function CarouselInner({ imageIds }: CarouselInnerProps) {
  const { api } = useCarousel();
  const [current, setCurrent] = useState(0);
  const total = imageIds.length || 1;

  /* sync active index with embla */
  useEffect(() => {
    if (!api) {
      console.log("❌ Carousel API not available");
      return;
    }
    
    console.log("✅ Carousel API initialized");
    
    const update = () => {
      const selected = api.selectedScrollSnap();
      console.log("📍 Carousel moved to index:", selected);
      setCurrent(selected);
    };
    
    api.on("select", update);
    update();
    
    return () => {
      api.off("select", update);
    };
  }, [api]);

  const goPrev = useCallback(() => {
    console.log("⬅️ Prev clicked");
    if (api) {
      api.scrollPrev();
    }
  }, [api]);
  
  const goNext = useCallback(() => {
    console.log("➡️ Next clicked");
    if (api) {
      api.scrollNext();
    }
  }, [api]);
  
  const goTo = useCallback((i: number) => {
    console.log("🎯 Go to index:", i);
    if (api) {
      api.scrollTo(i);
    }
  }, [api]);

  return (
    <>
      {/* ── Header: title + counter ── */}
      <div className="flex justify-between items-center pb-4 mb-6 border-b border-border px-1">
        <span className="font-heading text-lg font-bold text-foreground">
          معرض الصور
        </span>
        <span className="text-sm text-muted-foreground tabular-nums">
          <span className="text-foreground font-semibold">
            {String(current + 1).padStart(2, "0")}
          </span>
          {" / "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ── Slides track ── */}
      <div className="relative flex items-center justify-center min-h-[340px]">

        {/* Prev arrow */}
        <button
          onClick={goPrev}
          aria-label="السابق"
          className="
            absolute left-0 z-10
            w-9 h-9 rounded-full
            bg-background border border-border
            flex items-center justify-content-center
            text-foreground text-lg
            hover:bg-muted active:scale-95
            transition-all duration-200
            flex items-center justify-center
          "
        >
          ‹
        </button>

        <CarouselContent
          className="items-center"
          style={{ paddingInline: "44px", marginLeft: 0 }}
        >
          {imageIds.length > 0 ? (
            imageIds.map((id, index) => {
              const url = assetUrl(id, { width: 1600, fit: "cover" });
              const isCenter = index === current;

              return (
                <CarouselItem
                  key={`${id}-${index}`}
                  className="pl-3 md:pl-4 basis-[78%] md:basis-[56%]"
                  onClick={() => !isCenter && goTo(index)}
                >
                  <div
                    className="overflow-hidden rounded-[20px] bg-muted"
                    style={{
                      height: isCenter ? "320px" : "275px",
                      opacity: isCenter ? 1 : 0.5,
                      transform: isCenter ? "scale(1)" : "scale(0.92)",
                      boxShadow: isCenter
                        ? "0 10px 32px rgba(0,0,0,0.14)"
                        : "none",
                      cursor: isCenter ? "default" : "pointer",
                      transition: "all 0.38s cubic-bezier(.4,0,.2,1)",
                    }}
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={`صورة المكتب ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={logoMark}
                          alt="شعار المكتب"
                          className="w-16 h-16 object-contain opacity-40"
                        />
                      </div>
                    )}
                  </div>
                </CarouselItem>
              );
            })
          ) : (
            /* ── empty state ── */
            <CarouselItem className="pl-3 basis-full">
              <div
                className="rounded-[20px] flex flex-col items-center justify-center gap-4 bg-muted"
                style={{ height: "320px" }}
              >
                <img
                  src="https://low-firm-directus.ammxdv.easypanel.host/assets/b5f4d7d6-ec20-4265-b424-29aaaebdd7cb"
                  alt="شعار المكتب"
                  className="w-16 h-16 object-contain opacity-50"
                />
                <p className="text-muted-foreground text-sm">
                  لم تُضف صور المعرض بعد
                </p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        {/* Next arrow */}
        <button
          onClick={goNext}
          aria-label="التالي"
          className="
            absolute right-0 z-10
            w-9 h-9 rounded-full
            bg-background border border-border
            flex items-center justify-center
            text-foreground text-lg
            hover:bg-muted active:scale-95
            transition-all duration-200
          "
        >
          ›
        </button>
      </div>

      {/* ── Dot indicators ── */}
      <div className="flex justify-center gap-[6px] mt-5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`الانتقال إلى الصورة ${i + 1}`}
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.3s ease",
              background:
                i === current
                  ? "hsl(var(--foreground))"
                  : "hsl(var(--border))",
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────── */
const AboutPage = () => {
  const { data } = useAbout();

  /* normalise M2M image relation → plain UUID strings */
  const imageIds: string[] = ((data?.images as unknown[]) ?? [])
    .map((entry) => {
      if (!entry) return "";
      if (typeof entry === "string" || typeof entry === "number")
        return String(entry);
      if (typeof entry === "object") {
        const obj = entry as Record<string, unknown>;
        const dfi = obj.directus_files_id;
        if (typeof dfi === "string" || typeof dfi === "number")
          return String(dfi);
        if (dfi && typeof dfi === "object" && "id" in (dfi as object)) {
          return String((dfi as { id: unknown }).id ?? "");
        }
        if (typeof obj.id === "string") return obj.id;
      }
      return "";
    })
    .filter(Boolean);

  const experiences =
    data?.experiences && data.experiences.length > 0
      ? data.experiences
      : fallbackExperiences;

  const aboutOffice = data?.about_office || fallbackAbout;

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

      {/* ── Hero ── */}
      <section className="pt-36 pb-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
            من نحن
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            تعرف على مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية
          </p>
        </div>
      </section>

      {/* ── Carousel ── */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="section-container">
          <Carousel
            className="w-full max-w-4xl mx-auto"
            opts={{ align: "center", loop: true }}
          >
            <CarouselInner imageIds={imageIds} />
          </Carousel>
        </div>
      </section>

      {/* ── About content ── */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Office description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                نبذة عن المكتب
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {aboutOffice}
              </p>
            </motion.div>

            {/* Mission / Vision / Values */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "رسالتنا",
                  desc:
                    data?.mission ||
                    "تقديم خدمات قانونية متميزة تحقق العدالة وتحمي حقوق عملائنا بأعلى معايير المهنية.",
                },
                {
                  icon: Eye,
                  title: "رؤيتنا",
                  desc:
                    data?.vision ||
                    "أن نكون المكتب القانوني الأول في المملكة من حيث الجودة والثقة والاحترافية.",
                },
                {
                  icon: Award,
                  title: "قيمنا",
                  desc:
                    data?.value ||
                    "النزاهة والشفافية والتميز في الأداء والالتزام بأخلاقيات المهنة.",
                },
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
                  <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Experiences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                خبراتنا
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp}
                    className="modern-card flex items-center gap-3 p-4 group"
                  >
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