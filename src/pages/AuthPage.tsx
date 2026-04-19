import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
      <SEO
        title={isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
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
                  {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  {isLogin ? "أدخل بياناتك للدخول إلى حسابك" : "أنشئ حسابك للاستفادة من خدماتنا"}
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">الاسم الكامل</label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="أدخل اسمك" className="pr-10" required />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="example@email.com" dir="ltr" className="pr-10 text-left" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pr-10" required />
                  </div>
                </div>

                {isLogin && (
                  <div className="text-left">
                    <button type="button" className="text-accent text-sm hover:underline">نسيت كلمة المرور؟</button>
                  </div>
                )}

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-muted-foreground text-sm">
                  {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
                </span>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-accent text-sm font-medium mr-2 hover:underline"
                >
                  {isLogin ? "أنشئ حساباً" : "سجل دخولك"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-muted-foreground text-sm hover:text-foreground flex items-center justify-center gap-1">
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
