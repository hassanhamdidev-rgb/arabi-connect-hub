import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSocialLinks } from "@/hooks/useDirectus";
import { socialIconSvg } from "@/lib/socialIcons";

const Footer = () => {
  const { data: socialLinks = [] } = useSocialLinks();
  const links = socialLinks.filter((l) => l.status === "published");

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="خالد عويد المجنوني" className="h-16 w-auto rounded" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              مكتب خالد عويد المجنوني للمحاماة والاستشارات القانونية. نقدم خدمات قانونية متميزة بخبرة كبيرة في مجال المحاماه.
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
                { label: "المنشورات", path: "/blog" },
                { label: "تواصل معنا", path: "/contact" },
                { label: "سياسة الخصوصية", path: "/privacy" },
                { label: "الشروط والأحكام", path: "/terms" },
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
                <span dir="ltr">0555518556</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-4 h-4 shrink-0" />
                <span>support@lawkhalid.com</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">تابعنا</h3>
            <div className="flex flex-wrap gap-3">
              {links.length === 0 && (
                <span className="text-primary-foreground/50 text-sm">لا توجد روابط</span>
              )}
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <span className="w-4 h-4 block">{socialIconSvg(link.icon)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col  items-center justify-between gap-4 text-primary-foreground/60 text-sm">
          <p>© {new Date().getFullYear()} خالد عويد المجنوني للمحاماة والاستشارات القانونية. جميع الحقوق محفوظة.</p>
         
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">سياسة الخصوصية</Link>
            <span className="opacity-40">•</span>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
