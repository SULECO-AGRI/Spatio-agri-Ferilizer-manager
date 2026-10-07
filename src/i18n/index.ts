import { en } from "./locales/en";
import { si } from "./locales/si";
import type { SupportedLanguage, TranslationDictionary } from "./types";

export * from "./types";

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  si,
};

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const LANGUAGE_STORAGE_KEY = "spatioagri_language";

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "si", label: "Sinhala", nativeLabel: "සිංහල" },
];
