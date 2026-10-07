import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  translations,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  type SupportedLanguage,
  type TranslationDictionary,
} from "@/i18n";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (path: string, fallback?: string) => string;
  dict: TranslationDictionary;
  isSinhala: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to access nested keys like "admin.tabs.dashboard"
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
        if (stored === "en" || stored === "si") {
          return stored;
        }
      } catch {
        // Fallback silently if localStorage is restricted
      }
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch {
        // Fallback silently
      }
      document.documentElement.lang = newLang;
      document.documentElement.setAttribute("data-lang", newLang);
      if (newLang === "si") {
        document.documentElement.classList.add("font-sinhala");
      } else {
        document.documentElement.classList.remove("font-sinhala");
      }
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "si" : "en");
  }, [language, setLanguage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.setAttribute("data-lang", language);
      if (language === "si") {
        document.documentElement.classList.add("font-sinhala");
      } else {
        document.documentElement.classList.remove("font-sinhala");
      }
    }
  }, [language]);

  const dict = useMemo(() => translations[language] || translations.en, [language]);

  const t = useCallback(
    (path: string, fallback?: string): string => {
      const currentVal = getNestedValue(dict as unknown as Record<string, unknown>, path);
      if (typeof currentVal === "string") {
        return currentVal;
      }
      // Fallback to English translation
      const enVal = getNestedValue(translations.en as unknown as Record<string, unknown>, path);
      if (typeof enVal === "string") {
        return enVal;
      }
      return fallback || path;
    },
    [dict],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      dict,
      isSinhala: language === "si",
    }),
    [language, setLanguage, toggleLanguage, t, dict],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, dict, language, isSinhala } = useLanguage();
  return { t, dict, language, isSinhala };
}
