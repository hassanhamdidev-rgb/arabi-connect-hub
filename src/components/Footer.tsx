import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="خالد عويد المجنوني" className="h-16 w-auto rounded" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية. نقدم خدمات قانونية متميزة بخبرة تزيد عن 15 عاماً.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">روابط سريعة</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "الرئيسية", path: "/" },
                { label: "من نحن", path: "/about" },
                { label: "خدماتنا", path: "/services" },
                { label: "المدونة", path: "/blog" },
                { label: "تواصل معنا", path: "/contact" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">تواصل معنا</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-4 h-4 shrink-0" />
                <span dir="ltr">+966 50 000 0000</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@almajnouni.com</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">تابعنا</h3>
            <div className="flex gap-3">
              {["فيسبوك", "تويتر", "واتساب", "انستغرام"].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center text-xs transition-colors"
                >
                  {name[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          © {new Date().getFullYear()} خالد عويد المجنوني للمحاماة والاستشارات القانونية. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
