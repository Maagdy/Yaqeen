import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import arCommon from '../locales/ar/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  ar: {
    common: arCommon,
  },
};

// Read persisted language from Zustand's localStorage before i18n initializes
// This ensures i18n and Zustand always agree — single source of truth
function getPersistedLanguage(): string {
  try {
    const raw = localStorage.getItem('Yaqeen-preferences');
    if (raw) {
      const parsed = JSON.parse(raw);
      const lang = parsed?.state?.language;
      if (lang === 'ar' || lang === 'en') return lang;
    }
  } catch {
    // Corrupted or missing — fall back
  }
  return 'ar'; // Default matches usePreferencesStore default
}

const initialLanguage = getPersistedLanguage();

// Apply dir and lang immediately to prevent flash of wrong direction
document.documentElement.lang = initialLanguage;
document.documentElement.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage, // Explicit — no detector needed
    defaultNS: 'common',
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
