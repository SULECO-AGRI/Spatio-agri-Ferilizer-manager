const links = ["Privacy Policy", "Terms of Service", "Security", "Sustainability"];

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-white px-5 py-8 md:px-gutter">
      <div className="mx-auto flex max-w-container-max flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <a href="#home" className="font-heading text-lg font-extrabold text-primary">
            Spatio Agri
          </a>
          <span className="hidden h-4 w-px bg-outline-variant sm:block" />
          <p className="text-xs text-on-surface-variant">
            © 2026 Spatio Agri. Precision intelligence for modern growth.
          </p>
        </div>
        <nav className="flex flex-wrap gap-5" aria-label="Footer navigation">
          {links.map((link) => (
            <a
              key={link}
              href="#home"
              className="text-xs font-semibold text-on-surface-variant transition hover:text-primary"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
