import { MapPin, PlaneTakeoff, Cpu, FileDown, TrendingUp } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./primitives/Reveal";

import step_01 from "../../Images/step_01.avif";
import step_02 from "../../Images/step_02.avif";
import step_03 from "../../Images/step_03.avif";
import step_04 from "../../Images/step_04.avif";
import step_05 from "../../Images/step_05.avif";

const steps = [
  {
    title: "Request a Scan",
    body: "Log into the dashboard and pin your field boundaries. Select your crop type and priority level.",
    icon: MapPin,
    color: "bg-[#062419] text-emerald-400 border-emerald-500/30",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    align: "left",
    imageUrl: step_01,
  },
  {
    title: "Automated Flight",
    body: "A certified Spatio pilot arrives within 24 hours to scan fields with centimeter-level resolution.",
    icon: PlaneTakeoff,
    color: "bg-blue-950 text-blue-400 border-blue-500/30",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    align: "right",
    imageUrl: step_02,
  },
  {
    title: "Data Processing",
    body: "Cloud-based AI analyzes crop health, NDVI index, and multispectral data in minutes.",
    icon: Cpu,
    color: "bg-teal-950 text-teal-400 border-teal-500/30",
    glow: "shadow-[0_0_20px_rgba(20,184,166,0.15)]",
    align: "left",
    imageUrl: step_03,
  },
  {
    title: "Get Your Map",
    body: "Receive a prescription file ready to plug directly into your tractor's variable-rate control system.",
    icon: FileDown,
    color: "bg-[#0c1020] text-indigo-400 border-indigo-500/35",
    glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
    align: "right",
    imageUrl: step_04,
  },
  {
    title: "Optimize Yield",
    body: "Apply variable-rate inputs surgically to maximize yield, cut costs, and boost crop health.",
    icon: TrendingUp,
    color: "bg-[#042010] text-[#10b981] border-emerald-500/35",
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.3)]",
    align: "left",
    imageUrl: step_05,
  },
];

// Builds a smooth alternating S-curve through each step's badge position, replacing a straight spine.
function buildWorkflowCurve(count: number, viewHeight: number) {
  const centerX = 24;
  const amplitude = 64;
  const rowHeight = viewHeight / count;
  const ys = Array.from({ length: count }, (_, i) => (i + 0.5) * rowHeight);
  let d = `M ${centerX},${ys[0]}`;
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i];
    const y1 = ys[i + 1];
    const dir = i % 2 === 0 ? 1 : -1;
    const cx = centerX + dir * amplitude;
    const c1y = y0 + (y1 - y0) * 0.33;
    const c2y = y0 + (y1 - y0) * 0.67;
    d += ` C ${cx},${c1y} ${cx},${c2y} ${centerX},${y1}`;
  }
  return d;
}

const WORKFLOW_CURVE_HEIGHT = steps.length * 160;
const workflowCurvePath = buildWorkflowCurve(steps.length, WORKFLOW_CURVE_HEIGHT);

export function Workflow() {
  const containerRef = useRef<HTMLDivElement>(null);

  // useScroll to bind pathLength to scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
  });

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative w-full py-28 md:py-36 bg-slate-50/50 border-y border-slate-100 overflow-hidden"
    >
      {/* Sleek Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] grid-bg" />

      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {/* Section Header */}
        <Reveal className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl leading-tight">
            From Sky to Soil in 5 Steps
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base md:text-lg">
            A streamlined digital pipeline built for speed, accuracy, and maximum efficiency.
          </p>
        </Reveal>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto mt-16">
          {/* SVG Scroll-Animated Path with Clean Technical Chevrons (Desktop only) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-12 hidden md:block pointer-events-none z-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 48 ${WORKFLOW_CURVE_HEIGHT}`}
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#062419" />
                  <stop offset="30%" stopColor="#2563eb" />
                  <stop offset="60%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Base grey curve */}
              <path
                d={workflowCurvePath}
                stroke="#e2e8f0"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                className="opacity-70"
              />

              {/* Animated scroll-linked curve */}
              <motion.path
                d={workflowCurvePath}
                stroke="url(#line-grad)"
                strokeWidth="3"
                strokeDasharray="6 6"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {/* Vertical dashed line for mobile */}
          <div className="absolute left-6 top-8 bottom-8 w-px border-l-2 border-dashed border-slate-200 md:hidden z-0" />

          {/* Timeline Items */}
          <div className="space-y-16 md:space-y-24 relative z-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 1;
              return (
                <div key={step.title} className="w-full">
                  {/* Desktop Grid Layout */}
                  <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-12 w-full">
                    {/* Left Side: Content for odd steps; Pop-up Image for even steps */}
                    <div className="flex justify-end">
                      {!isEven ? (
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, margin: "-60px" }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="space-y-2 pr-4 text-right"
                        >
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                            Step 0{index + 1}
                          </span>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                            {step.title}
                          </h3>
                          <p className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed max-w-md ml-auto">
                            {step.body}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85, x: -30 }}
                          whileInView={{ opacity: 1, scale: 1, x: 0 }}
                          viewport={{ once: false, margin: "-80px" }}
                          transition={{ type: "spring", stiffness: 100, damping: 15 }}
                          className="relative max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg group bg-white p-1"
                        >
                          <img
                            src={step.imageUrl}
                            alt={step.title}
                            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Center Badge */}
                    <div className="flex justify-center z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false, margin: "-80px" }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                        whileHover={{ scale: 1.08 }}
                        className={`h-16 w-16 rounded-full border-2 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-shadow ring-8 ring-slate-50/50 ${step.color} ${step.glow}`}
                      >
                        <step.icon className="w-6 h-6 stroke-[2]" />
                      </motion.div>
                    </div>

                    {/* Right Side: Pop-up Image for odd steps; Content for even steps */}
                    <div className="flex justify-start">
                      {isEven ? (
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, margin: "-60px" }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="space-y-2 pl-4 text-left"
                        >
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                            Step 0{index + 1}
                          </span>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                            {step.title}
                          </h3>
                          <p className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed max-w-md">
                            {step.body}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85, x: 30 }}
                          whileInView={{ opacity: 1, scale: 1, x: 0 }}
                          viewport={{ once: false, margin: "-80px" }}
                          transition={{ type: "spring", stiffness: 100, damping: 15 }}
                          className="relative max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg group bg-white p-1"
                        >
                          <img
                            src={step.imageUrl}
                            alt={step.title}
                            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Flex Layout */}
                  <div className="flex md:hidden items-start gap-4 w-full">
                    {/* Left Badge */}
                    <div className="flex-shrink-0 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false, margin: "-60px" }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                        className={`h-12 w-12 rounded-full border-2 backdrop-blur-sm flex items-center justify-center ring-4 ring-slate-50/50 ${step.color} ${step.glow}`}
                      >
                        <step.icon className="w-5 h-5 stroke-[2]" />
                      </motion.div>
                    </div>

                    {/* Right Content */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, margin: "-60px" }}
                      transition={{ duration: 0.5 }}
                      className="space-y-3 pt-1.5 flex-grow"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Step 0{index + 1}
                        </span>
                        <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed mt-1">
                          {step.body}
                        </p>
                      </div>

                      {/* Mobile Inline Image Pop-up */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: false, margin: "-40px" }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full max-w-[240px] aspect-[4/3] rounded-xl overflow-hidden border border-slate-200/40 shadow-md bg-white p-0.5"
                      >
                        <img
                          src={step.imageUrl}
                          alt={step.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
