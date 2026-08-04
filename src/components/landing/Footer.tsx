import { useState } from "react";
import { Logo } from "./primitives/Logo";
import { Twitter, Linkedin, Youtube, Github, Mail, Send } from "lucide-react";

const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Approach", href: "#roi" },
      { label: "Process", href: "#how-it-works" },
      { label: "Live Demo", href: "#demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Support Center", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Data Processing", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "GitHub", href: "#", icon: Github },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-black text-zinc-400">
      <div className="mx-auto max-w-6xl px-6 py-6 md:py-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 pr-6">
            <Logo className="scale-90 origin-left text-white" />
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-zinc-500">
              Spatial intelligence for the next generation of farms. Drone and satellite telemetry
              turned into tractor-ready, variable-rate prescriptions.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubscribed(true);
              }}
              className="mt-2.5 flex max-w-xs items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-1"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubscribed(false);
                }}
                placeholder="you@farm.co"
                className="min-w-0 flex-1 bg-transparent px-2 py-1 text-xs text-white placeholder:text-zinc-600 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white transition-colors hover:bg-emerald-500"
              >
                <Send className="h-3 w-3" />
              </button>
            </form>
            {subscribed && (
              <p className="mt-1.5 text-xs text-emerald-400">Thanks — you're on the list.</p>
            )}

            <div className="mt-2.5 flex items-center gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-300">
                {group.title}
              </h3>
              <ul className="mt-2 space-y-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-500 transition-colors hover:text-emerald-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar: contact + legal + copyright, all in one row */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-zinc-900 pt-4 text-xs text-zinc-600 md:flex-row">
          <p>© {new Date().getFullYear()} Spatio Agri. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
              href="mailto:hello@spatioagri.com"
              className="flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-emerald-400"
            >
              <Mail className="h-3.5 w-3.5 text-emerald-500" />
              hello@spatioagri.com
            </a>
            <a href="#" className="transition-colors hover:text-zinc-400">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-zinc-400">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-zinc-400">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
