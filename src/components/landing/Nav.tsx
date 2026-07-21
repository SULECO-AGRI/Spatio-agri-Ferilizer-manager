import { Logo } from "./primitives/Logo";
import { GlowButton } from "./primitives/GlowButton";
import { useAuthModal } from "@/context/AuthModalContext";

export function Nav() {
  const { open: openAuth } = useAuthModal();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 md:px-0">
      <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 shadow-[0_4px_24px_-8px_color-mix(in_oklab,var(--color-accent)_18%,transparent)]">
        <Logo className="text-foreground shrink-0" />

        {/* Navigation links for every page section */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-muted-foreground">
          <a href="#hero" className="hover:text-foreground transition-colors">
            Home
          </a>
          <a href="#roi" className="hover:text-foreground transition-colors">
            Approach
          </a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            Process
          </a>
          <a href="#demo" className="hover:text-foreground transition-colors">
            Live Demo
          </a>
          <a href="#tech" className="hover:text-foreground transition-colors">
            Technology
          </a>
          <a href="#cta" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>

        {/* Buttons on the right: Login and CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => openAuth("signin")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-slate-900/5 dark:hover:bg-white/5"
          >
            Login
          </button>
          <GlowButton className="animate-[pulse-soft_2.4s_ease-in-out_infinite] text-xs sm:text-sm">
            Book a Drone Scan
          </GlowButton>
        </div>
      </div>
    </header>
  );
}
