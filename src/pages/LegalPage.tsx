import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { breadcrumbsLd } from "@/lib/seo";
import { useTerms } from "@/hooks/useDirectus";
import { Loader2, FileText, ShieldCheck } from "lucide-react";

interface LegalPageProps {
  variant: "terms" | "privacy";
}

const config = {
  terms: {
    title: "الشروط والأحكام",
    description: "الشروط والأحكام الخاصة باستخدام موقع وخدمات مكتب خالد عويد المجنوني للمحاماة.",
    path: "/terms",
    breadcrumb: "الشروط والأحكام",
    Icon: FileText,
    field: "terms" as const,
    eyebrow: "وثيقة قانونية",
  },
  privacy: {
    title: "سياسة الخصوصية",
    description: "كيف نجمع ونستخدم ونحمي بياناتك الشخصية في مكتب خالد عويد المجنوني للمحاماة.",
    path: "/privacy",
    breadcrumb: "سياسة الخصوصية",
    Icon: ShieldCheck,
    field: "policy" as const,
    eyebrow: "حماية البيانات",
  },
};

const LegalPage = ({ variant }: LegalPageProps) => {
  const { data, isLoading } = useTerms();
  const cfg = config[variant];
  const content = data?.[cfg.field] ?? "";

  return (
    <Layout>
      <SEO
        title={`${cfg.title} | خالد عويد المجنوني`}
        description={cfg.description}
        path={cfg.path}
        jsonLd={[
          breadcrumbsLd([
            { name: "الرئيسية", path: "/" },
            { name: cfg.breadcrumb, path: cfg.path },
          ]),
        ]}
      />
      <section className="pt-36 pb-16 gradient-teal">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 mb-4">
            <cfg.Icon className="w-3.5 h-3.5 text-accent" />
            <span className="text-primary-foreground/90 text-xs font-medium">{cfg.eyebrow}</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-3">
            {cfg.title}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">{cfg.description}</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="section-container max-w-3xl">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !content ? (
            <p className="text-center text-muted-foreground py-16">
              لم يتم نشر هذه الوثيقة بعد.
            </p>
          ) : (
            <article className="modern-card p-8 sm:p-10">
              <div
                className="prose prose-lg max-w-none text-foreground leading-loose prose-headings:font-heading prose-headings:text-primary prose-a:text-accent whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </article>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default LegalPage;
