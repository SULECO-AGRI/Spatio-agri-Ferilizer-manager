import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "./primitives/Logo";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#roi", label: "Approach" },
  { href: "#how-it-works", label: "Process" },
  { href: "#demo", label: "Live Demo" },
  { href: "#cta", label: "Contact" },
];

export function Nav() {
  const { open: openAuth } = useAuthModal();
  const { user, isAuthenticated, logout } = useAuth();
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
      rootMargin: "-40% 0px -40% 0px",
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

  const adminDisplayName = user
    ? user.firstName
      ? `Hi! Admin, ${user.firstName}`
      : "Hi! Admin"
    : "Hi! Admin";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 md:px-0 transition-all duration-300">
      <div
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 border border-slate-200/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            : "bg-zinc-950/30 border border-white/15 backdrop-blur-lg shadow-none"
        }`}
      >
        <Logo
          className={`shrink-0 transition-colors duration-300 ${
            isScrolled ? "text-[#062419]" : "text-white"
          }`}
        />

        {/* Navigation links with active sliding indicator */}
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

        {/* Right Auth & Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* "Hi! Admin, {firstName}" Badge Linking Directly to /admin */}
              <Link
                to="/admin"
                className={`group flex items-center gap-2 text-xs font-semibold transition-all duration-300 px-3.5 py-1.5 rounded-full border ${
                  isScrolled
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100/90 shadow-2xs"
                    : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/90 shadow-2xs"
                }`}
                title="Go to Admin Dashboard"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[150px] sm:max-w-none">{adminDisplayName}</span>
                <LayoutDashboard className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity ml-0.5" />
              </Link>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={() => logout()}
                className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-200 px-3 py-1.5 rounded-full border cursor-pointer ${
                  isScrolled
                    ? "text-slate-600 hover:text-rose-700 bg-slate-50 hover:bg-rose-50 border-slate-200 hover:border-rose-200"
                    : "text-zinc-300 hover:text-rose-300 bg-white/10 hover:bg-rose-950/40 border-white/15 hover:border-rose-500/40"
                }`}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline-block">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className={`text-xs sm:text-sm font-semibold transition-all duration-300 px-3.5 py-1.5 rounded-full ${
                  isScrolled
                    ? "text-slate-600 hover:text-[#062419] hover:bg-slate-100/70"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={() => openAuth()}
                className={`text-xs sm:text-sm font-semibold transition-all duration-300 px-4 py-1.5 rounded-full shadow-xs cursor-pointer ${
                  isScrolled
                    ? "bg-[#062419] hover:bg-[#0a3526] text-white"
                    : "bg-white hover:bg-slate-100 text-slate-950"
                }`}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Nav;
