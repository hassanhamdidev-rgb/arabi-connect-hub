import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import { z } from "zod";
import { toast } from "sonner";
import { DIRECTUS_URL } from "@/lib/directus";
import logo from "@/assets/logo-mark.png";

const schema = z.object({
  email: z.string().trim().email({ message: "البريد الإلكتروني غير صالح" }),
});

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${DIRECTUS_URL}/auth/password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data.email,
          reset_url: `${window.location.origin}/auth`,
        }),
      });
      // Directus returns 204 even for unknown emails (security best practice)
      if (!res.ok && res.status !== 204) {
        throw new Error("تعذّر إرسال رابط الاستعادة");
      }
      setSent(true);
      toast.success("تم إرسال رابط الاستعادة إن كان البريد مسجلاً");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="استعادة كلمة المرور"
        description="استعادة كلمة مرور حساب لوحة تحكم مكتب خالد المجنوني للمحاماة."
        path="/forgot-password"
        noindex
      />
      <main className="min-h-screen bg-muted flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl bg-card rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 min-h-[560px]">
          {/* Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center order-2 lg:order-1">
            <div className="max-w-sm w-full mx-auto">
              <div className="flex items-center gap-2.5 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="" className="w-7 h-7 object-contain" />
                </div>
                <span className="font-heading text-xl font-bold text-foreground">المجنوني</span>
              </div>

              {sent ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                    تحقق من بريدك
                  </h1>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    إن كان <span className="font-medium text-foreground" dir="ltr">{email}</span> مسجلاً لدينا، فستصلك رسالة بها رابط لإعادة تعيين كلمة المرور خلال دقائق.
                  </p>
                  <Link to="/auth">
                    <Button className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      العودة لتسجيل الدخول
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
                    نسيت كلمة المرور؟
                  </h1>
                  <p className="text-muted-foreground text-sm mb-8">
                    أدخل بريدك المسجل وسنرسل لك رابط إعادة التعيين.
                  </p>

                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="relative">
                      <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        dir="ltr"
                        className="pr-10 text-right h-12 rounded-full bg-muted border-transparent focus-visible:bg-card focus-visible:border-primary placeholder:text-muted-foreground/70"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-medium mt-3"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {loading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
                    </Button>
                  </form>

                  <Link
                    to="/auth"
                    className="mt-8 text-muted-foreground text-sm hover:text-foreground inline-flex items-center justify-center gap-1.5 w-full"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    العودة لتسجيل الدخول
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Decorative panel */}
          <div className="relative hidden lg:flex order-1 lg:order-2 overflow-hidden gradient-teal items-end p-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute top-8 right-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-primary-foreground/90 text-xs font-medium">استعادة آمنة</span>
            </div>
            <div className="relative z-10 max-w-sm">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground leading-tight mb-3">
                خصوصيتك مصونة
              </h2>
              <p className="text-primary-foreground/75 text-sm leading-relaxed">
                نحرص على حماية حسابك بأعلى معايير الأمان. لن نكشف عن وجود أي حساب لأغراض الخصوصية.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ForgotPasswordPage;
