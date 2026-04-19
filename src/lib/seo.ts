import { SITE_URL, SITE_NAME } from "@/components/SEO";

const PHONE = "+966500000000";
const EMAIL = "info@khalid-almajnouni.com";
const STREET = "طريق الملك فهد";
const CITY = "الرياض";
const REGION = "منطقة الرياض";
const POSTAL = "11564";
const COUNTRY = "SA";
const LAT = 24.7136;
const LNG = 46.6753;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "مكتب المجنوني للمحاماة",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: PHONE,
  email: EMAIL,
  priceRange: "$$",
  description:
    "مكتب محاماة واستشارات قانونية متخصص في القضايا التجارية والعمالية والأحوال الشخصية في المملكة العربية السعودية.",
  address: {
    "@type": "PostalAddress",
    streetAddress: STREET,
    addressLocality: CITY,
    addressRegion: REGION,
    postalCode: POSTAL,
    addressCountry: COUNTRY,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: LAT,
    longitude: LNG,
  },
  areaServed: [
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "City", name: "Riyadh" },
    { "@type": "City", name: "Jeddah" },
    { "@type": "City", name: "Dammam" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "ar-SA",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export function breadcrumbsLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function articleLd(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image ?? `${SITE_URL}/og-image.jpg`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      "@type": "Person",
      name: opts.author ?? "خالد عويد المجنوني",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}${opts.path}`,
    inLanguage: "ar-SA",
  };
}

export function faqLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function serviceLd(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
  };
}
