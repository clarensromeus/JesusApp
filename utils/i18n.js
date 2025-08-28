// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import * as Localization from "react-native-localize"; // Commented out for Expo Go compatibility

import en from "../locales/en.json";
import es from "../locales/es.json";
import fr from "../locales/fr.json";

// const fallback = { "languageTag" : "en", "isRTL" : false };
// const { languageTag } =
//   Localization.findBestAvailableLanguage(["en", "fr", "es"]) || fallback;

// Default to English for Expo Go compatibility
const languageTag = "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: languageTag,
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
