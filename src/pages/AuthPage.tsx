import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import { z } from "zod";
import logo from "@/assets/logo-mark.png";

const schema = z.object({
  email: z.string().trim().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "كلمة المرور قصيرة جداً" }),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const user = await login(parsed.data.email, parsed.data.password);
      toast.success(`أهلاً ${user.first_name ?? user.email}`);
      const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="تسجيل الدخول إلى لوحة التحكم"
        description="بوابة الدخول إلى حساب لوحة تحكم مكتب خالد المجنوني للمحاماة."
        path="/auth"
        noindex
      />
      <main className="min-h-screen bg-muted flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl bg-card rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 min-h-[640px]">
          {/* Form panel */}
          <div className="p-8 sm:p-12 flex flex-col justify-center order-2 lg:order-1">
            <div className="max-w-sm w-full mx-auto">
              {/* Brand */}
              <div className="flex items-center gap-2.5 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="" className="w-7 h-7 object-contain" />
                </div>
                <span className="font-heading text-xl font-bold text-foreground">المجنوني</span>
              </div>

              <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
                مرحباً بعودتك
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                سجّل دخولك للوصول إلى لوحة التحكم
              </p>

              {/* Tabs */}
              <div className="bg-muted rounded-full p-1 flex mb-6">
                <button
                  type="button"
                  className="flex-1 rounded-full bg-primary text-primary-foreground text-sm font-medium py-2 shadow-sm"
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  disabled
                  className="flex-1 rounded-full text-muted-foreground text-sm font-medium py-2 cursor-not-allowed"
                  title="إنشاء الحسابات يتم من قبل المسؤول"
                >
                  حساب جديد
                </button>
              </div>

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
                <div className="relative">
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="كلمة المرور"
                    className="pr-10 pl-10 h-12 rounded-full bg-muted border-transparent focus-visible:bg-card focus-visible:border-primary placeholder:text-muted-foreground/70"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPwd ? "إخفاء" : "إظهار"}
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm pt-1 px-1">
                  <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded accent-primary"
                    />
                    تذكرني
                  </label>
                  <button type="button" className="text-accent hover:underline font-medium">
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-medium mt-3"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "جاري الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>

              <Link
                to="/"
                className="mt-8 text-muted-foreground text-sm hover:text-foreground inline-flex items-center justify-center gap-1.5 w-full"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                العودة للرئيسية
              </Link>
            </div>
          </div>

          {/* Decorative gradient panel */}
          <div className="relative hidden lg:flex order-1 lg:order-2 overflow-hidden gradient-teal items-end p-10">
            {/* Liquid gradient blobs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />

            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Top brand badge */}
            <div className="absolute top-8 right-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-primary-foreground/90 text-xs font-medium">
                لوحة تحكم المكتب
              </span>
            </div>

            {/* Footer card */}
            <div className="relative z-10 max-w-sm">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground leading-tight mb-3">
                مكتب خالد عويد المجنوني للمحاماة
              </h2>
              <p className="text-primary-foreground/75 text-sm leading-relaxed mb-6">
                إدارة المحتوى، الخدمات، الرسائل والمقالات من مكان واحد آمن.
              </p>
              <div className="bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 rounded-2xl p-4 text-primary-foreground/80 text-xs leading-relaxed">
                © 2026 جميع الحقوق محفوظة. الاستخدام غير المصرح به محظور.
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AuthPage;
