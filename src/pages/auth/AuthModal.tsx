import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";
import { SignInForm } from "./SignInForm";

export function AuthModal() {
  const { isOpen, close } = useAuthModal();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-md bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-200/80 overflow-hidden font-sans text-center"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
              onClick={close}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Branding */}
            <div className="flex flex-col items-center mb-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#062419] flex items-center justify-center shadow-md">
                <svg className="w-7 h-7" viewBox="0 0 32 32">
                  <rect width="32" height="32" rx="8" fill="#062419" />
                  <path d="M9 21c4-1 7-4 8-12 5 4 5 12-1 14-3 1-6-.5-7-2Z" fill="#10b981" />
                  <path
                    d="M9 21c3-1 6-4 8-12"
                    stroke="#d1fae5"
                    strokeOpacity="0.7"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-medium text-slate-900 tracking-tight font-display">
                  Welcome to Fertilizer Manager
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-1 max-w-xs mx-auto">
                  Sign in with your administrator credentials to access the precision fertilizer
                  management portal
                </p>
              </div>
            </div>

            {/* Direct Form */}
            <SignInForm onSuccess={close} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
