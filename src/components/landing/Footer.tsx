import { Logo } from "./primitives/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-xs text-muted-foreground">
            Spatial intelligence for the next generation of farms.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <a className="hover:text-foreground" href="#workflow">
            Workflow
          </a>
          <a className="hover:text-foreground" href="#tech">
            Technology
          </a>
          <a className="hover:text-foreground" href="#roi">
            ROI
          </a>
          <a className="hover:text-foreground" href="#">
            Contact
          </a>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Spatio Agri</p>
      </div>
    </footer>
  );
}
