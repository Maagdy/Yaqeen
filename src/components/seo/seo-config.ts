import type { SEOProps } from "./SEO";

export interface SEOPageConfig {
  en: Omit<SEOProps, "structuredData">;
  ar: Omit<SEOProps, "structuredData">;
}

export const SEO_CONFIG: Record<string, SEOPageConfig> = {
  home: {
    en: {
      title: "Home - Read, Listen & Learn Quran Online",
      description:
        "Access the Holy Quran with translations, audio recitations, tafsir, and Islamic content. Read, listen, and learn the Quran in Arabic and English with expert reciters.",
      keywords: [
        "Quran online",
        "Read Quran",
        "Quran recitation",
        "Islamic knowledge",
        "Quran audio",
        "Tafsir",
        "Hadith",
      ],
      url: "/",
    },
    ar: {
      title: "الرئيسية - اقرأ واستمع وتعلم القرآن الكريم",
      description:
        "الوصول إلى القرآن الكريم مع الترجمات والتلاوات الصوتية والتفسير والمحتوى الإسلامي. اقرأ واستمع وتعلم القرآن باللغة العربية والإنجليزية مع القراء الخبراء.",
      keywords: [
        "القرآن الكريم",
        "قراءة القرآن",
        "تلاوة القرآن",
        "المعرفة الإسلامية",
        "تفسير القرآن",
        "الحديث النبوي",
      ],
      url: "/",
    },
  },
  quran: {
    en: {
      title: "Quran - Browse Mushafs & Editions",
      description:
        "Browse different Quran editions and Mushafs. Read the Holy Quran in various scripts, translations, and formats. Find your preferred Quranic edition.",
      keywords: ["Quran Mushaf", "Quran editions", "Quran text", "Quranic scripts"],
      url: "/quran",
    },
    ar: {
      title: "القرآن - تصفح المصاحف والإصدارات",
      description:
        "تصفح إصدارات ومصاحف القرآن المختلفة. اقرأ القرآن الكريم بخطوط وترجمات وصيغ مختلفة. اعثر على إصدار القرآن المفضل لديك.",
      keywords: ["مصحف", "إصدارات القرآن", "نص القرآن", "خطوط المصحف"],
      url: "/quran",
    },
  },
  reciters: {
    en: {
      title: "Quran Reciters - Listen to Beautiful Recitations",
      description:
        "Listen to the Holy Quran recited by world-renowned Qaris. Browse Quran reciters, listen to beautiful recitations with different Rewaya and Maqamat.",
      keywords: [
        "Quran reciters",
        "Qaris",
        "Quran recitation",
        "Islamic audio",
        "Sheikh recitation",
        "Tajweed",
      ],
      url: "/reciters",
    },
    ar: {
      title: "القراء - استمع إلى تلاوات جميلة للقرآن",
      description:
        "استمع إلى القرآن الكريم بصوت قراء مشهورين عالميًا. تصفح قراء القرآن واستمع إلى التلاوات الجميلة بروايات ومقامات مختلفة.",
      keywords: [
        "قراء القرآن",
        "القراء",
        "تلاوة القرآن",
        "صوتيات إسلامية",
        "تلاوة الشيخ",
        "التجويد",
      ],
      url: "/reciters",
    },
  },
  radio: {
    en: {
      title: "Islamic Radio - Live Quran Streaming 24/7",
      description:
        "Listen to live Islamic radio stations streaming Quran recitations 24/7. Enjoy continuous Quranic recitations, Islamic lectures, and spiritual content.",
      keywords: [
        "Islamic radio",
        "Quran radio",
        "Live Quran",
        "Islamic streaming",
        "24/7 Quran",
      ],
      url: "/radio",
    },
    ar: {
      title: "الإذاعة الإسلامية - بث مباشر للقرآن على مدار الساعة",
      description:
        "استمع إلى محطات الراديو الإسلامية التي تبث تلاوات القرآن على مدار الساعة. استمتع بالتلاوات القرآنية والمحاضرات الإسلامية والمحتوى الروحي.",
      keywords: [
        "إذاعة إسلامية",
        "إذاعة القرآن",
        "بث مباشر للقرآن",
        "بث إسلامي",
        "قرآن على مدار الساعة",
      ],
      url: "/radio",
    },
  },
  hadiths: {
    en: {
      title: "Hadith - Prophetic Traditions & Collections",
      description:
        "Read authentic Hadith collections including Sahih Bukhari, Sahih Muslim, and more. Explore the sayings and teachings of Prophet Muhammad (PBUH).",
      keywords: [
        "Hadith",
        "Sunnah",
        "Prophet Muhammad",
        "Sahih Bukhari",
        "Sahih Muslim",
        "Islamic teachings",
      ],
      url: "/hadiths",
    },
    ar: {
      title: "الحديث - الأحاديث النبوية والمجموعات",
      description:
        "اقرأ مجموعات الأحاديث الصحيحة بما في ذلك صحيح البخاري وصحيح مسلم والمزيد. استكشف أقوال وتعاليم النبي محمد صلى الله عليه وسلم.",
      keywords: [
        "الحديث النبوي",
        "السنة",
        "النبي محمد",
        "صحيح البخاري",
        "صحيح مسلم",
        "التعاليم الإسلامية",
      ],
      url: "/hadiths",
    },
  },
  search: {
    en: {
      title: "Search the Quran",
      description:
        "Search the Holy Quran with advanced search features. Find verses, topics, and keywords across the entire Quran in multiple languages.",
      keywords: ["Quran search", "Find verses", "Quran keywords", "Search Holy Book"],
      url: "/search",
    },
    ar: {
      title: "البحث في القرآن",
      description:
        "ابحث في القرآن الكريم بميزات بحث متقدمة. ابحث عن الآيات والمواضيع والكلمات الرئيسية في القرآن بلغات متعددة.",
      keywords: ["البحث في القرآن", "البحث عن الآيات", "كلمات القرآن"],
      url: "/search",
    },
  },
  profile: {
    en: {
      title: "My Profile - Personal Quran Journey",
      description:
        "Manage your personal Quran reading journey. Track your progress, save favorite verses, and customize your reading preferences.",
      keywords: ["Profile", "Quran progress", "Favorites", "Bookmarks"],
      url: "/profile",
      noindex: true,
    },
    ar: {
      title: "ملفي الشخصي - رحلتي مع القرآن",
      description:
        "إدارة رحلتك الشخصية في قراءة القرآن. تتبع تقدمك واحفظ الآيات المفضلة وخصص تفضيلات القراءة الخاصة بك.",
      keywords: ["الملف الشخصي", "تقدم القرآن", "المفضلات", "العلامات"],
      url: "/profile",
      noindex: true,
    },
  },
  auth: {
    en: {
      title: "Sign In - Join Yaqeen Islamic",
      description:
        "Sign in to access your personal Quran journey, save favorites, track progress, and sync across devices.",
      keywords: ["Sign in", "Login", "Register", "Create account"],
      url: "/auth",
      noindex: true,
    },
    ar: {
      title: "تسجيل الدخول - انضم إلى يقين الإسلامية",
      description:
        "سجل الدخول للوصول إلى رحلتك الشخصية مع القرآن وحفظ المفضلات وتتبع التقدم والمزامنة عبر الأجهزة.",
      keywords: ["تسجيل الدخول", "إنشاء حساب"],
      url: "/auth",
      noindex: true,
    },
  },
};

// Structured data for the website
export const getWebsiteStructuredData = (language: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yaqeen Islamic",
  alternateName: language === "ar" ? "يقين الإسلامية" : "Yaqeen Islamic Website",
  url: import.meta.env.VITE_SITE_URL || "https://yaqeen-islamic.vercel.app",
  description:
    language === "ar"
      ? "موقع إسلامي شامل للقرآن الكريم والحديث والتفسير"
      : "Comprehensive Islamic website for Quran, Hadith, and Tafsir",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${import.meta.env.VITE_SITE_URL || "https://yaqeen-islamic.vercel.app"}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yaqeen Islamic",
  url: import.meta.env.VITE_SITE_URL || "https://yaqeen-islamic.vercel.app",
  logo: `${import.meta.env.VITE_SITE_URL || "https://yaqeen-islamic.vercel.app"}/logo.png`,
  sameAs: [
    // Add social media links here when available
  ],
});
