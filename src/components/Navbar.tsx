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
    <nav className="fixed top-4 right-0 left-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Pill container — nextsense style */}
        <div className="bg-primary/90 backdrop-blur-xl border border-primary-foreground/10 shadow-2xl rounded-full px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 pr-2">
              <img src={logo} alt="خالد عويد المجنوني" className="h-9 w-auto object-contain" />
              <span className="hidden sm:inline font-heading font-bold text-primary-foreground text-base">المجنوني</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                      active
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : "text-primary-foreground/70 hover:text-primary-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* CTA + Auth */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button
                    size="sm"
                    className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-9 px-4"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    لوحة التحكم
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-9 px-4"
                    >
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      size="sm"
                      className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 h-9 px-4"
                    >
                      <Phone className="w-4 h-4" />
                      احجز استشارة
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full text-primary-foreground hover:bg-primary-foreground/10"
              aria-label="القائمة"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-2 bg-primary/95 backdrop-blur-xl border border-primary-foreground/10 shadow-2xl rounded-3xl p-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "text-primary-foreground/75 hover:bg-primary-foreground/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      لوحة التحكم
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                        تسجيل الدخول
                      </Button>
                    </Link>
                    <Link to="/contact" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                        احجز استشارة
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
