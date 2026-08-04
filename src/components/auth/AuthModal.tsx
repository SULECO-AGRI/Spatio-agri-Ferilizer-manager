import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthModal } from "../../context/AuthModalContext";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthModal() {
  const { isOpen, mode, close, open } = useAuthModal();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  const switchMode = (newMode: "signin" | "signup") => {
    if (mode !== newMode) {
      open(newMode);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[4px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-100/50 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sliding Pill Tab Header */}
            <div className="mb-6 flex justify-center">
              <div className="relative flex p-1 bg-slate-100 rounded-full">
                {/* Sign In Tab Button */}
                <button
                  className="relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 w-28"
                  onClick={() => switchMode("signin")}
                >
                  <span
                    className={`transition-colors duration-300 ${
                      mode === "signin" ? "text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign In
                  </span>
                  {mode === "signin" && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-emerald-600 rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>

                {/* Sign Up Tab Button */}
                <button
                  className="relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 w-28"
                  onClick={() => switchMode("signup")}
                >
                  <span
                    className={`transition-colors duration-300 ${
                      mode === "signup" ? "text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign Up
                  </span>
                  {mode === "signup" && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-emerald-600 rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Smooth Form Switch Container */}
            <div className="relative w-full min-h-[372px] flex items-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ x: mode === "signin" ? -20 : 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: mode === "signin" ? 20 : -20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="w-full"
                >
                  {mode === "signin" ? <SignInForm /> : <SignUpForm />}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none"
              aria-label="Close"
              onClick={close}
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
