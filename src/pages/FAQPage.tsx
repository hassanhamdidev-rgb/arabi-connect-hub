import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import { breadcrumbsLd, faqLd } from "@/lib/seo";
import { useFaqs } from "@/hooks/useDirectus";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQPage = () => {
  const { data, isLoading, error, isError, refetch } = useFaqs();
  const faqs = (data ?? []).filter((f) => f.status === "active");

  return (
    <Layout>
      <SEO
        title="الأسئلة الشائعة | استشارات قانونية بالرياض"
        description="إجابات لأكثر الأسئلة شيوعاً عن الاستشارات القانونية، الأتعاب، أوقات العمل، ونطاق خدمات مكتب خالد المجنوني للمحاماة."
        path="/faq"
        keywords={["أسئلة قانونية", "استشارة قانونية", "أتعاب المحاماة"]}
        jsonLd={[
          faqLd(faqs.map((f) => ({ question: f.question, answer: f.answer }))),
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: "الأسئلة الشائعة", path: "/faq" },
          ]),
        ]}
      />
      <section className="pt-36 pb-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">الأسئلة الشائعة</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            إجابات لأكثر الأسئلة شيوعاً حول خدماتنا القانونية
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="section-container max-w-7xl">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-6 max-w-md">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">خطأ في تحميل الأسئلة</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {error?.message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً."}
                </p>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  حاول مرة أخرى
                </Button>
              </div>
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-center text-muted-foreground">لا توجد أسئلة متاحة حالياً.</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`} className="modern-card px-6 border-none data-[state=open]:border-accent/50">
                  <AccordionTrigger className="text-foreground font-heading font-bold text-right hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 whitespace-pre-line">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
