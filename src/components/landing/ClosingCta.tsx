import { useState } from "react";
import { Reveal } from "./primitives/Reveal";
import { GlowButton } from "./primitives/GlowButton";

export function ClosingCta() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <section id="cta" className="mx-auto max-w-6xl px-6 pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-accent p-10 text-accent-foreground shadow-[var(--shadow-elegant)] md:p-16">
          {/* Radar mesh */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "var(--gradient-radar)" }}
          />
          <svg
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] opacity-40"
          >
            {[80, 140, 200, 260].map((r) => (
              <circle
                key={r}
                cx="260"
                cy="260"
                r={r}
                fill="none"
                stroke="var(--color-primary-glow)"
                strokeOpacity="0.35"
              />
            ))}
            <g
              style={{
                transformOrigin: "260px 260px",
                animation: "radar-sweep 6s linear infinite",
              }}
            >
              <path
                d="M260 260 L 260 20 A 240 240 0 0 1 500 260 Z"
                fill="var(--color-primary-glow)"
                fillOpacity="0.15"
              />
            </g>
          </svg>

          <div className="relative max-w-2xl">
            <p className="mb-3 text-xs font-mono uppercase tracking-widest text-primary-glow">
              Get Started
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Ready to optimize your next yield?
            </h2>
            <p className="mt-4 max-w-lg text-white/70">
              Tell us where and when. A pilot in your county will reach out within one business day.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (valid) setDone(true);
              }}
              className="glow-edge mt-8 flex max-w-md items-center gap-1 rounded-xl bg-white/8 p-1.5 backdrop-blur"
              style={{ background: "color-mix(in oklab, white 8%, transparent)" }}
            >
              <label htmlFor="cta-email" className="sr-only">
                Email
              </label>
              <input
                id="cta-email"
                type="email"
                placeholder="you@farm.co"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setDone(false);
                }}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
              <GlowButton type="submit" disabled={!valid} className="disabled:opacity-60">
                {done ? "Received ✓" : "Book a Scan"}
              </GlowButton>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
