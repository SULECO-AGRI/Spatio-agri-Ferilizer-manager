import { memo } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "glass" | "light" | "compact";
  className?: string;
}

export const LanguageSwitcher = memo(function LanguageSwitcher({
  variant = "light",
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === "en" ? "si" : "en")}
        title={language === "en" ? "සිංහල භාෂාවට මාරු වන්න" : "Switch to English"}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer select-none border ${
          language === "si"
            ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs font-sinhala"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
        } ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="font-semibold">{language === "en" ? "EN" : "සිං"}</span>
      </button>
    );
  }

  if (variant === "glass") {
    return (
      <div
        className={`relative inline-flex items-center p-0.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20 select-none shadow-xs ${className}`}
        role="radiogroup"
        aria-label="Language selection"
      >
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-checked={language === "en"}
          role="radio"
          className={`relative z-10 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
            language === "en" ? "text-slate-900" : "text-white/80 hover:text-white"
          }`}
        >
          {language === "en" && (
            <motion.div
              layoutId="glassLangBubble"
              className="absolute inset-0 bg-white rounded-full -z-10 shadow-xs"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span>EN</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage("si")}
          aria-checked={language === "si"}
          role="radio"
          className={`relative z-10 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer font-sinhala ${
            language === "si" ? "text-slate-900" : "text-white/80 hover:text-white"
          }`}
        >
          {language === "si" && (
            <motion.div
              layoutId="glassLangBubble"
              className="absolute inset-0 bg-white rounded-full -z-10 shadow-xs"
              transition={{ type: "spring", stiffness: 450, damping: 32 }}
            />
          )}
          <span>සිංහල</span>
        </button>
      </div>
    );
  }

  // Default "light" variant for Admin Topbar / Standard pages
  return (
    <div
      className={`relative inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 select-none ${className}`}
      role="radiogroup"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-checked={language === "en"}
        role="radio"
        className={`relative z-10 flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-200 cursor-pointer ${
          language === "en" ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        {language === "en" && (
          <motion.div
            layoutId="lightLangBubble"
            className="absolute inset-0 bg-white rounded-md shadow-xs border border-slate-200/60 -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <span>English</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage("si")}
        aria-checked={language === "si"}
        role="radio"
        className={`relative z-10 flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-200 cursor-pointer font-sinhala ${
          language === "si"
            ? "text-emerald-900 font-semibold"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        {language === "si" && (
          <motion.div
            layoutId="lightLangBubble"
            className="absolute inset-0 bg-white rounded-md shadow-xs border border-emerald-200 -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <span>සිංහල</span>
      </button>
    </div>
  );
});

export default LanguageSwitcher;
