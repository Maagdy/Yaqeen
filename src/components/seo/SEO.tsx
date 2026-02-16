import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/hooks";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  structuredData?: object;
  noindex?: boolean;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image = "/logo.png",
  url,
  type = "website",
  structuredData,
  noindex = false,
  canonical,
}) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const siteName = "Yaqeen Islamic";
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://yaqeen-islamic.vercel.app";
  const fullTitle = `${title} | ${siteName}`;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;

  const defaultKeywords = [
    "Quran",
    "Islam",
    "القرآن",
    "إسلام",
    "Quranic Reciters",
    "Islamic Radio",
    "Tafsir",
    "Hadith",
    "Muslim",
    "Islamic Website",
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return (
    <Helmet>
      <html lang={language} dir={isRTL ? "rtl" : "ltr"} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(", ")} />

      {canonical && <link rel="canonical" href={canonical} />}
      {!canonical && <link rel="canonical" href={fullUrl} />}

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={language === "ar" ? "ar_AR" : "en_US"} />
      <meta property="og:locale:alternate" content={language === "ar" ? "en_US" : "ar_AR"} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@YaqeenIslamic" />
      <meta name="twitter:creator" content="@YaqeenIslamic" />

      <meta name="author" content="Yaqeen Islamic" />
      <meta name="publisher" content="Yaqeen Islamic" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="theme-color" content="#10b981" />
      <meta name="msapplication-TileColor" content="#10b981" />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
