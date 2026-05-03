import { useState } from "react";
import { Phone, Plus, X } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useSocialLinks } from "@/hooks/useDirectus";
import { socialIconSvg } from "@/lib/socialIcons";

const PHONE = "0555518556";
const PHONE_DISPLAY = "0555518556";

const FloatingSocial = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: socialLinks = [] } = useSocialLinks();
  const socials = socialLinks
    .filter((l) => l.status === "published")
    .map((l) => ({ label: l.name, href: l.url, svg: <span className="w-4 h-4 block">{socialIconSvg(l.icon)}</span> }));

  const handleCallWithToast = () => {
    navigator.clipboard.writeText(PHONE);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رقم الهاتف بنجاح",
      duration: 2000,
    });
    window.location.href = `tel:${PHONE}`;
  };

  const ITEM_SIZE = 40;
  const FAB_SIZE = 48;
  const MIN_RADIUS = FAB_SIZE / 2 + ITEM_SIZE / 2 + 8;
  const RADIUS = Math.max(MIN_RADIUS, 60 + socials.length * 6);
  const positions = socials.map((_, i) => {
    const startDeg = -95;
    const endDeg = 0;
    const t = socials.length === 1 ? 0 : i / (socials.length - 1);
    const angle = (startDeg + (endDeg - startDeg) * t) * (Math.PI / 180);
    return { x: Math.cos(angle) * RADIUS, y: Math.sin(angle) * RADIUS };
  });

  if (socials.length === 0) {
    // Still render call buttons
  }

  return (
    <>
      {/* Left rail — vertical socials, desktop only */}
      {socials.length > 0 && (
        <aside
          aria-label="روابط التواصل الاجتماعي"
          className="hidden md:flex fixed left-3 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 p-2 rounded-full bg-card/70 backdrop-blur-md border border-border shadow-lg"
        >
          {socials.map(({ svg, label, href }) => (
            <a
              key={label + href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group relative w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all hover:scale-110"
            >
              {svg}
              <span className="absolute right-full mr-2 whitespace-nowrap text-xs bg-foreground text-background px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {label}
              </span>
            </a>
          ))}
        </aside>
      )}

      {/* Right rail — call CTA */}
      <aside
        aria-label="اتصل بنا"
        className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2"
      >
        <a
          href={`tel:${PHONE}`}
          onClick={handleCallWithToast}
          className="group flex flex-col items-center gap-2 px-2.5 py-4 rounded-full gradient-gold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          <span className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Phone className="w-4 h-4 text-secondary-foreground" />
          </span>
          <span dir="ltr" className="text-secondary-foreground text-[11px] font-bold tracking-tight" style={{ writingMode: "vertical-rl" }}>
            {PHONE_DISPLAY}
          </span>
        </a>
      </aside>

      {/* Mobile — radial fan */}
      {socials.length > 0 && (
        <div className="md:hidden fixed bottom-5 left-5 z-40">
          {open && (
            <button
              aria-label="إغلاق"
              onClick={() => setOpen(false)}
              className="fixed inset-0 -z-10 bg-foreground/10 backdrop-blur-[2px] animate-fade-in"
            />
          )}
          <div className="relative w-12 h-12">
            {socials.map(({ label, href, svg }, i) => {
              const { x, y } = positions[i];
              return (
                <a
                  key={label + href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  tabIndex={open ? 0 : -1}
                  style={{
                    transform: open
                      ? `translate(${x}px, ${y}px) scale(1)`
                      : "translate(0,0) scale(0.4)",
                    transitionDelay: open ? `${i * 40}ms` : "0ms",
                  }}
                  className={`absolute left-1 top-1 w-10 h-10 rounded-full flex items-center justify-center
                    bg-card text-primary border border-border shadow-lg
                    transition-all duration-300 ease-out
                    hover:bg-accent hover:text-accent-foreground hover:scale-110
                    ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                >
                  {svg}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "إغلاق روابط التواصل" : "فتح روابط التواصل"}
              className="relative w-12 h-12 rounded-full gradient-teal shadow-xl flex items-center justify-center text-primary-foreground transition-transform active:scale-95"
            >
              <span className={`absolute transition-all duration-300 ${open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}>
                <Plus className="w-5 h-5" />
              </span>
              <span className={`absolute transition-all duration-300 ${open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}>
                <X className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile call button */}
      <a
        href={`tel:${PHONE}`}
        onClick={handleCallWithToast}
        aria-label="اتصل بنا"
        className="md:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full gradient-gold shadow-xl flex items-center justify-center"
      >
        <Phone className="w-5 h-5 text-secondary-foreground" />
      </a>
    </>
  );
};

export default FloatingSocial;
