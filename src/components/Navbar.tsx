import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo-mark.png";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "من نحن", path: "/about" },
  { label: "خدماتنا", path: "/services" },
  { label: "المدونة", path: "/blog" },
  { label: "الأسئلة الشائعة", path: "/faq" },
  { label: "تواصل معنا", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="خالد عويد المجنوني" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">تسجيل الدخول</Button>
              </Link>
            )}
            <Link to="/contact">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <Phone className="w-4 h-4" />
                احجز استشارة
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 px-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      لوحة التحكم
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                  </Link>
                )}
                <Link to="/contact" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">احجز استشارة</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
