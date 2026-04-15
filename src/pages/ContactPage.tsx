import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
          toast({ title: "تم تحديد موقعك بنجاح" });
        },
        () => toast({ title: "لم نتمكن من تحديد موقعك", variant: "destructive" })
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "تم إرسال رسالتك بنجاح", description: "سنتواصل معك في أقرب وقت" });
    }, 1000);
  };

  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({ title: "موقع مكتب المجنوني للمحاماة", url: "https://maps.google.com/?q=24.7136,46.6753" });
    }
  };

  return (
    <Layout>
      <section className="py-20 gradient-teal">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">تواصل معنا</h1>
          <p className="text-primary-foreground/80 text-lg">نسعد بتواصلكم ونرد على جميع استفساراتكم</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="glass-card rounded-xl p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">أرسل رسالتك</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">الاسم الكامل</label>
                    <Input placeholder="أدخل اسمك" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">البريد الإلكتروني</label>
                    <Input type="email" placeholder="example@email.com" dir="ltr" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">رقم الهاتف</label>
                  <Input type="tel" placeholder="+966 5X XXX XXXX" dir="ltr" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">موقعك</label>
                  <div className="flex gap-2">
                    <Input value={userLocation} readOnly placeholder="اضغط لتحديد موقعك" className="flex-1" />
                    <Button type="button" variant="outline" onClick={detectLocation} className="gap-2 shrink-0">
                      <MapPin className="w-4 h-4" />
                      تحديد
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">الموضوع</label>
                  <Input placeholder="موضوع الرسالة" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">الرسالة</label>
                  <Textarea placeholder="اكتب رسالتك هنا..." rows={5} required />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  <Send className="w-4 h-4" />
                  {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-bold text-foreground mb-4">معلومات التواصل</h3>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "العنوان", value: "الرياض، المملكة العربية السعودية" },
                    { icon: Phone, label: "الهاتف", value: "+966 50 000 0000" },
                    { icon: Mail, label: "البريد", value: "info@almajnouni.com" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Share */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-heading font-bold text-foreground mb-4">شارك موقعنا</h3>
                <div className="flex gap-3 flex-wrap">
                  <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">واتساب</Button>
                  </a>
                  <a href="https://twitter.com/intent/tweet?text=مكتب+المجنوني+للمحاماة" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">تويتر</Button>
                  </a>
                  <a href="https://www.facebook.com/sharer/sharer.php?u=https://almajnouni.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">فيسبوك</Button>
                  </a>
                  <Button variant="outline" size="sm" onClick={shareLocation} className="gap-2">
                    <Share2 className="w-4 h-4" />
                    مشاركة الموقع
                  </Button>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-border h-[250px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6554!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsijNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="موقع المكتب"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
