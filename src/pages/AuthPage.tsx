import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import { z } from "zod";

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
    <Layout>
      <SEO
        title="تسجيل الدخول إلى لوحة التحكم"
        description="بوابة الدخول إلى حساب لوحة تحكم مكتب خالد المجنوني للمحاماة."
        path="/auth"
        noindex
      />
      <section className="py-20 bg-muted min-h-[80vh] flex items-center">
        <div className="section-container">
          <div className="max-w-md mx-auto">
            <div className="glass-card rounded-2xl p-8">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  تسجيل الدخول
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  أدخل بياناتك للدخول إلى لوحة التحكم
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      dir="ltr"
                      className="pr-10 text-left"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "جاري الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/" className="text-muted-foreground text-sm hover:text-foreground inline-flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AuthPage;
