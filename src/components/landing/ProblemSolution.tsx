import { CircleCheck, TriangleAlert, Check, X } from "lucide-react";
import { Reveal, staggerParent, staggerChild } from "./primitives/Reveal";
import { motion } from "framer-motion";

const comparisons = [
  {
    title: "Traditional Farming",
    badge: "The Problem",
    badgeClass: "bg-red-500/10 text-red-300 border-red-500/20",
    icon: TriangleAlert,
    bulletIcon: X,
    accent: "border-red-500/20 hover:border-red-500/40 hover:shadow-red-950/20",
    iconClass: "text-red-400 bg-red-950/40 border-red-500/20",
    cardClass: "border-red-950/10",
    overlayClass: "bg-gradient-to-t from-stone-950 via-stone-950/90 to-stone-950/50",
    body: "Blanket application wastes fertilizer and chemicals. Treating an entire field as one unit means healthy areas are over-applied while stressed zones are still under-supported.",
    bullets: ["Runoff into local watersheds", "Skyrocketing input costs"],
    imageUrl:
      "https://images.unsplash.com/photo-1627920769842-6887c6df05ca?auto=format&fit=crop&w=800&q=80",
    bulletClass: "text-red-200 bg-red-950/30 border-red-500/10 hover:bg-red-950/45",
  },
  {
    title: "Spatio Agri Precision",
    badge: "The Solution",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    icon: CircleCheck,
    bulletIcon: Check,
    accent:
      "border-emerald-500/20 hover:border-emerald-500/45 hover:shadow-emerald-950/20 glow-edge",
    iconClass: "text-emerald-400 bg-emerald-950/40 border-emerald-500/25",
    cardClass: "border-emerald-950/10",
    overlayClass: "bg-gradient-to-t from-emerald-950 via-emerald-950/90 to-zinc-950/50",
    body: "Variable-rate precision delivers the exact fertilizer rate to the exact grid coordinate. Reduce waste while helping each crop zone receive what it needs.",
    bullets: ["Up to 25% yield increase", "Automated VRA export files"],
    imageUrl:
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
    bulletClass: "text-emerald-200 bg-emerald-950/30 border-emerald-500/15 hover:bg-emerald-950/45",
    showGrid: true,
  },
];

export function ProblemSolution() {
  return (
    <section id="roi" className="mx-auto max-w-6xl px-6 py-24 md:py-32 relative">
      {/* Decorative blurred background elements for the section */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <Reveal className="mb-16 text-center">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-3">
          Field Analytics & ROI
        </span>
        <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl max-w-3xl mx-auto leading-[1.15]">
          Precision is the Difference Between Profit and Loss
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
          Stop guessing. Traditional farming blankets fields blindly, while Spatio Agri delivers
          surgical accuracy to every square foot.
        </p>
      </Reveal>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-8 md:grid-cols-2 lg:gap-10"
      >
        {comparisons.map((item) => (
          <motion.article
            key={item.title}
            variants={staggerChild}
            className={`relative min-h-[480px] rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-500 shadow-md hover:shadow-2xl group ${item.accent} ${item.cardClass}`}
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105 filter brightness-95"
              />
              {/* Overlay with subtle tinted gradients */}
              <div className={`absolute inset-0 z-10 ${item.overlayClass}`} />

              {/* Optional Grid Overlay */}
              {item.showGrid && (
                <div className="grid-pattern opacity-15 absolute inset-0 z-15 pointer-events-none" />
              )}
            </div>

            {/* Content Container */}
            <div className="relative z-20 p-8 md:p-10 flex flex-col justify-between h-full flex-grow">
              {/* Header: Icon & Badge */}
              <div className="flex items-center justify-between mb-8">
                <div
                  className={`p-3 rounded-2xl border backdrop-blur-md flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 ${item.iconClass}`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border uppercase backdrop-blur-md ${item.badgeClass}`}
                >
                  {item.badge}
                </span>
              </div>

              {/* Text: Title & Description */}
              <div className="mb-8">
                <h3 className="mb-3 font-display text-2xl font-bold text-white tracking-tight leading-tight">
                  {item.title}
                </h3>
                <p className="text-zinc-300 leading-relaxed text-sm md:text-base font-sans">
                  {item.body}
                </p>
              </div>

              {/* Footer: Bullets */}
              <ul className="grid gap-3 sm:grid-cols-2 mt-auto">
                {item.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className={`flex items-center gap-2.5 text-xs font-semibold py-2.5 px-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${item.bulletClass}`}
                  >
                    <item.bulletIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
