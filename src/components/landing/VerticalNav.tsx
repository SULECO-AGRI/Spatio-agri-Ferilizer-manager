import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "roi", label: "Approach" },
  { id: "how-it-works", label: "Process" },
  { id: "demo", label: "Live Demo" },
  { id: "cta", label: "Contact" },
];

export function VerticalNav() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Triggers when the section takes up the center viewport area
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

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Page section navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-6 items-center bg-white/10 dark:bg-black/10 backdrop-blur-xs py-5 px-3 rounded-full border border-black/5 dark:border-white/5 shadow-lg shadow-black/5"
    >
      {/* Technical track line behind the dots */}
      <div className="absolute top-4 bottom-4 w-px border-l border-dashed border-slate-300 dark:border-slate-800 -z-10" />

      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <div key={section.id} className="group relative flex items-center justify-end">
            {/* Slide-out Glassmorphic Tooltip */}
            <span className="absolute right-8 py-1 px-2.5 rounded-md text-[10px] sm:text-xs font-semibold font-sans tracking-wide whitespace-nowrap bg-zinc-900/90 text-white backdrop-blur-md opacity-0 translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 border border-white/10 shadow-md">
              {section.label}
            </span>

            {/* Inactive & Active Dot Indicator */}
            <button
              onClick={() => scrollToSection(section.id)}
              aria-label={`Scroll to ${section.label}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500 scale-125 shadow-[0_0_10px_#10b981,0_0_20px_#10b981]"
                  : "bg-slate-300 dark:bg-slate-700 border border-black/10 dark:border-white/10 hover:scale-115 hover:bg-slate-400 dark:hover:bg-slate-500"
              }`}
            />
          </div>
        );
      })}
    </nav>
  );
}
