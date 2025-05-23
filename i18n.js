import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
import en from './translations/en.json';
import zh from './translations/zh.json';
import tl from './translations/tl.json';
import ma from './translations/ma.json';


i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en', // Default to English (override auto-detection)
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      tl: { translation: tl },
      ma: { translation: ma },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;