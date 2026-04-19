import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import { breadcrumbsLd, faqLd } from "@/lib/seo";

const faqs = [
  { q: "ما هي أوقات العمل في المكتب؟", a: "نعمل من الأحد إلى الخميس من الساعة 8 صباحاً حتى 5 مساءً. يمكنكم حجز موعد مسبق خارج أوقات العمل." },
  { q: "هل تقدمون استشارة مجانية؟", a: "نعم، نقدم استشارة أولية مجانية لتقييم قضيتكم وتوضيح الخيارات القانونية المتاحة." },
  { q: "ما هي تكلفة الخدمات القانونية؟", a: "تختلف التكلفة حسب نوع القضية وتعقيدها. نقدم أسعاراً تنافسية ويتم الاتفاق على الأتعاب بشكل واضح قبل البدء." },
  { q: "هل يمكنني التواصل عبر الواتساب؟", a: "نعم، يمكنكم التواصل معنا عبر الواتساب على مدار الساعة وسيتم الرد عليكم في أقرب وقت." },
  { q: "هل تتعاملون مع القضايا خارج الرياض؟", a: "نعم، نقدم خدماتنا في جميع مناطق المملكة العربية السعودية ولدينا خبرة في التقاضي أمام جميع المحاكم." },
  { q: "كيف يمكنني متابعة قضيتي؟", a: "نوفر لكم تحديثات دورية عن سير القضية ويمكنكم التواصل مع المحامي المسؤول في أي وقت." },
  { q: "ما هي المستندات المطلوبة لفتح ملف قضية؟", a: "تختلف المستندات حسب نوع القضية. في الاستشارة الأولية سيوضح لكم المحامي جميع المستندات المطلوبة." },
  { q: "هل تقدمون خدمات للشركات؟", a: "نعم، نقدم خدمات قانونية شاملة للشركات تشمل تأسيس الشركات وصياغة العقود والاستشارات القانونية المستمرة." },
];

const FAQPage = () => {
  return (
    <Layout>
      <SEO
        title="الأسئلة الشائعة | استشارات قانونية بالرياض"
        description="إجابات لأكثر الأسئلة شيوعاً عن الاستشارات القانونية، الأتعاب، أوقات العمل، ونطاق خدمات مكتب خالد المجنوني للمحاماة."
        path="/faq"
        keywords={["أسئلة قانونية", "استشارة قانونية", "أتعاب المحاماة"]}
        jsonLd={[
          faqLd(faqs.map((f) => ({ question: f.q, answer: f.a }))),
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "الأسئلة الشائعة", path: "/faq" },
          ]),
        ]}
      />
      <section className="py-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">الأسئلة الشائعة</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            إجابات لأكثر الأسئلة شيوعاً حول خدماتنا القانونية
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="section-container max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass-card rounded-xl px-6 border-none">
                <AccordionTrigger className="text-foreground font-heading font-bold text-right hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
