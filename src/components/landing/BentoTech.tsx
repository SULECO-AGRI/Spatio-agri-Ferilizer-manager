import { motion } from "framer-motion";
import { Reveal, staggerParent, staggerChild } from "./primitives/Reveal";
import { RoiCalculator } from "./RoiCalculator";

export function BentoTech() {
  return (
    <section id="tech" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-primary">
          The Framework
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          A full spatial stack — drone, satellite, prescription, ROI.
        </h2>
      </Reveal>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2"
      >
        <Tile className="md:col-span-4 md:row-span-1">
          <Header eyebrow="01 · Ground Layer" title="Drone Telemetry" />
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Multispectral capture at 2cm/px. Six-band imaging locates crop stress before the naked
            eye can.
          </p>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {["NDVI", "NDRE", "RGB", "LiDAR"].map((label) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.06 }}
                className="rounded-lg border border-border bg-surface px-3 py-4 text-center font-mono text-[11px] text-muted-foreground"
              >
                <div className="mb-1 text-foreground">{label}</div>
                <div className="text-primary">●</div>
              </motion.div>
            ))}
          </div>
        </Tile>

        <Tile className="md:col-span-2 md:row-span-2 overflow-hidden">
          <Header eyebrow="02 · Sky Layer" title="Satellite Macro-Tracking" />
          <p className="mt-2 text-sm text-muted-foreground">
            Weekly Sentinel-2 & Landsat passes fuse with ground truth.
          </p>

          <div className="relative mt-6 aspect-square w-full">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <defs>
                <radialGradient id="earth" cx="35%" cy="35%">
                  <stop offset="0%" stopColor="var(--color-primary-glow)" />
                  <stop offset="60%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="60" fill="url(#earth)" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeOpacity="0.15" />
              {[70, 80, 90].map((r, i) => (
                <ellipse
                  key={i}
                  cx="100"
                  cy="100"
                  rx={r}
                  ry={r * 0.35}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeOpacity={0.3 - i * 0.08}
                  transform={`rotate(${-25 + i * 15} 100 100)`}
                />
              ))}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
              >
                <circle cx="180" cy="100" r="3" fill="var(--color-primary-glow)" />
                <circle
                  cx="180"
                  cy="100"
                  r="6"
                  fill="var(--color-primary-glow)"
                  fillOpacity="0.3"
                />
              </motion.g>
            </svg>
          </div>
          <div className="mt-2 font-mono text-[10px] text-muted-foreground">Next pass · 4d 12h</div>
        </Tile>

        <Tile className="md:col-span-2 md:row-span-1">
          <Header eyebrow="03 · Compute" title="Prescription Engine" />
          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-3 space-y-1.5 text-sm text-muted-foreground"
          >
            {[
              "Variable-rate grids ≤ 3m",
              "ISOBUS + shapefile export",
              "Field-boundary auto-detect",
            ].map((t) => (
              <motion.li variants={staggerChild} key={t} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" /> {t}
              </motion.li>
            ))}
          </motion.ul>
        </Tile>

        <Tile id="roi" className="md:col-span-2 md:row-span-1 glow-edge bg-card">
          <RoiCalculator />
        </Tile>
      </motion.div>
    </section>
  );
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </div>
      <div className="mt-1 font-display text-xl font-semibold text-foreground">{title}</div>
    </>
  );
}

function Tile({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      variants={staggerChild}
      whileHover={{ y: -4 }}
      className={`rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 ${className}`}
    >
      {children}
    </motion.div>
  );
}
