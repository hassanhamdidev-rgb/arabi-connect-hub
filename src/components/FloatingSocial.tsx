import { Phone } from "lucide-react";

const socials: Array<{ label: string; href: string; svg: JSX.Element }> = [
  {
    label: "فيسبوك",
    href: "https://facebook.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
      </svg>
    ),
  },
  {
    label: "تويتر / X",
    href: "https://twitter.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2H21l-6.52 7.45L22 22h-6.79l-4.74-6.2L4.8 22H2l7-8L2 2h6.91l4.27 5.66L18.244 2Zm-2.38 18h1.88L7.21 4H5.2l10.66 16Z" />
      </svg>
    ),
  },
  {
    label: "لينكدإن",
    href: "https://linkedin.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
      </svg>
    ),
  },
  {
    label: "واتساب",
    href: "https://wa.me/966500000000",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.49 1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.5 9.5 0 0 1-4.84-1.32l-.35-.21-3.6.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.07c0-5.23 4.27-9.49 9.51-9.49a9.45 9.45 0 0 1 6.72 2.78 9.43 9.43 0 0 1 2.79 6.71c-.01 5.23-4.27 9.52-9.5 9.52ZM20.52 3.45A11.42 11.42 0 0 0 12.04 0C5.74 0 .61 5.13.61 11.43c0 2.01.53 3.97 1.52 5.7L.5 24l6.99-1.83a11.4 11.4 0 0 0 5.45 1.39h.01c6.3 0 11.43-5.13 11.43-11.43 0-3.05-1.19-5.92-3.36-8.08Z" />
      </svg>
    ),
  },
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
        {socials.map(({ svg, label, href }) => (
          <a
            key={label}
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
