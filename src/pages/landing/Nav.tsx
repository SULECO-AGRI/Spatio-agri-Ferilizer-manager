import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 40);
        rafId = null;
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
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
      ? user.firstName.toLowerCase() === "admin"
        ? "Admin"
        : `Admin: ${user.firstName}`
      : "Admin"
    : "Admin";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 md:px-0 transition-all duration-300">
      <div
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${isScrolled
          ? "bg-white/80 border border-slate-200/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          : "bg-zinc-950/30 border border-white/15 backdrop-blur-lg shadow-none"
          }`}
      >
        <Logo
          showIcon={false}
          className={`shrink-0 transition-colors duration-300 ${isScrolled ? "text-[#062419]" : "text-white"
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
                className={`relative py-1 transition-all duration-300 ${isActive
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
            <div className="relative" ref={dropdownRef}>
              {/* Admin Button (Dropdown Trigger) */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                className={`group flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 px-3.5 py-1.5 rounded-full border cursor-pointer select-none ${isScrolled
                  ? "bg-slate-100/80 hover:bg-slate-200/70 text-slate-800 border-slate-200/80 shadow-2xs"
                  : "bg-white/10 hover:bg-white/15 text-white border-white/20 shadow-2xs"
                  }`}
                title="Account menu"
              >
                <span className="truncate max-w-[140px] sm:max-w-none">{adminDisplayName}</span>

                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${isDropdownOpen ? "rotate-180" : ""
                    } ${isScrolled ? "text-slate-500 group-hover:text-slate-800" : "text-zinc-300 group-hover:text-white"}`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl p-1.5 shadow-xl border border-slate-200 bg-white text-slate-800 z-50"
                    role="menu"
                  >
                    {/* User Profile Header */}
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold truncate text-slate-900 leading-snug">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName || ""}`.trim()
                          : "Administrator"}
                      </p>
                      <p className="text-[11px] truncate text-slate-500 leading-tight mt-0.5">
                        {user.email}
                      </p>
                      <div className="mt-2">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-wider">
                          {user.role || "Admin"}
                        </span>
                      </div>
                    </div>

                    {/* Admin Dashboard Link */}
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                      className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <span>Admin Dashboard</span>
                    </Link>

                    <div className="my-1 border-t border-slate-100" />

                    {/* Red Sign Out Action */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      role="menuitem"
                      className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className={`text-xs sm:text-sm font-semibold transition-all duration-300 px-3.5 py-1.5 rounded-full ${isScrolled
                  ? "text-slate-600 hover:text-[#062419] hover:bg-slate-100/70"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={() => openAuth()}
                className={`text-xs sm:text-sm font-semibold transition-all duration-300 px-4 py-1.5 rounded-full shadow-xs cursor-pointer ${isScrolled
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
