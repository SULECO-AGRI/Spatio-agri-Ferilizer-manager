import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Logo } from "./primitives/Logo";
import { GlowButton } from "./primitives/GlowButton";
import { useAuthModal } from "@/context/AuthModalContext";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#roi", label: "Approach" },
  { href: "#how-it-works", label: "Process" },
  { href: "#demo", label: "Live Demo" },
  { href: "#cta", label: "Contact" },
];

export function Nav() {
  const { open: openAuth } = useAuthModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["hero", "roi", "how-it-works", "demo", "cta"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Trigger when section occupies the middle 20% of the viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 md:px-0 transition-all duration-300">
      <div
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
          isScrolled
            ? "bg-white/70 border border-slate-200/50 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
            : "bg-zinc-950/20 border border-white/10 backdrop-blur-lg shadow-none"
        }`}
      >
        <Logo className={`shrink-0 transition-colors duration-300 ${isScrolled ? "text-[#062419]" : "text-white"}`} />

        {/* Navigation links for every page section with active sliding indicator line */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-all duration-300 ${
                  isActive
                    ? isScrolled
                      ? "text-emerald-600 font-semibold"
                      : "text-emerald-400 font-semibold"
                    : isScrolled
                      ? "text-slate-500 hover:text-[#062419]"
                      : "text-zinc-300 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                
                {/* Underline Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="activeIndicatorLine"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-emerald-500 rounded-full z-20 shadow-[0_1px_6px_rgba(16,185,129,0.3)]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Buttons on the right: Login and CTA */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className={`text-sm font-semibold transition-all duration-300 px-3.5 py-1.5 rounded-full ${
              isScrolled
                ? "text-slate-500 hover:text-[#062419] hover:bg-slate-900/5"
                : "text-zinc-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Admin
          </Link>
          <button
            onClick={() => openAuth("signin")}
            className={`text-sm font-semibold transition-all duration-300 px-3.5 py-1.5 rounded-full ${
              isScrolled
                ? "text-slate-500 hover:text-[#062419] hover:bg-slate-900/5"
                : "text-zinc-300 hover:text-white hover:bg-white/5"
            }`}
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
