import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePreferencesStore } from "../store/usePreferencesStore";
import type { Language } from "../types";

export function useLanguage() {
  const { i18n } = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    // Set document direction and lang
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, i18n]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return {
    language,
    changeLanguage,
  };
}
