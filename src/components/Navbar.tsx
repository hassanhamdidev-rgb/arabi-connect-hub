import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, LayoutDashboard, ChevronDown, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo-mark.png";

const navLinks: Array<{
  label: string;
  path: string;
  dropdown?: Array<{ label: string; path: string; icon: React.ComponentType<{ className?: string }>; desc: string }>;
}> = [
  { label: "الرئيسية", path: "/" },
  { label: "من نحن", path: "/about" },
  {
    label: "خدماتنا",
    path: "/services",
    dropdown: [
      { label: "فردي", path: "/services/individual", icon: User, desc: "خدمات قانونية للأفراد" },
      { label: "أعمال", path: "/services/business", icon: Briefcase, desc: "خدمات قانونية للشركات" },
    ],
  },
  { label: "المدونة", path: "/blog" },
  { label: "الأسئلة الشائعة", path: "/faq" },
  { label: "تواصل معنا", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [openDropdown]);

  // Close on route change
  useEffect(() => {
    setOpenDropdown(null);
    setOpenMobileSub(null);
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-4 right-0 left-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className={`backdrop-blur-xl border shadow-2xl rounded-full px-4 sm:px-6 py-2.5 transition-all duration-300 ${
            scrolled
              ? "bg-primary/80 border-primary-foreground/15"
              : "bg-primary/30 border-primary-foreground/15"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 pr-2">
              <img src={logo} alt="خالد عويد المجنوني" className="h-9 w-auto object-contain" />
              <span className="hidden sm:inline font-heading font-bold text-primary-foreground text-base">المجنوني</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => {
                const active = location.pathname === link.path || location.pathname.startsWith(link.path + "/");
                if (link.dropdown) {
                  const open = openDropdown === link.path;
                  return (
                    <div
                      key={link.path}
                      ref={open ? dropdownRef : null}
                      className="relative"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(open ? null : link.path)}
                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all inline-flex items-center gap-1 ${
                          active
                            ? "bg-primary-foreground/15 text-primary-foreground"
                            : "text-primary-foreground/70 hover:text-primary-foreground"
                        }`}
                        aria-expanded={open}
                      >
                        {link.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <div className="absolute top-full right-1/2 translate-x-1/2 mt-3 w-72 animate-fade-in z-50">
                          <div className="bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-2">
                            <Link
                              to={link.path}
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-sm font-medium text-foreground"
                            >
                              عرض جميع الخدمات
                            </Link>
                            <div className="h-px bg-border my-1" />
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                              >
                                <div className="w-9 h-9 rounded-lg gradient-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                  <item.icon className="w-4 h-4 text-secondary-foreground" />
                                </div>
                                <div>
                                  <div className="font-bold text-foreground text-sm">{item.label}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
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
              {navLinks.map((link) => {
                if (link.dropdown) {
                  const open = openMobileSub === link.path;
                  return (
                    <div key={link.path} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setOpenMobileSub(open ? null : link.path)}
                        className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-primary-foreground/85 hover:bg-primary-foreground/10"
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <div className="ms-3 mt-1 flex flex-col gap-1 border-r-2 border-primary-foreground/20 pr-3">
                          <Link
                            to={link.path}
                            className="px-3 py-2 rounded-xl text-sm text-primary-foreground/75 hover:bg-primary-foreground/10"
                          >
                            عرض جميع الخدمات
                          </Link>
                          {link.dropdown.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className="px-3 py-2 rounded-xl text-sm text-primary-foreground/75 hover:bg-primary-foreground/10 flex items-center gap-2"
                            >
                              <sub.icon className="w-4 h-4" />
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : "text-primary-foreground/75 hover:bg-primary-foreground/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="flex gap-2 mt-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="flex-1">
                    <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      لوحة التحكم
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth" className="flex-1">
                      <Button variant="outline" className="w-full rounded-full bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                        تسجيل الدخول
                      </Button>
                    </Link>
                    <Link to="/contact" className="flex-1">
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
