import { useEffect, useState } from "react";

export const SITE_LANGUAGE_STORAGE_KEY = "ceylon-explore-language";

export const SITE_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "si", label: "Sinhala" },
  { value: "ta", label: "Tamil" },
  { value: "hi", label: "Hindi" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ar", label: "Arabic" },
  { value: "ru", label: "Russian" },
  { value: "nl", label: "Dutch" },
];

export const SITE_LANGUAGE_DATE_LOCALES = {
  en: "en-US",
  si: "si-LK",
  ta: "ta-LK",
  hi: "hi-IN",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
  pt: "pt-PT",
  ar: "ar-SA",
  ru: "ru-RU",
  nl: "nl-NL",
};

function mergeLocalizedCopy(baseCopy, localizedCopy) {
  if (localizedCopy === undefined) {
    return baseCopy;
  }

  if (
    baseCopy === null ||
    localizedCopy === null ||
    typeof baseCopy !== "object" ||
    typeof localizedCopy !== "object" ||
    Array.isArray(baseCopy) ||
    Array.isArray(localizedCopy)
  ) {
    return localizedCopy;
  }

  const mergedCopy = { ...baseCopy };

  Object.keys(localizedCopy).forEach((key) => {
    mergedCopy[key] = mergeLocalizedCopy(baseCopy?.[key], localizedCopy[key]);
  });

  return mergedCopy;
}

export function getLocalizedSiteCopy(copyByLanguage, language) {
  const baseCopy = copyByLanguage.en || {};
  const localizedCopy = copyByLanguage[language];

  return localizedCopy ? mergeLocalizedCopy(baseCopy, localizedCopy) : baseCopy;
}

export function getStoredSiteLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(SITE_LANGUAGE_STORAGE_KEY);
  return SITE_LANGUAGE_OPTIONS.some((option) => option.value === storedLanguage) ? storedLanguage : "en";
}

export function useSiteLanguage() {
  const [language, setLanguage] = useState(getStoredSiteLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SITE_LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  return { language, setLanguage };
}