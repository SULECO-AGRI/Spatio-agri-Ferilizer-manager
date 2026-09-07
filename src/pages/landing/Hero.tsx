import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { KineticPhrase } from "./primitives/KineticPhrase";
import HeroSprayingDrone from "../../Images/Hero_Spraying_Drone.jpg";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { open: openAuth } = useAuthModal();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const userDisplayName = user
    ? user.firstName
      ? isAdmin
        ? user.firstName.toLowerCase() === "admin"
          ? "Admin"
          : `Admin: ${user.firstName}`
        : user.firstName
      : isAdmin
        ? "Admin"
        : user.email.split("@")[0] || "User"
    : "User";

  // Raw cursor position normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ethereal Antigravity Physics: Heavy mass, low stiffness for sustained luxurious floating inertia
  const heavySpringConfig = { damping: 24, stiffness: 32, mass: 1.4 };
  const smoothX = useSpring(mouseX, heavySpringConfig);
  const smoothY = useSpring(mouseY, heavySpringConfig);

  // Faster spring for subtle foreground elements
  const lightSpringConfig = { damping: 30, stiffness: 45, mass: 1.0 };
  const smoothXFast = useSpring(mouseX, lightSpringConfig);
  const smoothYFast = useSpring(mouseY, lightSpringConfig);

  // LAYER 1: BOTTOM FOGGY BACKGROUND - Moving mouse down pulls background UP
  const bgFogY = useTransform(smoothY, [-0.5, 0.5], [48, -48]);
  const bgFogX = useTransform(smoothX, [-0.5, 0.5], [26, -26]);
  const bgScale = useTransform(smoothY, [-0.5, 0.5], [1.06, 1.12]);

  // LAYER 2: FLOATING DEBRIS FIELD & AGRI PARTICLES - Higher antigravity lift factor
  const debrisFieldY = useTransform(smoothY, [-0.5, 0.5], [92, -92]);
  const debrisFieldX = useTransform(smoothX, [-0.5, 0.5], [45, -45]);
  const debrisFieldRotate = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);

  // Secondary Fast Debris / Near-Camera Floating Pollen
  const nearDebrisY = useTransform(smoothY, [-0.5, 0.5], [130, -130]);
  const nearDebrisX = useTransform(smoothX, [-0.5, 0.5], [60, -60]);

  // LAYER 3: FOREMOST LAYER (Text & Navbar) - Subtle anchored depth
  const foremostY = useTransform(smoothYFast, [-0.5, 0.5], [-8, 8]);
  const foremostX = useTransform(smoothXFast, [-0.5, 0.5], [-6, 6]);

  // 3D Tilt for Outer Panel
  const panelRotateX = useTransform(smoothY, [-0.5, 0.5], [-1.6, 1.6]);
  const panelRotateY = useTransform(smoothX, [-0.5, 0.5], [1.6, -1.6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen max-h-screen h-[100dvh] max-h-[100dvh] box-border bg-[#cbd7bf] p-3 sm:p-4 md:p-5 lg:p-6 overflow-hidden flex flex-col"
      style={{ perspective: 1200 }}
    >
      {/* Outer Hero Card Frame with Subtle 3D Depth */}
      <motion.div
        style={{
          rotateX: panelRotateX,
          rotateY: panelRotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-[16px] sm:rounded-[20px] md:rounded-[24px] lg:rounded-[28px] bg-[#0d140e] border border-black/15 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden will-change-transform"
      >
        {/* ==================================================================== */}
        {/* LAYER 1 (BOTTOM LAYER): FOGGY LANDSCAPE & DRONE SPRAY BACKGROUND     */}
        {/* ==================================================================== */}
        <motion.div
          style={{
            x: bgFogX,
            y: bgFogY,
            scale: bgScale,
          }}
          className="absolute -inset-10 z-0 pointer-events-none select-none will-change-transform"
        >
          <img
            src={HeroSprayingDrone}
            alt="Agricultural spraying drone precision fertilizing green crop rows"
            className="w-full h-full object-cover object-center transform"
            loading="eager"
          />
          {/* Dense Atmospheric Fog and Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/30 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.45)_0%,_rgba(0,0,0,0.1)_55%,_rgba(0,0,0,0.85)_100%)]" />
          <div className="absolute inset-0 bg-grid-bg opacity-[0.03] mix-blend-overlay" />
        </motion.div>

        {/* ==================================================================== */}
        {/* LAYER 2 (MIDDLE LAYER): FLOATING DEBRIS FIELD & ETHEREAL PARTICLES   */}
        {/* ==================================================================== */}
        <motion.div
          style={{
            x: debrisFieldX,
            y: debrisFieldY,
            rotate: debrisFieldRotate,
          }}
          className="absolute -inset-12 z-10 pointer-events-none select-none overflow-hidden will-change-transform"
        >
          {/* Luminous Fog & Mist Clouds */}
          <div className="absolute top-[18%] left-[15%] w-80 h-80 rounded-full bg-emerald-500/15 blur-[100px]" />
          <div className="absolute bottom-[22%] right-[18%] w-96 h-96 rounded-full bg-amber-400/10 blur-[110px]" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-emerald-400/8 blur-[140px]" />

          {/* Floating Organic Seeds & Micro Particles (Mid-depth Debris) */}
          <div className="absolute top-[22%] left-[18%] w-2 h-2 rounded-full bg-emerald-200/50 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse" />
          <div className="absolute top-[28%] right-[22%] w-1.5 h-1.5 rounded-full bg-amber-300/60 shadow-[0_0_10px_rgba(252,211,77,0.9)] animate-pulse" style={{ animationDelay: "1.2s" }} />
          <div className="absolute top-[45%] left-[28%] w-2 h-2 rounded-full bg-emerald-300/45 shadow-[0_0_10px_rgba(110,231,183,0.8)] animate-pulse" style={{ animationDelay: "2.4s" }} />
          <div className="absolute top-[62%] right-[26%] w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: "0.8s" }} />
          <div className="absolute bottom-[28%] left-[24%] w-2.5 h-2.5 rounded-full bg-emerald-400/35 shadow-[0_0_14px_rgba(52,211,153,0.7)] animate-pulse" style={{ animationDelay: "1.8s" }} />
          <div className="absolute bottom-[35%] right-[30%] w-1.5 h-1.5 rounded-full bg-amber-200/40 shadow-[0_0_8px_rgba(253,230,138,0.7)] animate-pulse" style={{ animationDelay: "3s" }} />
        </motion.div>

        {/* Near-Camera Fast Debris Specks */}
        <motion.div
          style={{
            x: nearDebrisX,
            y: nearDebrisY,
          }}
          className="absolute -inset-16 z-15 pointer-events-none select-none overflow-hidden will-change-transform"
        >
          <div className="absolute top-[14%] right-[12%] w-3 h-3 rounded-full bg-emerald-100/30 blur-[0.5px] shadow-[0_0_16px_rgba(167,243,208,0.9)]" />
          <div className="absolute bottom-[20%] left-[12%] w-3 h-3 rounded-full bg-amber-100/30 blur-[0.5px] shadow-[0_0_16px_rgba(254,243,199,0.9)]" />
          <div className="absolute top-[52%] right-[15%] w-2 h-2 rounded-full bg-emerald-200/35 blur-[0.3px] shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
        </motion.div>

        {/* ==================================================================== */}
        {/* LAYER 3 (FOREMOST LAYER): NAVBAR & CENTER HEADLINE                   */}
        {/* ==================================================================== */}
        
        {/* Top Header / Navigation Bar */}
        <div className="relative z-50 w-full px-6 sm:px-10 lg:px-14 pt-5 sm:pt-7 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-white group cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white group-hover:text-emerald-300 transition-colors"
              >
                <path
                  d="M16 4C10 4 5 10 5 17C5 21 8 25 12 27C11.5 24 12 20 14 17C16 14 19 12 23 11C23 15 20 19 17 21C15 22.5 13 23 12 27C17 28 27 26 27 15C27 7 22 4 16 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              AgriFlyer
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium text-white/90">
            <a
              href="#hero"
              className="text-white hover:text-emerald-300 transition-colors duration-200 drop-shadow-sm"
            >
              Home
            </a>
            <a
              href="#roi"
              className="hover:text-emerald-300 transition-colors duration-200 drop-shadow-sm"
            >
              Approach
            </a>
            <a
              href="#how-it-works"
              className="hover:text-emerald-300 transition-colors duration-200 drop-shadow-sm"
            >
              Process
            </a>
            <a
              href="#demo"
              className="hover:text-emerald-300 transition-colors duration-200 drop-shadow-sm"
            >
              Demo
            </a>
            <a
              href="#cta"
              className="hover:text-emerald-300 transition-colors duration-200 drop-shadow-sm"
            >
              Contact
            </a>
          </nav>

          {/* Right Auth & Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile / Admin Button (Dropdown Trigger) */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  className="group flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white shadow-md cursor-pointer select-none"
                  title="Account menu"
                >
                  <span className="truncate max-w-[140px] sm:max-w-none">{userDisplayName}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 text-zinc-300 group-hover:text-white ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Light-Themed Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.2)] border border-slate-200 bg-white text-slate-800 z-[100]"
                      role="menu"
                    >
                      {/* User Profile Header */}
                      <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold truncate text-slate-900 leading-snug">
                          {user.firstName
                            ? `${user.firstName} ${user.lastName || ""}`.trim()
                            : isAdmin
                              ? "Administrator"
                              : "User"}
                        </p>
                        <p className="text-[11px] truncate text-slate-500 leading-tight mt-0.5">
                          {user.email}
                        </p>
                        <div className="mt-2">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-200/80">
                            {user.role || (isAdmin ? "Admin" : "User")}
                          </span>
                        </div>
                      </div>

                      {/* Admin Dashboard Link */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          role="menuitem"
                          className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      {isAdmin && <div className="my-1 border-t border-slate-100" />}

                      {/* Sign Out Action */}
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
              <button
                type="button"
                onClick={() => openAuth()}
                className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white px-3 py-1.5 transition-colors cursor-pointer hidden sm:block"
              >
                Login
              </button>
            )}

            <a
              href="#cta"
              className="group flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs sm:text-sm pl-4 pr-1.5 py-1.5 rounded-full shadow-lg transition-all duration-200"
            >
              <span>Contact Us</span>
              <div className="w-7 h-7 rounded-full bg-[#0d140e] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </div>
        </div>

        {/* Center Main Headline Section */}
        <motion.div
          style={{
            x: foremostX,
            y: foremostY,
          }}
          className="relative z-20 mx-auto flex flex-col items-center justify-center text-center px-4 sm:px-6 my-auto py-4 max-w-4xl w-full will-change-transform"
        >
          {/* Main Display Headline */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-white leading-[1.12] drop-shadow-md">
            The Next Generation of
            <br />
            <span className="text-white font-extrabold">
              <KineticPhrase
                phrases={[
                  "Farming is Here",
                  "Spray by the square.",
                  "Fertilize by the foot.",
                  "Seed by the zone.",
                ]}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-5 text-zinc-200 text-xs sm:text-sm md:text-base max-w-xl text-center leading-relaxed font-sans drop-shadow">
            Precision fertilizing powered by drone images. Apply only what your crops need, exactly where they need it.
          </p>
        </motion.div>

        {/* Subtle Bottom Bar Spacer */}
        <div className="relative z-10 w-full h-4 pointer-events-none" />

      </motion.div>
    </section>
  );
}
