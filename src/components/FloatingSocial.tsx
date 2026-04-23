import { Facebook, Twitter, Linkedin, MessageCircle, Phone } from "lucide-react";

const socials = [
  { Icon: Facebook, label: "فيسبوك", href: "https://facebook.com" },
  { Icon: Twitter, label: "تويتر / X", href: "https://twitter.com" },
  { Icon: Linkedin, label: "لينكدإن", href: "https://linkedin.com" },
  { Icon: MessageCircle, label: "واتساب", href: "https://wa.me/966500000000" },
];

const PHONE = "+966500000000";
const PHONE_DISPLAY = "+966 50 000 0000";

const FloatingSocial = () => {
  return (
    <>
      {/* Left rail — vertical socials, icon above icon */}
      <aside
        aria-label="روابط التواصل الاجتماعي"
        className="hidden md:flex fixed left-3 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 p-2 rounded-full bg-card/70 backdrop-blur-md border border-border shadow-lg"
      >
        {socials.map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group relative w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all hover:scale-110"
          >
            <Icon className="w-4 h-4" />
            <span className="absolute right-full mr-2 whitespace-nowrap text-xs bg-foreground text-background px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {label}
            </span>
          </a>
        ))}
      </aside>

      {/* Right rail — call CTA */}
      <aside
        aria-label="اتصل بنا"
        className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2"
      >
        <a
          href={`tel:${PHONE}`}
          className="group flex flex-col items-center gap-2 px-2.5 py-4 rounded-full gradient-gold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          <span className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Phone className="w-4 h-4 text-secondary-foreground" />
          </span>
          <span
            dir="ltr"
            className="text-secondary-foreground text-[11px] font-bold tracking-tight"
            style={{ writingMode: "vertical-rl" }}
          >
            {PHONE_DISPLAY}
          </span>
        </a>
      </aside>

      {/* Mobile floating call button */}
      <a
        href={`tel:${PHONE}`}
        aria-label="اتصل بنا"
        className="md:hidden fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full gradient-gold shadow-xl flex items-center justify-center"
      >
        <Phone className="w-5 h-5 text-secondary-foreground" />
      </a>
    </>
  );
};

export default FloatingSocial;
