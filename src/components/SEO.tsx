import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://khalid-almajnouni.com";
export const SITE_NAME = "خالد عويد المجنوني للمحاماة والاستشارات القانونية";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Geographic targeting — Riyadh, Saudi Arabia
export const GEO = {
  region: "SA-01", // Riyadh region (ISO 3166-2)
  placename: "Riyadh, Saudi Arabia",
  position: "24.7136;46.6753",
  icbm: "24.7136, 46.6753",
};

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  keywords?: string[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const SEO = ({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  keywords = [],
  jsonLd,
  noindex,
  publishedTime,
  modifiedTime,
  author,
}: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle =
    title.length > 60 ? title.slice(0, 57) + "..." : title;
  const desc =
    description.length > 160 ? description.slice(0, 157) + "..." : description;
  const kw = [
    "محاماة",
    "استشارات قانونية",
    "محامي الرياض",
    "خالد المجنوني",
    "قانون سعودي",
    ...keywords,
  ].join("، ");

  const ldArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={kw} />
      {author && <meta name="author" content={author} />}
      <link rel="canonical" href={url} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Geo / Local SEO */}
      <meta name="geo.region" content={GEO.region} />
      <meta name="geo.placename" content={GEO.placename} />
      <meta name="geo.position" content={GEO.position} />
      <meta name="ICBM" content={GEO.icbm} />

      {/* Language */}
      <html lang="ar" dir="rtl" />
      <meta httpEquiv="content-language" content="ar-SA" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ar_SA" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && type === "article" && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* Structured data */}
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
