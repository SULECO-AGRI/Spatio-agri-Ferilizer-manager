import { useState } from "react";
import { useAuthModal } from "../context/AuthModalContext";
import Icon from "./Icon.jsx";

const navItems = [
  { label: "Approach", href: "#roi" },
  { label: "Process", href: "#how-it-works" },
  { label: "Live Demo", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { open: openAuth } = useAuthModal();

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-5 md:px-gutter">
        <a href="#home" className="flex items-center gap-3" aria-label="Spatio Agri home">
          <img src="/logo.svg" alt="Spatio Agri logo" className="h-10 w-10" />
          <span className="font-heading text-lg font-bold text-primary md:text-xl">
            Spatio Agri
          </span>
        </a>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <button
            className="text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
            onClick={() => openAuth("signin")}
          >
            Log In
          </button>
          <a
            href="#contact"
            className="rounded-lg bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-container"
          >
            Book a Drone Scan
          </a>
          <Icon name="satellite_alt" className="text-primary" />
        </div>

        <button
          className="rounded-lg border border-outline-variant bg-white p-2 text-primary md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      {open && (
        <div className="border-t border-outline-variant bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-bold text-white"
            >
              Book a Drone Scan
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
