import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowLeft, Loader2, Sparkles, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import { z } from "zod";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth";
import logo from "@/assets/logo-mark.png";

const schema = z
  .object({
    password: z.string().min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect to forgot password if no token provided
  useEffect(() => {
    if (!token) {
      toast.error("رابط الاستعادة غير صحيح");
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    if (!token) {
      toast.error("رابط الاستعادة غير صحيح");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, parsed.data.password);
      setSuccess(true);
      toast.success("تم إعادة تعيين كلمة المرور بنجاح");
      setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <>
      <SEO
        title="إعادة تعيين كلمة المرور"
        description="أعد تعيين كلمة مرور حساب لوحة تحكم مكتب خالد المجنوني للمحاماة."
        path="/reset-password"
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

              {success ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                    تم بنجاح!
                  </h1>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    تم إعادة تعيين كلمة المرور بنجاح. سيتم نقلك إلى صفحة تسجيل الدخول...
                  </p>
                </div>
              ) : (
                <>
                  <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
                    إعادة تعيين كلمة المرور
                  </h1>
                  <p className="text-muted-foreground text-sm mb-8">
                    أدخل كلمة مرور قوية وجديدة لحسابك
                  </p>

                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="relative">
                      <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="كلمة المرور الجديدة"
                        className="pr-10 pl-10 h-12 rounded-full bg-muted border-transparent focus-visible:bg-card focus-visible:border-primary placeholder:text-muted-foreground/70"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "إخفاء" : "إظهار"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="تأكيد كلمة المرور"
                        className="pr-10 pl-10 h-12 rounded-full bg-muted border-transparent focus-visible:bg-card focus-visible:border-primary placeholder:text-muted-foreground/70"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirmPassword ? "إخفاء" : "إظهار"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground px-1 pt-1">
                      • يجب أن تكون كلمة المرور 8 أحرف على الأقل <br />
                      • يُنصح باستخدام مزيج من الأحرف والأرقام والرموز
                    </p>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-medium mt-3"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {loading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
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
              <span className="text-primary-foreground/90 text-xs font-medium">أمان محسّن</span>
            </div>
            <div className="relative z-10 max-w-sm">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground leading-tight mb-3">
                حماية قوية
              </h2>
              <p className="text-primary-foreground/75 text-sm leading-relaxed">
                كلمات المرور القوية هي أساس أمان حسابك. تأكد من استخدام كلمة مرور فريدة وآمنة.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPasswordPage;
